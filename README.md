# EduCampus — Sistema de Gestión Académica

Plataforma web para la gestión académica de estudiantes, docentes y administradores. Permite registrar cursos, inscripciones, calificaciones, asistencia y material didáctico.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | FastAPI + SQLAlchemy + PostgreSQL |
| Autenticación | JWT + Bcrypt |
| Pruebas Frontend | Jest + @testing-library/react |
| Pruebas Backend | pytest + FastAPI TestClient |

---

## Estructura del Proyecto

```
proyec-EduCampus/
├── EduCampus/                  # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── context/            # AuthContext (sesión global)
│   │   ├── hooks/              # Validadores de formularios
│   │   ├── pages/              # Vistas por rol (admin, docente, estudiante)
│   │   ├── services/           # Llamadas a la API REST
│   │   └── tests/              # Pruebas unitarias, integración, sistema y aceptación
│   ├── generate-report.js      # Generador del informe HTML de pruebas
│   └── vite.config.js
│
└── API-EduCampus/              # Backend FastAPI
    ├── models/                 # Modelos SQLAlchemy (ORM)
    ├── schemas/                # Esquemas Pydantic (validación)
    ├── routers/                # Endpoints REST por módulo
    ├── service/                # Servicios de email y notificaciones
    ├── utils/                  # Seguridad (hash/verify de contraseñas)
    ├── tests/                  # Pruebas unitarias, integración, sistema y aceptación
    └── main.py                 # Punto de entrada de la API
```

---

## Requisitos Previos

- **Node.js** 18 o superior
- **Python** 3.10 o superior
- **PostgreSQL** 14 o superior (para producción)
- **Git**

---

## Instalación y Ejecución

### Backend

```bash
cd API-EduCampus

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Crear archivo .env con:
# DATABASE_URL=postgresql+psycopg://usuario:clave@localhost:5432/educampus

# Crear tablas
python create_tables.py

# Iniciar servidor
uvicorn main:app --reload --port 8000
```

La API queda disponible en `http://localhost:8000`  
Documentación interactiva: `http://localhost:8000/docs`

---

### Frontend

```bash
cd EduCampus

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`

---

## Roles del Sistema

| Rol | Acceso |
|---|---|
| **Administrador** | Gestión de usuarios, cursos, reportes y configuración |
| **Docente** | Mis cursos, calificaciones, asistencia, material didáctico |
| **Estudiante** | Mis cursos, horario, calificaciones, materiales |

---

## Pruebas

El proyecto implementa los 4 niveles de prueba exigidos:

### Frontend — Jest + @testing-library/react

```bash
cd EduCampus

# Ejecutar todas las pruebas
npm test

# Ejecutar una sola vez
npm run test:run

# Generar informe HTML interactivo (abre automáticamente en el navegador)
npm run test:report
```

| Nivel | Descripción | Pruebas |
|---|---|---|
| Unitarias (U) | Validadores, modelos, servicios, componentes | 178 |
| Integración (I) | Flujos de login, roles, contexto, servicios | 51 |
| Sistema (S) | Seguridad, rendimiento, usabilidad, portabilidad | 34 |
| Aceptación (A) | Historias de usuario, regresión | 121 |
| **Total** | **34 archivos** | **384** |

---

### Backend — pytest + FastAPI TestClient

```bash
cd API-EduCampus
venv\Scripts\activate

# Ejecutar todas las pruebas
pytest

# Con verbosidad
pytest -v

# Con cobertura
pytest --cov

# Generar informe HTML interactivo
npm run test:report
```

| Nivel | Descripción | Pruebas |
|---|---|---|
| Unitarias (U) | Schemas, security, modelos | 55 |
| Integración (I) | Auth, endpoints, servicios, flujos | 37 |
| Sistema (S) | Inscripciones, calificaciones, reportes | 49 |
| Aceptación (A) | Historias de usuario (HU-01 a HU-14) | 14 |
| **Total** | **13 archivos** | **155** |

**Total del proyecto: 539 tests ✓**

---

## Técnicas de Prueba Aplicadas

| Sigla | Técnica | Uso |
|---|---|---|
| **CE** | Clases de Equivalencia | Validar entradas válidas e inválidas |
| **VL** | Valores Límite | Probar en los bordes del rango permitido |
| **CB** | Camino Básico | Cubrir todos los flujos de un método |
| **HU** | Historias de Usuario | Criterios de aceptación del cliente |
| **Inc. Asc.** | Integración Incremental Ascendente | Componentes → servicios → contexto |
| **Inc. Desc.** | Integración Incremental Descendente | Shell → layout → componentes |

---

## Características Principales

### Para Estudiantes
- ✅ Registro e inicio de sesión
- 📚 Visualización de cursos inscritos
- 📊 Consulta de calificaciones
- 📋 Registro de asistencia
- 📥 Descarga de materiales
- 🔔 Notificaciones por email y SMS

### Para Docentes
- ✅ Gestión de cursos
- 👥 Control de estudiantes inscritos
- 📝 Carga de calificaciones
- ✍️ Carga de materiales
- 📊 Reportes de asistencia
- 🔔 Notificaciones automáticas

### Para Administradores
- 👥 Gestión de usuarios (CRUD)
- 🎓 Administración de cursos
- 📊 Dashboard con estadísticas
- 🔐 Control de acceso por roles
- 📈 Reportes del sistema
- 🛠️ Configuración global

---

## Módulos del Sistema

### Backend (endpoints disponibles)
- `POST /auth/login` — Inicio de sesión
- `CRUD /estudiantes/` — Gestión de estudiantes
- `CRUD /docentes/` — Gestión de docentes
- `CRUD /cursos/` — Gestión de cursos
- `POST /inscripciones/` — Inscripción con control de cupo
- `CRUD /calificaciones/` — Notas (0.0–5.0)
- `GET /asistencia/` — Reportes de asistencia
- `GET /material/` — Gestión de materiales
- `GET /notificaciones/` — Sistema de notificaciones

### Frontend (páginas principales)
- `/login` — Acceso con selección de rol
- `/admin/*` — Dashboard y gestión
- `/docente/*` — Cursos y calificaciones
- `/estudiante/*` — Cursos y horario

---

## Variables de Entorno

### Backend (`.env`)

```
DATABASE_URL=postgresql+psycopg://usuario:clave@localhost:5432/educampus
JWT_SECRET=tu_clave_secreta
GMAIL_USER=tu-email@gmail.com
GMAIL_PASSWORD=app-password
VONAGE_API_KEY=key
VONAGE_API_SECRET=secret
```

### Frontend (`.env.local`)

```
VITE_API_BASE_URL=http://localhost:8000
```

---

## Informe de Pruebas

Ejecuta `npm run test:report` para generar un HTML con:

- 📊 Resumen ejecutivo (539 tests)
- ⚛️ Pestaña Frontend (384 tests Jest)
- 🐍 Pestaña Backend (155 tests pytest)
- 📈 Estadísticas detalladas
- 🔍 Resultados expandibles por archivo

---

## Tecnologías Adicionales

- **Notificaciones:** Gmail SMTP + Vonage SMS
- **Almacenamiento:** Cloudinary
- **Deployment:** Vercel (Frontend) + Render (Backend)
- **Base de Datos:** PostgreSQL (Neon)
- **Validación:** Pydantic + Custom hooks

---

## Autores

Proyecto desarrollado por **Reinel Alfaro**  
Asignatura: Proyecto de Software  
Universidad Popular del Cesar — 2026
