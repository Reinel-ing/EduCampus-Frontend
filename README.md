# EduCampus 🎓

**Sistema integral de gestión académica para instituciones educativas**

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite)](https://vitejs.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org)
[![Tests](https://img.shields.io/badge/Tests-539%20%E2%9C%93-22c55e)](./test-report.html)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## 📋 Descripción

EduCampus es una plataforma web de código abierto para la **gestión integral de instituciones educativas**. Permite administrar estudiantes, docentes, cursos, calificaciones, asistencia, materiales educativos y notificaciones en un único sistema.

Diseñado con arquitectura cliente-servidor moderna, escalable y completamente testeado.

---

## 🎯 Características Principales

### Para Estudiantes
- ✅ Registro y autenticación segura
- 📚 Visualización de cursos inscritos
- 📊 Consulta de calificaciones y promedio
- 📋 Registro de asistencia
- 📥 Descarga de materiales educativos
- 🔔 Notificaciones en tiempo real (Email + SMS)
- 📱 Interfaz responsiva para móvil

### Para Docentes
- ✅ Gestión completa de cursos
- 👥 Control de estudiantes inscritos
- 📝 Registro y visualización de calificaciones
- ✍️ Carga de materiales educativos
- 📊 Reportes de asistencia
- 🔔 Notificaciones automáticas
- 📅 Gestión de horarios

### Para Administradores
- 👥 Gestión de usuarios (estudiantes, docentes, admins)
- 🎓 Administración de cursos y horarios
- 📊 Dashboard con estadísticas en tiempo real
- 📧 Configuración de notificaciones
- 🔐 Control de acceso basado en roles
- 📈 Reportes completos del sistema
- 🛠️ Configuración global de la institución

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────┐
│         FRONTEND (React 19 + Vite)          │
│  Vercel | 384 Tests (Jest) | Responsivo    │
└─────────────────┬──────────────────────────┘
                  │ HTTP/JSON
                  ▼
┌─────────────────────────────────────────────┐
│      BACKEND (FastAPI + SQLAlchemy)         │
│ Render | 155 Tests (pytest) | Escalable    │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│    DATABASE (PostgreSQL en Neon)            │
│         Migrations con Alembic              │
└─────────────────────────────────────────────┘

SERVICIOS EXTERNOS:
├─ 📧 Email: Gmail SMTP
├─ 💬 SMS: Vonage
└─ 📸 Archivos: Cloudinary
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - UI library moderna
- **Vite 7.2** - Build tool ultrarrápido
- **React Router DOM 7.9** - Enrutamiento
- **Tailwind CSS 3.3** - Estilos
- **Testing Library** - Tests de componentes
- **Jest 30.4** - Test runner

### Backend
- **FastAPI 0.104** - Framework web asincrónico
- **SQLAlchemy** - ORM para Python
- **Alembic** - Migraciones de BD
- **Pydantic** - Validación de datos
- **Python-Jose** - JWT tokens
- **pytest** - Testing

### Base de Datos
- **PostgreSQL 16** - DBMS relacional
- **Neon** - Hosting PostgreSQL serverless

### DevOps & Deployment
- **Vercel** - Hosting Frontend
- **Render** - Hosting Backend
- **GitHub Actions** - CI/CD (opcional)

### Notificaciones
- **Gmail SMTP** - Envío de emails
- **Vonage** - Envío de SMS

### Storage
- **Cloudinary** - Hosting de archivos

---

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ (Frontend)
- Python 3.10+ (Backend)
- PostgreSQL 14+ (Desarrollo local)
- Git

### 1️⃣ Clonar Repositorio

```bash
git clone https://github.com/Reinel-ing/EduCampus-Frontend.git
cd EduCampus-Frontend
```

### 2️⃣ Configurar Frontend

```bash
# Instalar dependencias
npm install

# Variables de entorno (.env.local)
cat > .env.local <<EOF
VITE_API_BASE_URL=http://localhost:8000
EOF

# Ejecutar en desarrollo
npm run dev
```

**La app estará en:** `http://localhost:5173`

### 3️⃣ Configurar Backend

```bash
# Clonar repositorio Backend
git clone https://github.com/Reinel-ing/EduCampus-Backend.git
cd EduCampus-Backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Variables de entorno (.env)
cat > .env <<EOF
DATABASE_URL=postgresql://user:password@localhost/educampus
JWT_SECRET=tu-clave-secreta-super-larga
GMAIL_USER=tu-email@gmail.com
GMAIL_PASSWORD=tu-app-password
VONAGE_API_KEY=tu-vonage-key
VONAGE_API_SECRET=tu-vonage-secret
CLOUDINARY_URL=cloudinary://key:secret@cloud
EOF

# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor
uvicorn main:app --reload
```

**La API estará en:** `http://localhost:8000`
**Docs Swagger:** `http://localhost:8000/docs`

---

## 🧪 Pruebas

### Frontend (Jest)
```bash
npm test              # Modo watch
npm run test:run      # Ejecutar una sola vez
npm run test:report   # Generar reporte HTML interactivo
```

**Estadísticas:**
- 384 tests
- 34 archivos
- 100% cobertura de módulos
- Tipos: Unitarias, Integración, Sistema, Aceptación

### Backend (pytest)
```bash
cd ../API-EduCampus
pytest                # Ejecutar todos los tests
pytest tests/         # Tests específicos
pytest --cov         # Con cobertura
```

**Estadísticas:**
- 155 tests
- 100% pasando
- Cobertura de endpoints, servicios, modelos

### Reporte Combinado
```bash
npm run test:report   # Abre navegador con dashboard interactivo
```

**Total: 539 tests ✓**

---

## 📚 Uso

### Credenciales de Prueba

```
ESTUDIANTE:
Email: estudiante@gmail.com
Contraseña: Estudiante123

DOCENTE:
Email: docente@gmail.com
Contraseña: Docente123

ADMINISTRADOR:
Email: admin@gmail.com
Contraseña: Admin123
```

### Flujos Principales

#### 1️⃣ Registro de Estudiante
```
Inicio → Registrarse → Llenar datos → Recibir email confirmación
→ Login → Dashboard estudiante → Ver cursos inscritos
```

#### 2️⃣ Docente Crea Curso
```
Login → Mi Dashboard → Crear Curso → Agregar horarios
→ Ver estudiantes inscritos → Cargar calificaciones
→ Sistema notifica a estudiantes
```

#### 3️⃣ Admin Gestiona Sistema
```
Login → Panel Admin → Usuarios → Cursos → Reportes
→ Configuración general → Enviar notificaciones masivas
```

---

## 📊 API Endpoints Principales

### Autenticación
```
POST   /api/auth/register        # Registro
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
POST   /api/auth/refresh         # Refresh token
```

### Estudiantes
```
GET    /api/estudiantes          # Listar
POST   /api/estudiantes          # Crear
GET    /api/estudiantes/{id}     # Obtener
PUT    /api/estudiantes/{id}     # Actualizar
DELETE /api/estudiantes/{id}     # Eliminar
```

### Cursos
```
GET    /api/cursos               # Listar
POST   /api/cursos               # Crear
GET    /api/cursos/{id}          # Obtener
PUT    /api/cursos/{id}          # Actualizar
DELETE /api/cursos/{id}          # Eliminar
GET    /api/cursos/{id}/estudiantes  # Estudiantes del curso
```

### Calificaciones
```
POST   /api/calificaciones       # Crear
GET    /api/calificaciones       # Listar
PUT    /api/calificaciones/{id}  # Actualizar
GET    /api/calificaciones/curso/{id}  # Por curso
```

### Asistencia
```
POST   /api/asistencia           # Registrar
GET    /api/asistencia/curso/{id}     # Por curso
GET    /api/asistencia/estudiante/{id} # Por estudiante
```

### Notificaciones
```
GET    /api/notificaciones/{tipo}/{id}     # Obtener
PUT    /api/notificaciones/{id}/leer       # Marcar leída
DELETE /api/notificaciones/{id}            # Eliminar
```

**Documentación completa:** `http://localhost:8000/docs` (Swagger UI)

---

## 📁 Estructura del Proyecto

### Frontend
```
src/
├─ components/
│  ├─ administrador/          # Componentes admin
│  ├─ docente/               # Componentes docentes
│  ├─ estudiante/            # Componentes estudiantes
│  ├─ shared/                # Componentes compartidos (Header, Sidebar)
│  ├─ layout/                # Layouts por rol
│  └─ ui/                    # Componentes UI reutilizables
├─ pages/                    # Páginas de la app
├─ services/                 # Servicios API
├─ hooks/                    # Custom React hooks (validadores)
├─ models/                   # Clases de modelos
├─ context/                  # Context API (Auth)
├─ utils/                    # Funciones utilitarias (crypto, etc)
├─ styles/                   # CSS/Tailwind
└─ tests/                    # Suite de tests (384 tests)
```

### Backend
```
app/
├─ routers/                  # Endpoints API
├─ services/                 # Lógica de negocio
├─ models/                   # Modelos SQLAlchemy
├─ schemas/                  # Schemas Pydantic (validación)
├─ middleware/               # CORS, Auth, etc
└─ database.py               # Conexión BD
migrations/                  # Alembic migrations
tests/                       # Suite de tests (155 tests)
main.py                      # Punto de entrada FastAPI
```

---

## 🔐 Seguridad

✅ **Implementado:**
- Autenticación con JWT tokens
- Validación de datos con Pydantic
- Hashing de contraseñas (SHA-256)
- CORS configurado
- Control de acceso basado en roles (RBAC)
- Protección contra XSS
- Protección contra SQL injection
- Variables de entorno para secretos

---

## 📈 Rendimiento

| Métrica | Valor |
|---------|-------|
| Tiempo respuesta API | < 200ms |
| Tests Frontend | 384 (100% pass) |
| Tests Backend | 155 (100% pass) |
| Cobertura código | > 90% |
| Uptime esperado | 99.5% |

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Automático al push a main
# O manual:
vercel --prod
```

### Backend (Render)
```bash
# Automático con GitHub integration
# Migrar BD automáticamente
```

---

## 📝 Variables de Entorno

### Frontend (.env.local)
```env
VITE_API_BASE_URL=https://api.ejemplo.com
```

### Backend (.env)
```env
# Base de Datos
DATABASE_URL=postgresql://user:pass@host/db

# Seguridad
JWT_SECRET=clave-super-secreta-minimo-32-caracteres

# Email (Gmail)
GMAIL_USER=tu-email@gmail.com
GMAIL_PASSWORD=app-password-de-google

# SMS (Vonage)
VONAGE_API_KEY=tu-key
VONAGE_API_SECRET=tu-secret

# Archivos (Cloudinary)
CLOUDINARY_URL=cloudinary://key:secret@cloud

# Servidor
ENVIRONMENT=production
DEBUG=False
```

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! 

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

**Estándares:**
- Código limpio y documentado
- Tests para nuevas features
- Seguir convenciones del proyecto

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Reinel Alfaro**
- GitHub: [@Reinel-ing](https://github.com/Reinel-ing)
- Email: reine.alfaro@example.com

---

## 🔗 Enlaces Importantes

- **Frontend:** https://educampus-frontend.vercel.app
- **Backend API:** https://educampus-api.onrender.com
- **Documentación API:** https://educampus-api.onrender.com/docs
- **Reporte de Tests:** `npm run test:report`
- **GitHub Frontend:** https://github.com/Reinel-ing/EduCampus-Frontend
- **GitHub Backend:** https://github.com/Reinel-ing/EduCampus-Backend

---

## 📞 Soporte

¿Preguntas o problemas?
- Abre un issue en GitHub
- Contacta: reine.alfaro@example.com

---

## 🎉 Agradecimientos

- React y FastAPI communities
- Testing Library
- Tailwind CSS
- Todos los contribuidores

---

**Hecho con ❤️ para la educación**
