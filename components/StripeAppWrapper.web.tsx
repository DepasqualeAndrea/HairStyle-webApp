import React from 'react';

export function StripeAppWrapper({ children }: { children: React.ReactNode }) {
    // On web, we don't use StripeProvider yet, or we use the web version if we had it.
    // For now, just render children to avoid crashing.
    return <>{children}</>;
}
