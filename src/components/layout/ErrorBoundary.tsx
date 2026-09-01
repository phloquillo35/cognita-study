"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)] p-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Algo salió mal
          </h1>
          <p className="max-w-md text-[var(--muted-foreground)]">
            Ocurrió un error inesperado. Recargá la página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
