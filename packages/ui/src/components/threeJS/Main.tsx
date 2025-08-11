import React from 'react';

export default function Main({
    darkMode = false,
    children,
}: {
    darkMode: boolean;
    children: React.ReactNode;
}) {
    const search = window.parent?.location.search || window.location.search;
    const isDocs = search.includes('path=/docs/');

    return (
        <main
            className="flex min-h-screen flex-col items-center justify-between p-24"
            style={{ border: '1px solid black', background: darkMode ? 'black' : '' }}
        >
            <div style={{ width: '100%', height: isDocs ? '50vh' : '90vh' }}>{children}</div>
        </main>
    );
}
