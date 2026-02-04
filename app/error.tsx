"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Menu page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground">
          We couldn't load the menu. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}