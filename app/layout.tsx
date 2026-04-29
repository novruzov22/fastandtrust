import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastAndTrust - Baku Online Store",
  description: "Keyfiyyətli məhsulların tək ünvanı Bakıda. Профессиональный магазин качественных товаров в Баку.",
  icons: {
    icon: "/airplane-48.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}