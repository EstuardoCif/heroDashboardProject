# Hero Dashboard Project

Este proyecto consiste en un dashboard para gestionar información de héroes, con una separación entre el frontend y el backend.

## Estructura del Proyecto

- **frontend/**: Contiene la aplicación del lado del cliente, construida con React.
- **backend/**: Contiene el servidor del lado del servidor, construido con Node.js y Express.

## Instalación y Configuración

### Frontend

1. Navega a la carpeta del frontend:

   ```bash
   cd frontend
   
1.1 Instala las dependencias necesarias:
`npm install`

### El comando npm install lee el archivo package.json en la carpeta frontend y descarga todas las dependencias especificadas en ese archivo. 
Esto es necesario para que la aplicación React pueda funcionar correctamente, ya que npm install instala todas las bibliotecas y herramientas que el proyecto necesita para desarrollarse y ejecutarse.

### Backend

2. Navega a la carpeta del backend:

   ```bash
   cd backend
   
2.1 Instala las dependencias necesarias:
`npm install`

### Similar al frontend, el comando npm install en la carpeta backend lee el archivo package.json y descarga todas las dependencias que el servidor necesita para funcionar. 
Esto incluye bibliotecas para manejar solicitudes HTTP, conexión a bases de datos, y otras utilidades esenciales para el backend.

## Ejecutar los Servidores

3. Backend
Para iniciar el servidor backend, usa el siguiente comando:
`npm run start`

El comando npm run start arranca el servidor Express, permitiendo que el backend comience a recibir y manejar solicitudes HTTP.

5. Frontend
Para iniciar la aplicación frontend, usa el siguiente comando:
`npm start`

El comando npm start en la carpeta frontend arranca el servidor de desarrollo para la aplicación React.
Este comando abre la aplicación en un navegador web en la dirección http://localhost:3000. Este servidor de desarrollo permite que se realicen cambios en el código y se vean los resultados en tiempo real.
