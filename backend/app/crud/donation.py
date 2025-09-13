from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.donation import Donation
from app.schemas.donation import DonationCreate, DonationUpdate


def create_donation(db: Session, donation: DonationCreate, donor_id: int):
    # Convert allergens list to comma-separated string for database storage
    donation_data = donation.dict(exclude_unset=True)
    if donation_data.get('allergens'):
        donation_data['allergens'] = ','.join(donation_data['allergens'])

    db_donation = Donation(
        **donation_data,
        donor_id=donor_id
    )
    db.add(db_donation)
    db.commit()
    db.refresh(db_donation)
    return db_donation

def get_donation(db: Session, donation_id: int):
    return db.query(Donation).filter(Donation.id == donation_id).first()

def get_donations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Donation).offset(skip).limit(limit).all()

def update_donation(db: Session, db_donation: Donation, donation_in: DonationUpdate):
    update_data = donation_in.dict(exclude_unset=True)

    # Convert allergens list to comma-separated string for database storage
    if update_data.get('allergens'):
        update_data['allergens'] = ','.join(update_data['allergens'])

    for key, value in update_data.items():
        setattr(db_donation, key, value)
    db.add(db_donation)
    db.commit()
    db.refresh(db_donation)
    return db_donation

def delete_donation(db: Session, donation_id: int):
    db_donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if db_donation:
        db.delete(db_donation)
        db.commit()
    return db_donation

def get_user_donations(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Donation).filter(Donation.donor_id == user_id).offset(skip).limit(limit).all()

def get_donations_claimed_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Donation).filter(Donation.claimant_id == user_id).offset(skip).limit(limit).all()

def claim_donation(db: Session, donation_id: int, claimant_id: int):
    db_donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if db_donation and db_donation.status == "available":
        db_donation.claimant_id = claimant_id
        db_donation.status = "claimed"
        db.add(db_donation)
        db.commit()
        db.refresh(db_donation)
    return db_donation
