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

| Comando              | Qué hace                                                  |
| -------------------- | --------------------------------------------------------- |
| `npm run dev`        | Levanta backend y frontend en modo desarrollo             |
| `npm run dev:outage` | Igual, pero con SnailPay caído (simula error del sistema) |
| `npm test`           | Corre las pruebas de todos los paquetes                   |
| `npm run typecheck`  | Verifica tipos en todos los paquetes                      |
| `npm run lint`       | Revisa el código con ESLint                               |
| `npm run build`      | Genera los builds de producción                           |

## Pruebas

```bash
npm test               # todas las pruebas (frontend y backend)
npm run test:coverage  # con reporte de cobertura
npm test -w client     # solo frontend
npm test -w server     # solo backend
```

Las pruebas usan **Vitest**; el frontend usa además **Testing Library** (se prueba lo que ve y hace el usuario, no detalles internos) y el backend **Supertest** (peticiones HTTP reales a la app de Express, sin abrir un puerto).

La prioridad fue probar lo que el enunciado exige y lo que sería más grave si fallara:

| Qué se prueba                                                                                                                                             | Dónde                                                 | Por qué                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| Registro → panel → cerrar sesión → volver a entrar, y que la sesión sobreviva a una recarga                                                               | `features/auth/authFlow.test.tsx`                     | Es el mínimo para que la entrega sea válida                      |
| La contraseña nunca se guarda en texto plano; hash con sal distinta cada vez; mismo error para correo inexistente o contraseña incorrecta; sesión vencida | `features/auth/services/*.test.ts`                    | Evalúan explícitamente cómo se trata la contraseña               |
| Validaciones de registro e inicio de sesión                                                                                                               | `features/auth/validation.test.ts`                    | Reglas de negocio de los formularios                             |
| Cada escenario de SnailPay: código HTTP, `status`, `status_detail` y todos los campos exigidos                                                            | `server/src/modules/snailpay/snailpay.routes.test.ts` | Es el contrato que evalúan y lo que se documenta para reproducir |
| El saldo solo sube con un cobro aprobado, nunca dos veces por la misma operación, y se guarda con tarjeta y CVV                                           | `features/topup/services/topUpService.test.ts`        | "No deberán generarse falsos cobros exitosos"                    |
| Respuestas sospechosas (aprobado con HTTP 500, sin autorización, otro monto u otro usuario) no cuentan como aprobadas                                     | `features/topup/api/snailpayClient.test.ts`           | Defensa ante una integración que responde mal                    |
| Timeout con `AbortController`, error de red y cuerpos que no son JSON                                                                                     | `lib/api/httpClient.test.ts`                          | Evalúan el manejo de errores y timeout                           |
| Recarga desde el panel: el saldo se actualiza de inmediato; un rechazo lo deja igual                                                                      | `features/topup/topUpFlow.test.tsx`                   | El flujo completo como lo vive el usuario                        |
| Las 6 carreras siempre suman 6 victorias y las apuestas ganadas coinciden con los ganadores                                                               | `features/races/*.test.ts`                            | "Los datos simulados deben tener congruencia con las reglas"     |
| Gráficas: tooltip con teclado, rótulos selectivos y tabla accesible                                                                                       | `components/charts/*.test.*`                          | Accesibilidad de las visualizaciones                             |

## SnailPay: pasarela de pagos simulada

`POST /api/snailpay/charges` — no se conecta con ningún servicio real; todos los datos son ficticios.

### Petición

```json
{
  "card_number": "1234123412341234",
  "expiration_date": "12/26",
  "cvv": "543",
  "cardholder_name": "Ana López",
  "amount": 250.5,
  "payer_id": "<id del usuario registrado>",
  "payer_email": "ana@correo.com"
}
```

### Respuesta

Todas las respuestas (aprobadas, rechazadas y de error) tienen la misma forma:

| Campo                | Formato                             | Descripción                                          |
| -------------------- | ----------------------------------- | ---------------------------------------------------- |
| `id`                 | `pay_<uuid>`                        | Identificador de la operación                        |
| `status`             | `approved` \| `rejected` \| `error` | Estado general                                       |
| `status_detail`      | ver tabla de escenarios             | Motivo exacto del resultado                          |
| `message`            | texto                               | Mensaje listo para mostrar al usuario                |
| `transaction_amount` | número o `null`                     | Monto solicitado                                     |
| `date_created`       | ISO 8601                            | Fecha de creación                                    |
| `authorization_code` | 6 dígitos o `null`                  | Solo en cobros aprobados                             |
| `reference`          | `SNP-AAAAMMDD-XXXXXX`               | Referencia de la operación                           |
| `payer_id`           | texto                               | Identificador del usuario                            |
| `payer_email`        | texto                               | Correo del usuario                                   |
| `card_number`, `cvv` | texto                               | Se devuelven porque lo pide el enunciado (ficticios) |
| `errors`             | `[{ field, message }]`              | Solo con `invalid_data`                              |

### Cómo reproducir cada escenario

Salvo que se indique otra cosa, usar fecha `12/26`, CVV `543`, cualquier nombre y un monto entre $0.01 y $10,000.

| Escenario            | Cómo provocarlo                                           | HTTP | `status`   | `status_detail`         |
| -------------------- | --------------------------------------------------------- | ---- | ---------- | ----------------------- |
| Cobro exitoso        | Tarjeta `1234123412341234`                                | 201  | `approved` | `accredited`            |
| Datos de tarjeta     | Tarjeta `1234123412341234` con otra fecha u otro CVV      | 402  | `rejected` | `invalid_card_data`     |
| Tarjeta rechazada    | Tarjeta `4000000000000002`                                | 402  | `rejected` | `card_declined`         |
| Fondos insuficientes | Tarjeta `4000000000009995`                                | 402  | `rejected` | `insufficient_funds`    |
| Tarjeta vencida      | Tarjeta `4000000000000069`                                | 402  | `rejected` | `expired_card`          |
| Tarjeta desconocida  | Cualquier otro número de 16 dígitos                       | 402  | `rejected` | `unknown_card`          |
| Límite de monto      | Monto mayor a $10,000                                     | 402  | `rejected` | `amount_limit_exceeded` |
| Datos inválidos      | Número sin 16 dígitos, CVV sin 3 dígitos, monto ≤ 0, etc. | 422  | `rejected` | `invalid_data`          |
| Error interno        | Tarjeta `4000000000000500`                                | 503  | `error`    | `service_unavailable`   |
| SnailPay caído       | `npm run dev:outage` (o `SNAILPAY_FORCE_OUTAGE=true`)     | 503  | `error`    | `service_unavailable`   |
| Respuesta lenta      | Tarjeta `4000000000000408` (tarda 15 s)                   | 504  | `error`    | `gateway_timeout`       |

Con la respuesta lenta, el frontend corta la espera a los 8 segundos y muestra un error de tiempo agotado. En ningún escenario distinto al cobro exitoso se modifica el saldo.

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
