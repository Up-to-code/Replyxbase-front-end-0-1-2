import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
   subsets: ["arabic"],
   weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "اتجاه التقنية | تمكين رواد الأعمال بالذكاء الاصطناعي",
  description: "نساعد الشركات الصغيرة ورواد الأعمال في السعودية على النمو من خلال تقنيات الذكاء الاصطناعي والحلول الذكية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
