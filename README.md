# MediManage - Frontend 🩺

¡Bienvenido al ecosistema frontend de **MediManage**! Esta aplicación es un panel de control médico moderno, fluido y responsivo, diseñado para optimizar la gestión de consultas, autenticación de usuarios y administración de datos clínicos.

Desarrollado como una Single Page Application (SPA) desacoplada, se comunica de forma segura con un backend robusto en Spring Boot mediante tokens JWT.

---

## 🚀 Tecnologías Utilizadas

El proyecto fue construido utilizando herramientas modernas de la industria para garantizar rendimiento, escalabilidad y una experiencia de usuario limpia:

* **React (v19):** Biblioteca base para la construcción de interfaces de usuario basadas en componentes.
* **Vite:** Herramienta de empaquetado ultra rápida para el entorno de desarrollo.
* **Tailwind CSS (v4):** Framework de utilidades CSS para un diseño moderno, responsivo y estilizado a base de tokens.
* **React Router Dom:** Gestión de enrutamiento dinámico dentro de la aplicación (Login, Dashboard, etc.).
* **Axios:** Cliente HTTP para el consumo eficiente y seguro de la API de Spring Boot.

---

## 🔐 Características Clave Implementadas

* **Manejo de Estado Dinámico:** Formularios controlados con React Hooks (`useState`, `useNavigate`).
* **Autenticación Segura (JWT):** Flujo completo de Login que captura, almacena y persiste el token de seguridad en el `localStorage` del navegador.
* **Diseño UI/UX Profesional:** Interfaz limpia utilizando la paleta de colores Slate y Blue de Tailwind CSS, ideal para entornos médicos y corporativos.
* **Arquitectura de Servicios:** Abstracción del cliente Axios en un módulo centralizado para facilitar llamadas limpias hacia el backend.

---

## 🛠️ Instalación y Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/TU_USUARIO/medimanage-frontend.git](https://github.com/TU_USUARIO/medimanage-frontend.git)
cd medimanage-frontend
```

### 2. Instalar dependencias
Asegúrate de tener Node.js instalado y ejecuta:
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto para apuntar a la dirección de tu backend.

##📂 Estructura del Proyecto
src/
├── assets/         # Imágenes y recursos estáticos
├── components/     # Componentes reutilizables de la interfaz
├── services/       # Configuración de Axios y llamadas a la API
├── views/          # Pantallas principales (Login, Dashboard)
├── App.jsx         # Enrutador principal y layouts
└── main.jsx        # Punto de entrada de la aplicación