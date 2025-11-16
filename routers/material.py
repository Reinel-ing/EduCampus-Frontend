import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.material_didactico import MaterialDidactico
from models.curso import Curso
from schemas.material import MaterialResponse
from datetime import date
from dotenv import load_dotenv
import os

load_dotenv()

API_SECRET = os.getenv("API_SECRET")


cloudinary.config(
    cloud_name="dgnm4nrnp",
    api_key="246573678451621",
    api_secret=API_SECRET,
    secure=True
)

router = APIRouter(prefix="/material", tags=["Material Didáctico"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload", response_model=MaterialResponse, status_code=status.HTTP_201_CREATED)
async def subir_material(
    id_curso: int = Form(...),
    nombre_archivo: str = Form(...),
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if archivo.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Solo se permiten archivos PDF")
    result = cloudinary.uploader.upload(
        file=archivo.file,
        resource_type="raw",
        public_id=nombre_archivo
    )
    url = result["secure_url"]
    nuevo_material = MaterialDidactico(
        id_curso=id_curso,
        archivo_url=url,
        nombre_archivo=nombre_archivo,
        fecha=date.today()
    )
    db.add(nuevo_material)
    db.commit()
    db.refresh(nuevo_material)
    return nuevo_material

@router.get("/por-curso/{curso_id}", response_model=list[MaterialResponse])
def listar_material_por_curso(curso_id: int, db: Session = Depends(get_db)):
    return db.query(MaterialDidactico).filter(MaterialDidactico.id_curso == curso_id).all()

from fastapi.responses import JSONResponse

@router.get("/descargar/{material_id}", response_class=JSONResponse)
def descargar_material(material_id: int, db: Session = Depends(get_db)):
    material = db.query(MaterialDidactico).filter(MaterialDidactico.id_material == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    return JSONResponse(content={"url": material.archivo_url})

@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_material(material_id: int, db: Session = Depends(get_db)):
    material = db.query(MaterialDidactico).filter(MaterialDidactico.id_material == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    db.delete(material)
    db.commit()

@router.get("/por-docente/{docente_id}", response_model=list[dict])
def listar_material_por_docente(docente_id: int, db: Session = Depends(get_db)):
    cursos = db.query(Curso).filter(Curso.id_docente == docente_id).all()
    
    if not cursos:
        return []
    
    materiales = []
    for curso in cursos:
        materiales_curso = db.query(MaterialDidactico).filter(MaterialDidactico.id_curso == curso.id_curso).all()
        
        for material in materiales_curso:
            materiales.append({
                "id_material": material.id_material,
                "nombre_archivo": material.nombre_archivo,
                "archivo_url": material.archivo_url,
                "fecha": str(material.fecha),
                "curso": curso.nombre,
                "id_curso": curso.id_curso
            })
    
    return materiales
