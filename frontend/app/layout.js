import "./globals.css";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Voxify AI",
  description: "AI Speech-to-Text SaaS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
