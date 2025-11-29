# AppMovilEscolar — Web y API

## Descripción
AppMovilEscolar es una aplicación web completa para la gestión escolar, diseñada para facilitar la administración de estudiantes, cursos, materias y contenidos educativos.  
El proyecto combina un **frontend moderno en Angular** con un **backend robusto en Django**, ofreciendo una experiencia de usuario fluida y una API segura para operaciones de datos.

### Objetivos principales
- Digitalizar la gestión académica y administrativa de instituciones educativas.  
- Permitir que docentes y administradores manejen la información de manera centralizada y segura.  
- Facilitar la interacción entre usuarios y el sistema mediante un frontend intuitivo.

### Qué hace el proyecto

#### Frontend (Angular)
- Interfaz web interactiva y responsiva.  
- Formularios para registro y edición de estudiantes y eventos.  
- Visualización de información académica en tiempo real.  
- Comunicación con el backend a través de la API REST.

#### Backend (Django)
- API REST para gestionar todos los recursos del sistema (usuarios, cursos, materias, etc.).  
- Autenticación y autorización de usuario.  
- Gestión de la base de datos y lógica de negocio.

### Beneficios
- Centraliza la información académica en un solo sistema.  
- Ahorra tiempo en procesos administrativos.  
- Mejora la experiencia de docentes, estudiantes y administradores.  

---

## 🛠 Tecnologías usadas

### Frontend
- Angular 16  
- TypeScript  
- HTML5 / SCSS  

### Backend
- Python 3 / Django  
- Base de datos: MySQL  
- API REST  

---

## Imagenes de Proyecto final 
### Pagina principal 

![image alt](https://github.com/arelyrava/FinalFront/blob/845651740539add7c281a705000f7922b501b030/imagen_2025-11-29_142432156.png)

### Registros 
Administrador
![image alt](https://github.com/arelyrava/FinalFront/blob/b3c47f1555e8b8a6288490a8fceb1eb418fd774f/registro%20Admin.png)
Alumno
![image alt](https://github.com/arelyrava/FinalFront/blob/b3c47f1555e8b8a6288490a8fceb1eb418fd774f/registro%20alumno.png)
Maestro
![image alt](https://github.com/arelyrava/FinalFront/blob/b3c47f1555e8b8a6288490a8fceb1eb418fd774f/registro%20maestro.png)

### tablas 
Administrador
![image alt](
Alumno
![image alt](https://github.com/arelyrava/FinalFront/blob/b3c47f1555e8b8a6288490a8fceb1eb418fd774f/Tabla%20Alumno.png)
Maestros
![image alt](https://github.com/arelyrava/FinalFront/blob/b3c47f1555e8b8a6288490a8fceb1eb418fd774f/tabla%20maestro%20.png)

### Graficas 
![image alt](https://github.com/arelyrava/FinalFront/blob/b3c47f1555e8b8a6288490a8fceb1eb418fd774f/Graficas.png)

### Eventos
![image alt](




##  Instalación y ejecución

## 1. Clonar repositorios
git clone https://github.com/arelyrava/FinalFront.git frontend
git clone https://github.com/arelyrava/BackFinalMoviles.git backend


## 2.Configuración y ejecución del Backend (Django)

# Activar entorno virtual (Windows)
Scripts\activate  

# Crear archivos de migración basados en modelos
python manage.py makemigrations  

# Aplicar migraciones a la base de datos
python manage.py migrate  

# Iniciar servidor de desarrollo en localhost
python manage.py runserver


## 3. Configuración y ejecución del Frontend (Angular)

cd frontend
npm install          # Instalar dependencias
ng serve -o          # Ejecutar y abrir en navegador


## Estructura del Proyecto
/ (raíz)
├── frontend/          # Angular app
│   ├── src/
│   ├── angular.json
│   └── package.json
└── backend/           # Django API
    ├── app_movil_escolar_api/
    ├── manage.py
    └── requirements.txt



