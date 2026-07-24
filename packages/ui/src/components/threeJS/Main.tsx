import React from 'react';

export default function Main({
    darkMode = false,
    whiteMode = false,
    children,
}: {
    darkMode: boolean;
    whiteMode: boolean;
    children: React.ReactNode;
}) {
    const search = window.parent?.location.search || window.location.search;
    const isDocs = search.includes('path=/docs/');

    return (
        <main
            className="flex min-h-screen flex-col items-center justify-between p-24"
            style={{ border: '1px solid black', background: darkMode ? 'black' : (whiteMode ? 'white' : '') }}
        >
            <div style={{ width: '100%', height: isDocs ? '50vh' : '90vh' }}>{children}</div>
        </main>
    );
}
