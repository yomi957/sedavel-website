import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sedavel Website CMS",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } },
};

// Separate root layout: public Tailwind styles, fonts and navigation stay off Studio.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{ margin: 0 }}>{children}</body></html>;
}
