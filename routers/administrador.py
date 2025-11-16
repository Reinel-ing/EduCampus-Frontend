from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.administrador import Administrador
from schemas.administrador import AdministradorCreate, AdministradorUpdate, AdministradorResponse

router = APIRouter(prefix="/administrador", tags=["Administrador"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=AdministradorResponse, status_code=status.HTTP_201_CREATED)
def create_administrador(administrador: AdministradorCreate, db: Session = Depends(get_db)):
    db_administrador = Administrador(**administrador.model_dump())
    db.add(db_administrador)
    db.commit()
    db.refresh(db_administrador)
    return db_administrador

@router.get("/", response_model=list[AdministradorResponse])
def list_administradores(db: Session = Depends(get_db)):
    return db.query(Administrador).all()

@router.get("/{administrador_id}", response_model=AdministradorResponse)
def get_administrador(administrador_id: int, db: Session = Depends(get_db)):
    administrador = db.query(Administrador).filter(Administrador.id_administrador == administrador_id).first()
    if not administrador:
        raise HTTPException(status_code=404, detail="Administrador no encontrado")
    return administrador

@router.put("/{administrador_id}", response_model=AdministradorResponse)
def update_administrador(administrador_id: int, administrador: AdministradorUpdate, db: Session = Depends(get_db)):
    db_administrador = db.query(Administrador).filter(Administrador.id_administrador == administrador_id).first()
    if not db_administrador:
        raise HTTPException(status_code=404, detail="Administrador no encontrado")
    for key, value in administrador.model_dump(exclude_unset=True).items():
        setattr(db_administrador, key, value)
    db.commit()
    db.refresh(db_administrador)
    return db_administrador

@router.delete("/{administrador_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_administrador(administrador_id: int, db: Session = Depends(get_db)):
    db_administrador = db.query(Administrador).filter(Administrador.id_administrador == administrador_id).first()
    if not db_administrador:
        raise HTTPException(status_code=404, detail="Administrador no encontrado")
    db.delete(db_administrador)
    db.commit()
