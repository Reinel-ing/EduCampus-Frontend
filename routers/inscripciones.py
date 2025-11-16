from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.estudiante_curso import EstudianteCurso
from models.curso import Curso
from models.estudiante import Estudiante
from schemas.inscripcion import InscripcionCreate, InscripcionResponse

router = APIRouter(prefix="/inscripciones", tags=["Inscripciones"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=InscripcionResponse, status_code=status.HTTP_201_CREATED)
def inscribir_estudiante(inscripcion: InscripcionCreate, db: Session = Depends(get_db)):
    curso = db.query(Curso).filter(Curso.id_curso == inscripcion.id_curso).first()
    if not curso:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    inscritos = db.query(EstudianteCurso).filter(EstudianteCurso.id_curso == inscripcion.id_curso).count()
    if inscritos >= curso.cupo_estudiante:
        raise HTTPException(status_code=400, detail="Cupo lleno")
    repetido = db.query(EstudianteCurso).filter(EstudianteCurso.id_curso == inscripcion.id_curso, EstudianteCurso.id_estudiante == inscripcion.id_estudiante).first()
    if repetido:
        raise HTTPException(status_code=400, detail="Estudiante ya inscrito")
    db_inscripcion = EstudianteCurso(**inscripcion.model_dump())
    db.add(db_inscripcion)
    db.commit()
    db.refresh(db_inscripcion)
    return db_inscripcion

@router.delete("/{inscripcion_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_inscripcion(inscripcion_id: int, db: Session = Depends(get_db)):
    inscripcion = db.query(EstudianteCurso).filter(EstudianteCurso.id == inscripcion_id).first()
    if not inscripcion:
        raise HTTPException(status_code=404, detail="Inscripción no encontrada")
    db.delete(inscripcion)
    db.commit()

@router.get("/por-estudiante/{estudiante_id}", response_model=list)
def cursos_por_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    inscripciones = db.query(EstudianteCurso).filter(EstudianteCurso.id_estudiante == estudiante_id).all()
    return [i.id_curso for i in inscripciones]

@router.get("/por-curso/{curso_id}", response_model=list)
def estudiantes_por_curso(curso_id: int, db: Session = Depends(get_db)):
    inscripciones = db.query(EstudianteCurso).filter(EstudianteCurso.id_curso == curso_id).all()
    return [i.id_estudiante for i in inscripciones]
