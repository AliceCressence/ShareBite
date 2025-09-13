from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, HttpUrl, field_validator


class DonationBase(BaseModel):
    food_item: str
    description: Optional[str] = None
    quantity: str
    images: Optional[List[HttpUrl]] = None
    pickup_location_lat: float
    pickup_location_lon: float
    preferred_pickup_time: Optional[str] = None
    expiration_date: Optional[datetime] = None
    allergens: Optional[List[str]] = None
    is_perishable: bool = False

class DonationCreate(DonationBase):
    @field_validator('allergens', mode='before')
    @classmethod
    def validate_allergens(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            return [item.strip() for item in v.split(',') if item.strip()]
        return v

class DonationUpdate(DonationBase):
    status: Optional[str] = None # Allow updating status

    @field_validator('allergens', mode='before')
    @classmethod
    def validate_allergens(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            return [item.strip() for item in v.split(',') if item.strip()]
        return v

class DonationInDBBase(DonationBase):
    id: int
    donor_id: int
    claimant_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Donation(DonationInDBBase):
    pass
