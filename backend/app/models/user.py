from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .donation import Donation # noqa: F401


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    donations_made = relationship("Donation", back_populates="donor", foreign_keys="[Donation.donor_id]")
    donations_claimed = relationship("Donation", back_populates="claimant", foreign_keys="[Donation.claimant_id]")
