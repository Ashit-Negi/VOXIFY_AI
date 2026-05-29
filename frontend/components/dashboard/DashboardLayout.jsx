import Sidebar from "../sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1 p-6 pt-24 md:pt-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
