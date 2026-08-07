"use client";

import TableWithSearch from "./components/table-with-search";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold my-2">Solace Advocates</h1>
      <TableWithSearch />
    </main>
  );
}
