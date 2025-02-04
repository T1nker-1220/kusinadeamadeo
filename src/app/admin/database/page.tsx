import { DatabaseStateViewer } from "@/components/admin/database/state-viewer";

export default function DatabasePage() {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Database State</h1>
        <p className="text-muted-foreground">
          View the current state of the database, including tables, functions, and enums.
        </p>
      </div>
      <DatabaseStateViewer />
    </div>
  );
}
