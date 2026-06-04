import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminSidebar } from "@/layouts/AdminSidebar";
import { ClayBlobs } from "@/shared/components/ClayBlobs";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <AdminSidebar />
        <main className="hide-scrollbar min-w-0 flex-1 overflow-y-auto pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
