import "./globals.css";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata = {
  title: "Voxify AI",
  description: "AI Speech-to-Text SaaS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
