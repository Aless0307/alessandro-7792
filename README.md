# 🐌 SnailBet

Aplicación web de apuestas en carreras de caracoles: registro e inicio de sesión locales, dashboard con estadísticas simuladas y recarga de saldo mediante **SnailPay**, una pasarela de pagos simulada.

**Stack:** React + Vite · Express · TypeScript · LocalStorage · Vitest

## Requisitos

- Node.js 24 o superior (ver `.nvmrc`)

## Cómo ejecutar

```bash
npm install
npm run dev        # backend en :3001 y frontend en :5173
```

Abrir http://localhost:5173

## Scripts

| Comando             | Qué hace                                      |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Levanta backend y frontend en modo desarrollo |
| `npm test`          | Corre las pruebas de todos los paquetes       |
| `npm run typecheck` | Verifica tipos en todos los paquetes          |
| `npm run lint`      | Revisa el código con ESLint                   |
| `npm run build`     | Genera los builds de producción               |

## Estructura

```
├── shared/                 Tipos y contratos compartidos entre frontend y backend
│   └── src/
├── server/                 API en Express
│   └── src/
│       ├── config/         Variables de entorno (único lugar que lee process.env)
│       ├── middleware/     Middlewares transversales (404, errores)
│       ├── modules/        Un módulo por dominio: rutas, lógica y sus pruebas juntas
│       ├── app.ts          Construye la app de Express (sin abrir puerto, se puede probar)
│       └── index.ts        Punto de entrada: abre el puerto
└── client/                 Frontend en React
    └── src/
        ├── app/            Composición de la app (rutas, providers)
        ├── features/       Un folder por funcionalidad (auth, dashboard, recarga)
        ├── components/     Componentes de UI reutilizables
        ├── lib/            Utilidades sin UI (cliente HTTP, almacenamiento)
        ├── config/         Configuración del frontend
        ├── styles/         Estilos globales y tokens de diseño
        └── test/           Configuración de las pruebas
```

Las pruebas viven junto al archivo que prueban (`archivo.test.ts`).
