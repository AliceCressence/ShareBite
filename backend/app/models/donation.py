from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import TYPE_CHECKING

from app.core.database import Base

if TYPE_CHECKING:
    from .user import User  # noqa: F401


class Donation(Base):
    __tablename__ = "donation"

    id = Column(Integer, primary_key=True, index=True)
    food_item = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    quantity = Column(String, nullable=False)
    images = Column(String, nullable=True)  # Storing as comma-separated URLs for simplicity
    pickup_location_lat = Column(Float, nullable=False)
    pickup_location_lon = Column(Float, nullable=False)
    preferred_pickup_time = Column(String, nullable=True)
    expiration_date = Column(DateTime(timezone=True), nullable=True)
    allergens = Column(String, nullable=True) # Storing as comma-separated strings
    is_perishable = Column(Boolean, default=False)
    status = Column(String, default="available", nullable=False) # e.g., "available", "claimed", "picked_up"

    donor_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    donor = relationship("User", back_populates="donations_made", foreign_keys=[donor_id])

    claimant_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    claimant = relationship("User", back_populates="donations_claimed", foreign_keys=[claimant_id])

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
