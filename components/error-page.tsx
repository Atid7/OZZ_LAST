"use client";

interface ErrorPageProps {
  error: Error;
}

export function ErrorPage({ error }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-destructive">Error</h1>
          <p className="text-lg text-muted-foreground">
            Unable to load menu
          </p>
        </div>

        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-foreground">
            {error.message}
          </p>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>Please check:</p>
          <ul className="list-disc list-inside text-left space-y-1">
            <li>Environment variables are set in Vercel dashboard</li>
            <li>API endpoint is accessible</li>
            <li>Restaurant slug is correct</li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
