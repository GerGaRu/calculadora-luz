# Comparador de factura de la luz - React + Vite

Proyecto convertido desde un único archivo HTML/CSS/JS a una aplicación con:

- React para componentes
- JavaScript / JSX
- CSS externo para estilos
- Vite para desarrollo y build
- Vercel para despliegue

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre la URL local que indique Vite, normalmente:

```bash
http://localhost:5173
```

## Generar versión de producción

```bash
npm run build
npm run preview
```

## Desplegar en Vercel

1. Sube el proyecto a GitHub.
2. Entra en Vercel.
3. Importa el repositorio.
4. Framework preset: Vite.
5. Build command: `npm run build`.
6. Output directory: `dist`.

## Archivos principales

- `src/App.jsx`: estado principal, cálculo, compartir enlace y renderizado general.
- `src/utils/calculations.js`: constantes, validación y fórmula de cálculo.
- `src/components/`: componentes reutilizables.
- `src/styles.css`: estilos de la interfaz.

## Nota de cálculo

La lógica conserva la fórmula original:

- Energía = consumo × precio de energía.
- Potencia = días × (P1 × precio P1 + P2 × precio P2).
- Impuesto eléctrico sólo sobre energía + potencia.
- IVA sobre subtotal + impuesto eléctrico.
- El enlace de contratación sólo aparece cuando Octopus Relax sale más barata que la tarifa introducida por el usuario.
