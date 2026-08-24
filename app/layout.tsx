import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Same Tag",
  description: "Two documents citing the same equipment tag only conflict if they disagree after both are converted to the same unit. Comparing raw numbers gets it wrong in both directions.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="font-sans antialiased">{children}</body></html>;
}
