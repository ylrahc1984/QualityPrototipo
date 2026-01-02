# Prototipo Hotel Web

Aplicación Angular para gestión de reservas con autocompletado de Google Places (PlaceAutocompleteElement).

## Requisitos
- Node.js 16+ (recomendado LTS)
- npm 8+
- Cuenta de Google Cloud con Places API y Maps JavaScript API habilitadas

## Configuración
1. Copia tu API key en `src/environments/environment.ts` (propiedad `googleMapsApiKey`).
2. Verifica que la clave tenga habilitado **Places API** y **Maps JavaScript API** para el dominio donde se ejecuta la app.

## Instalación
```bash
npm install
```

## Scripts comunes
- Servir en desarrollo: `npm start`
- Compilar producción: `npm run build`

## Notas de Google Places
- Se usa el web component `PlaceAutocompleteElement` (nuevo SDK). El loader carga el script con `libraries=places&v=beta` y, si `inputElement` es de solo lectura, inserta el componente con su input interno y emite el evento `placeSelected` con la dirección, coordenadas y placeId.
