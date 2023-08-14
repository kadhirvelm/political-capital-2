import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.scss";

export const metadata: Metadata = {
    title: "Political capital two",
    description: "PC2",
};

const roboto = Roboto({ weight: ["300", "400", "500"], subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={roboto.className}>{children}</body>
        </html>
    );
}
