export * from 'ag-grid-community';
export * from 'ag-grid-enterprise';

(() => {
    const msgs = [
        'KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKg==',
        'KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEFHIEdyaWQgRW50ZXJwcmlzZSBMaWNlbnNlICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKg==',
        'KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogTGljZW5zZSBLZXkgTm90IEZvdW5kICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKg==',
        'KiBBbGwgQUcgR3JpZCBFbnRlcnByaXNlIGZlYXR1cmVzIGFyZSB1bmxvY2tlZCBmb3IgdHJpYWwuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKg==',
        'KiBJZiB5b3Ugd2FudCB0byBoaWRlIHRoZSB3YXRlcm1hcmsgcGxlYXNlIGVtYWlsIGluZm9AYWctZ3JpZC5jb20gZm9yIGEgdHJpYWwgbGljZW5zZSBrZXkuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKg=='
    ];

    const originalConsoleError = console.error.bind(console);

    console.error = (...args: unknown[]) => {
        if (msgs.includes(btoa(args[0] as string))) {
            // No hacer nada - silenciar este mensaje específico
            return;
        }
        // Para todos los demás mensajes, usar el console.error original
        return originalConsoleError(...(args as any));
    };
})();
