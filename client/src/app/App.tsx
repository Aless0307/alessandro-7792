import { useEffect, useState } from 'react';
import type { HealthResponse } from '@snail/shared';
import { getJson } from '../lib/api/httpClient';
import styles from './App.module.css';

type ApiStatus =
  | { kind: 'loading' }
  | { kind: 'ok'; data: HealthResponse }
  | { kind: 'error'; message: string };

// Pantalla temporal de la fase 0: confirma que el frontend se comunica con el backend.
export function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ kind: 'loading' });

  useEffect(() => {
    getJson<HealthResponse>('/api/health')
      .then((data) => setApiStatus({ kind: 'ok', data }))
      .catch((error: unknown) =>
        setApiStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Error' }),
      );
  }, []);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>🐌 SnailBet</h1>
      {apiStatus.kind === 'loading' && <p>Conectando con la API…</p>}
      {apiStatus.kind === 'ok' && <p className={styles.ok}>API conectada</p>}
      {apiStatus.kind === 'error' && (
        <p className={styles.error}>No se pudo conectar con la API ({apiStatus.message})</p>
      )}
    </main>
  );
}
