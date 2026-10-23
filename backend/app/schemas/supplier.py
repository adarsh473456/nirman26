from pydantic import BaseModel, Field

class SupplierUpsert(BaseModel):
    company_name: str = Field(min_length=2, max_length=255)
    tagline: str = ""
    overview: str = ""
    category: str
    subcategories: list[str] = Field(default_factory=list)
    capabilities: list[str] = Field(default_factory=list)
    materials: list[str] = Field(default_factory=list)
    certifications: list[dict] = Field(default_factory=list)
    machinery: list[dict] = Field(default_factory=list)
    images: dict = Field(default_factory=dict)
    contact: dict = Field(default_factory=dict)
    city: str = ""
    state: str = ""
    country: str = "India"
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    gst_number: str = ""
    registered_legal_name: str = ""
    employee_count: str = ""
    established_year: int = 2026
    moq: int = Field(default=1, ge=1)
    avg_lead_time_days: int = Field(default=14, ge=1)
