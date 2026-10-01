# Despliegue gratuito

Configuración elegida: **Render Static Site** para el cliente, **Render Free Web Service** para la API y **Neon Free** para PostgreSQL.

## Publicar

Los repositorios del cliente y la API son separados. Sube los cambios a GitHub y en Render crea un Blueprint para cada repositorio, seleccionando su `render.yaml`:

1. En Neon, crea una base PostgreSQL y copia la URL de conexión con SSL.
2. En Render, crea el Blueprint del repositorio de la API. En el prompt secreto, pega la URL de Neon en `DATABASE_URL`. Render construye desde `api/` y asigna automáticamente `PORT`.
3. Cuando la API esté desplegada, copia su URL pública HTTPS.
4. Crea el Blueprint del repositorio del cliente. En el prompt, configura `REACT_APP_API_URL` con la URL pública de la API, sin `/` final.

Ambos servicios quedan con HTTPS. El frontend estático no se suspende. La API gratuita de Render se suspende tras 15 minutos sin tráfico y puede tardar un poco en responder al primer acceso.

Neon incluye una cuota gratuita limitada; Render Free sirve para hobby y pruebas, no para una app con garantías de disponibilidad. Render Postgres gratis no conviene para este caso porque vence a los 30 días.

No publiques los archivos `.env` ni pongas credenciales dentro del repositorio. Para publicar actualizaciones, sube los commits a GitHub; Render redeploya automáticamente.
