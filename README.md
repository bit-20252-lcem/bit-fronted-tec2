# Aplicación de Gestión de Tareas - Frontend

Interfaz de usuario desarrollada con Angular para el sistema de gestión de tareas. Esta aplicación se conecta a la API RESTful del backend para proporcionar una experiencia de usuario completa en la gestión de usuarios y tareas.

## Características

- Autenticación de usuarios (registro e inicio de sesión)
- Gestión de perfiles de usuario
- CRUD completo para tareas
- Interfaz responsiva con Tailwind CSS
- Notificaciones con SweetAlert2
- Validación de formularios
- Protección de rutas

## Tecnologías Utilizadas

- **Angular 20** - Framework para aplicaciones web
- **TypeScript** - Lenguaje de programación tipado
- **Tailwind CSS** - Framework CSS para diseño responsivo
- **RxJS** - Para programación reactiva
- **SweetAlert2** - Para notificaciones y alertas
- **Angular Router** - Para la navegación entre vistas
- **Angular Forms** - Para manejo de formularios

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- Angular CLI (instalar con `npm install -g @angular/cli`)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar la URL del backend en el archivo de entorno:
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api' // Ajustar según corresponda
   };
   ```

## Desarrollo

Para iniciar el servidor de desarrollo:
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Vistas principales
│   ├── services/       # Servicios para comunicación con la API
│   ├── guards/         # Guards de autenticación
│   ├── interfaces/     # Interfaces TypeScript
│   ├── models/         # Modelos de datos
│   └── shared/         # Módulos y componentes compartidos
├── assets/            # Recursos estáticos
└── environments/      # Configuración de entornos
```

## Scripts Disponibles

- `ng serve` - Inicia el servidor de desarrollo
- `ng build` - Compila la aplicación para producción
- `ng test` - Ejecuta las pruebas unitarias
- `ng e2e` - Ejecuta pruebas end-to-end

## Configuración del Backend

Esta aplicación está diseñada para funcionar con el backend de gestión de tareas. Asegúrate de que el servidor backend esté en ejecución y configurado correctamente antes de iniciar la aplicación frontend.

## Autor
**Luis Carlos Escorcia Manga**  


## Licencia

Este proyecto está bajo la Licencia ISC.


