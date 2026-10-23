import json
import math

from fastapi import APIRouter, Depends
from sqlalchemy import String, cast, or_
from sqlalchemy.orm import Session

from app.api.dependencies import current_user
from app.api.routes.suppliers import serialize
from app.database.session import get_db
from app.models import Supplier, User
from app.schemas.search import SearchIntent, SearchRequest
from app.services.search_service import search_suppliers
from app.ai.natural_language_search import parse_search_intent


router = APIRouter(
    prefix="/search",
    tags=["search"],
)


def clean_values(
    values: list[str] | None,
) -> list[str]:
    if not values:
        return []

    output: list[str] = []
    seen: set[str] = set()

    for value in values:
        cleaned = str(value).strip()

        if not cleaned:
            continue

        key = cleaned.lower()

        if key in seen:
            continue

        seen.add(key)
        output.append(cleaned)

    return output


def safe_parse_intent(
    payload: SearchRequest,
) -> SearchIntent | None:
    if (
        not payload.use_ai
        or not payload.query.strip()
    ):
        return None

    try:
        return parse_search_intent(
            payload.query.strip()
        )

    except Exception as exc:
        print(
            "AI search intent parsing "
            f"unavailable: {exc}"
        )

        return None


def supplier_json_text(
    value,
) -> str:
    try:
        return json.dumps(
            value or []
        ).lower()

    except Exception:
        return str(
            value or ""
        ).lower()


def calculate_fallback_score(
    supplier: Supplier,
    payload: SearchRequest,
    intent: SearchIntent | None,
) -> float:
    score = 0.0

    company_name = (
        supplier.company_name
        or ""
    ).lower()

    tagline = (
        supplier.tagline
        or ""
    ).lower()

    overview = (
        supplier.overview
        or ""
    ).lower()

    category = (
        supplier.category
        or ""
    ).lower()

    city = (
        supplier.city
        or ""
    ).lower()

    state = (
        supplier.state
        or ""
    ).lower()

    country = (
        supplier.country
        or ""
    ).lower()

    subcategories = supplier_json_text(
        supplier.subcategories
    )

    capabilities = supplier_json_text(
        supplier.capabilities
    )

    materials = supplier_json_text(
        supplier.materials
    )

    certifications = supplier_json_text(
        supplier.certifications
    )

    machinery = supplier_json_text(
        supplier.machinery
    )

    searchable_text = " ".join(
        [
            company_name,
            tagline,
            overview,
            category,
            city,
            state,
            country,
            subcategories,
            capabilities,
            materials,
            certifications,
            machinery,
        ]
    )

    if supplier.verified:
        score += 10.0

    query_text = (
        payload.query
        or ""
    ).strip().lower()

    if query_text:
        if query_text in company_name:
            score += 30.0

        if query_text in category:
            score += 20.0

        if query_text in searchable_text:
            score += 10.0

        for word in query_text.split():
            if word in searchable_text:
                score += 4.0

    requested_category = (
        payload.category
        or (
            intent.category
            if intent
            else None
        )
    )

    if requested_category:
        requested_category = (
            requested_category
            .strip()
            .lower()
        )

        if (
            requested_category
            and requested_category
            in category
        ):
            score += 20.0

    requested_location = (
        payload.location
        or (
            intent.location
            if intent
            else None
        )
    )

    if requested_location:
        requested_location = (
            requested_location
            .strip()
            .lower()
        )

        if (
            requested_location
            and requested_location
            != "all locations"
            and (
                requested_location
                in city
                or requested_location
                in state
                or requested_location
                in country
            )
        ):
            score += 15.0

    requested_materials = list(
        payload.materials
    )

    if intent:
        requested_materials.extend(
            intent.materials
        )

    for material in clean_values(
        requested_materials
    ):
        if (
            material.lower()
            in materials
        ):
            score += 10.0

    requested_certifications = list(
        payload.certifications
    )

    if intent:
        requested_certifications.extend(
            intent.certifications
        )

    for certification in clean_values(
        requested_certifications
    ):
        if (
            certification.lower()
            in certifications
        ):
            score += 12.0

    if intent:
        for capability in clean_values(
            intent.capabilities
        ):
            if (
                capability.lower()
                in capabilities
            ):
                score += 10.0

    return round(
        score,
        2,
    )


def database_search(
    db: Session,
    payload: SearchRequest,
):
    intent = safe_parse_intent(
        payload
    )

    query = db.query(
        Supplier
    )

    # CATEGORY
    category = (
        payload.category.strip()
        if payload.category
        else ""
    )

    if (
        not category
        and intent
        and intent.category
    ):
        category = (
            intent.category.strip()
        )

    if category:
        query = query.filter(
            Supplier.category.ilike(
                f"%{category}%"
            )
        )

    # LOCATION
    location = (
        payload.location.strip()
        if payload.location
        else ""
    )

    if (
        not location
        and intent
        and intent.location
    ):
        location = (
            intent.location.strip()
        )

    if (
        location
        and location.lower()
        != "all locations"
    ):
        location_pattern = (
            f"%{location}%"
        )

        query = query.filter(
            or_(
                Supplier.city.ilike(
                    location_pattern
                ),
                Supplier.state.ilike(
                    location_pattern
                ),
                Supplier.country.ilike(
                    location_pattern
                ),
            )
        )

    # ADVANCED FILTERS
    if payload.min_moq is not None:
        query = query.filter(Supplier.moq >= payload.min_moq)
    if payload.max_moq is not None:
        query = query.filter(Supplier.moq <= payload.max_moq)
    if payload.max_lead_time_days is not None:
        query = query.filter(Supplier.avg_lead_time_days <= payload.max_lead_time_days)
    if payload.employee_count:
        query = query.filter(Supplier.employee_count.ilike(f"%{payload.employee_count.strip()}%"))
    for capability in clean_values(payload.capabilities):
        query = query.filter(cast(Supplier.capabilities, String).ilike(f"%{capability}%"))

    # VERIFIED
    if payload.verified_only:
        query = query.filter(
            Supplier.verified.is_(
                True
            )
        )

    # MATERIALS
    materials = clean_values(
        payload.materials
    )

    if intent:
        materials = clean_values(
            materials
            + intent.materials
        )

    for material in materials:
        query = query.filter(
            cast(
                Supplier.materials,
                String,
            ).ilike(
                f"%{material}%"
            )
        )

    # CERTIFICATIONS
    certifications = clean_values(
        payload.certifications
    )

    if intent:
        certifications = clean_values(
            certifications
            + intent.certifications
        )

    for certification in certifications:
        query = query.filter(
            cast(
                Supplier.certifications,
                String,
            ).ilike(
                f"%{certification}%"
            )
        )

    # CAPABILITIES EXTRACTED BY AI
    if intent:
        capabilities = clean_values(
            intent.capabilities
        )

        for capability in capabilities:
            query = query.filter(
                cast(
                    Supplier.capabilities,
                    String,
                ).ilike(
                    f"%{capability}%"
                )
            )

    # KEYWORDS
    search_terms: list[str] = []

    normal_query = (
        payload.query
        or ""
    ).strip()

    if normal_query:
        search_terms.extend(
            [
                word
                for word
                in normal_query.split()
                if word.strip()
            ]
        )

    if intent:
        search_terms.extend(
            intent.keywords
        )

    search_terms = clean_values(
        search_terms
    )

    for term in search_terms:
        pattern = f"%{term}%"

        query = query.filter(
            or_(
                Supplier.company_name.ilike(
                    pattern
                ),
                Supplier.tagline.ilike(
                    pattern
                ),
                Supplier.overview.ilike(
                    pattern
                ),
                Supplier.category.ilike(
                    pattern
                ),
                Supplier.city.ilike(
                    pattern
                ),
                Supplier.state.ilike(
                    pattern
                ),
                Supplier.country.ilike(
                    pattern
                ),
                cast(
                    Supplier.subcategories,
                    String,
                ).ilike(
                    pattern
                ),
                cast(
                    Supplier.capabilities,
                    String,
                ).ilike(
                    pattern
                ),
                cast(
                    Supplier.materials,
                    String,
                ).ilike(
                    pattern
                ),
                cast(
                    Supplier.certifications,
                    String,
                ).ilike(
                    pattern
                ),
                cast(
                    Supplier.machinery,
                    String,
                ).ilike(
                    pattern
                ),
            )
        )

    suppliers = (
        query
        .order_by(
            Supplier.verified.desc(),
            Supplier.updated_at.desc(),
        )
        .limit(200 if payload.radius_km else 50)
        .all()
    )

    # Exact radius filtering when buyer coordinates are supplied.
    if payload.radius_km and payload.latitude is not None and payload.longitude is not None:
        def distance_km(supplier):
            if supplier.latitude is None or supplier.longitude is None:
                return None
            r = 6371.0088
            p1, p2 = math.radians(payload.latitude), math.radians(supplier.latitude)
            dp = math.radians(supplier.latitude - payload.latitude)
            dl = math.radians(supplier.longitude - payload.longitude)
            a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
            return 2*r*math.asin(math.sqrt(a))
        suppliers = [(s, distance_km(s)) for s in suppliers]
        suppliers = [(s,d) for s,d in suppliers if d is not None and d <= payload.radius_km]
        suppliers.sort(key=lambda pair: pair[1])
        distance_map = {str(s.id): round(d, 2) for s,d in suppliers}
        suppliers = [s for s,_ in suppliers][:50]
    else:
        distance_map = {}

    output = []

    for supplier in suppliers:
        item = serialize(
            supplier
        )

        if str(supplier.id) in distance_map:
            item["distanceKm"] = distance_map[str(supplier.id)]

        item["matchScore"] = (
            calculate_fallback_score(
                supplier,
                payload,
                intent,
            )
        )

        output.append(
            item
        )

    output.sort(
        key=lambda item: item.get(
            "matchScore",
            0,
        ),
        reverse=True,
    )

    return output


def elasticsearch_search(
    db: Session,
    payload: SearchRequest,
):
    matches = search_suppliers(
        payload.query,
        payload.category,
        payload.location,
        payload.verified_only,
        payload.use_ai,
    )

    supplier_ids = [
        row["supplier_id"]
        for row in matches
    ]

    if not supplier_ids:
        return []

    suppliers = {
        str(supplier.id): supplier
        for supplier in (
            db.query(Supplier)
            .filter(
                Supplier.id.in_(
                    supplier_ids
                )
            )
            .all()
        )
    }

    output = []

    for row in matches:
        supplier = suppliers.get(
            row["supplier_id"]
        )

        if not supplier:
            continue

        item = serialize(
            supplier
        )

        item["matchScore"] = (
            row.get(
                "score",
                0,
            )
        )

        output.append(
            item
        )

    return output


@router.post("")
def search(
    payload: SearchRequest,
    db: Session = Depends(
        get_db
    ),
    _: User = Depends(
        current_user
    ),
):
    """
    Supplier Discovery Search.

    Elasticsearch is attempted for searches
    supported by the existing ES index.

    PostgreSQL handles materials and
    certifications directly.

    PostgreSQL also automatically takes over
    whenever Elasticsearch is unavailable.
    """

    if (
        payload.materials
        or payload.certifications
        or payload.capabilities
        or payload.min_moq is not None
        or payload.max_moq is not None
        or payload.max_lead_time_days is not None
        or payload.employee_count
        or payload.radius_km is not None
    ):
        return database_search(
            db,
            payload,
        )

    try:
        return elasticsearch_search(
            db,
            payload,
        )

    except Exception as exc:
        print(
            "Elasticsearch search "
            "unavailable; using "
            "PostgreSQL fallback: "
            f"{exc}"
        )

        return database_search(
            db,
            payload,
        )