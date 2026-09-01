"use client";

import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator !== "undefined" && navigator.onLine
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync navigator.onLine on mount, intentional external subscription
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  useEffect(() => {
    if (isOnline) {
      window.location.reload();
    }
  }, [isOnline]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Sin conexión
          </h1>
          <p className="text-lg font-semibold text-gradient">
            Cognita Study
          </p>
        </div>

        <div className="space-y-3 text-[var(--muted-foreground)]">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">📡</span>
            <p>No se pudo establecer conexión con el servidor.</p>
          </div>
          <p className="text-sm">
            Verificá tu conexión a internet y volvé a intentar.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium transition-colors hover:opacity-90"
        >
          Reintentar
        </button>

        <p className="text-xs text-[var(--muted-foreground)]">
          Se actualizará automáticamente al recuperar la conexión.
        </p>
      </div>
    </div>
  );
}
