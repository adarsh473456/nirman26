from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = ""

    category: str | None = None

    location: str | None = None

    materials: list[str] = Field(
        default_factory=list
    )

    certifications: list[str] = Field(
        default_factory=list
    )

    verified_only: bool = False

    use_ai: bool = False

    min_moq: int | None = Field(default=None, ge=1)
    max_moq: int | None = Field(default=None, ge=1)
    max_lead_time_days: int | None = Field(default=None, ge=1)
    employee_count: str | None = None
    capabilities: list[str] = Field(default_factory=list)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    radius_km: float | None = Field(default=None, gt=0, le=2000)


class SearchIntent(BaseModel):
    keywords: list[str] = Field(
        default_factory=list
    )

    category: str | None = None

    materials: list[str] = Field(
        default_factory=list
    )

    certifications: list[str] = Field(
        default_factory=list
    )

    capabilities: list[str] = Field(
        default_factory=list
    )

    location: str | None = None