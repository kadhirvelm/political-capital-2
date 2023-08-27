/*
 * Copyright 2023 KM.
 */

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.scss";

export const metadata: Metadata = {
  description: "PC2",
  title: "Political capital two",
};

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
