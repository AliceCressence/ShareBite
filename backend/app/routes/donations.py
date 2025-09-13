from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.utils.minio_client import minio_client, ensure_bucket_exists
from app.core.config import settings
from uuid import uuid4
from PIL import Image
import io

from app import crud, models, schemas
from app.deps import get_db, get_current_user


router = APIRouter()


@router.post("/", response_model=schemas.Donation)
def create_donation(
    *,
    db: Session = Depends(get_db),
    donation_in: schemas.DonationCreate,
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Create new donation.
    """
    donation = crud.donation.create_donation(db=db, donation=donation_in, donor_id=current_user.id)
    return donation


@router.get("/", response_model=List[schemas.Donation])
def read_donations(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Retrieve donations.
    """
    donations = crud.donation.get_donations(db, skip=skip, limit=limit)

    # Convert allergens string to list for each donation
    result = []
    for donation in donations:
        donation_dict = donation.__dict__.copy()
        # Convert allergens string to list
        if donation_dict.get('allergens'):
            allergens_str = donation_dict['allergens']
            if isinstance(allergens_str, str):
                # Handle different string formats
                if allergens_str.startswith('{') and allergens_str.endswith('}'):
                    allergens_str = allergens_str[1:-1]
                donation_dict['allergens'] = [item.strip() for item in allergens_str.split(',') if item.strip()]
        else:
            donation_dict['allergens'] = None
        result.append(donation_dict)

    return result


@router.get("/{donation_id}", response_model=schemas.Donation)
def read_donation(
    *,
    db: Session = Depends(get_db),
    donation_id: int,
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Get donation by ID.
    """
    donation = crud.donation.get_donation(db, donation_id=donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    # Convert allergens string to list
    donation_dict = donation.__dict__.copy()
    if donation_dict.get('allergens'):
        allergens_str = donation_dict['allergens']
        if isinstance(allergens_str, str):
            # Handle different string formats
            if allergens_str.startswith('{') and allergens_str.endswith('}'):
                allergens_str = allergens_str[1:-1]
            donation_dict['allergens'] = [item.strip() for item in allergens_str.split(',') if item.strip()]
    else:
        donation_dict['allergens'] = None

    return donation_dict


@router.put("/{donation_id}", response_model=schemas.Donation)
def update_donation(
    *,
    db: Session = Depends(get_db),
    donation_id: int,
    donation_in: schemas.DonationUpdate,
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Update a donation.
    """
    donation = crud.donation.get_donation(db, donation_id=donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    if donation.donor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    donation = crud.donation.update_donation(db, db_donation=donation, donation_in=donation_in)
    return donation


@router.delete("/{donation_id}", response_model=schemas.Donation)
def delete_donation(
    *,
    db: Session = Depends(get_db),
    donation_id: int,
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Delete a donation.
    """
    donation = crud.donation.get_donation(db, donation_id=donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    if donation.donor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    donation = crud.donation.delete_donation(db, donation_id=donation_id)
    return donation


@router.post("/{donation_id}/claim", response_model=schemas.donation.Donation)
def claim_donation(
    *,
    db: Session = Depends(get_db),
    donation_id: int,
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Claim a donation.
    """
    donation = crud.donation.get_donation(db, donation_id=donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    if donation.status != "available":
        raise HTTPException(status_code=400, detail="Donation is not available for claiming")
    if donation.donor_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot claim your own donation")

    donation = crud.donation.claim_donation(db, donation_id=donation_id, claimant_id=current_user.id)
    return donation


@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image type")
    # Read file
    contents = file.file.read()
    # Optionally, validate image
    try:
        img = Image.open(io.BytesIO(contents))
        img.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")
    # Generate unique filename
    ext = file.filename.split(".")[-1]
    filename = f"{uuid4()}.{ext}"
    # Ensure bucket exists
    ensure_bucket_exists(settings.MINIO_BUCKET)
    # Upload to MinIO
    minio_client.put_object(
        settings.MINIO_BUCKET,
        filename,
        io.BytesIO(contents),
        length=len(contents),
        content_type=file.content_type,
    )
    # Build public URL (assuming MinIO is public or proxied)
    url = f"/minio/{settings.MINIO_BUCKET}/{filename}"
    return {"url": url, "filename": filename}
