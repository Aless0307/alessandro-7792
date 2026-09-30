import { useEffect } from 'react';

const APP_NAME = 'SnailBet';

// Título de la pestaña por pantalla: ayuda a ubicarse y lo anuncian los lectores de pantalla.
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} | ${APP_NAME}`;
  }, [title]);
}
