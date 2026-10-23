from pydantic import BaseModel, Field


class RFQCreate(BaseModel):
    supplier_id: str

    title: str = Field(
        min_length=3,
        max_length=300,
    )

    category: str = ""
    material: str = ""

    quantity: int = Field(
        gt=0
    )

    target_unit_budget: float | None = Field(
        default=None,
        ge=0,
    )

    target_delivery_days: int = Field(
        default=14,
        gt=0,
    )

    specifications: str = ""

    certifications_required: list[str] = Field(
        default_factory=list
    )

    attachments: list[dict] = Field(
        default_factory=list
    )


class RFQQuoteCreate(BaseModel):
    unit_price: float = Field(
        gt=0
    )

    currency: str = "INR"

    tooling_cost: float = Field(
        default=0,
        ge=0,
    )

    estimated_lead_days: int = Field(
        gt=0
    )

    notes: str = ""

    valid_until: str = ""