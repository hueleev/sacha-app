import React from "react";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
      style={{ border: "1px solid black" }}
    >
      <div style={{ width: "100%", height: "70vh" }}>{children}</div>
    </main>
  );
}
