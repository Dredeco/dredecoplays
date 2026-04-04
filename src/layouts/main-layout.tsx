import Footer from "@features/site/Footer";
import Header from "@features/site/Header";
import NewsletterPopup from "@features/newsletter/NewsletterPopup";
import ScrollToTop from "@features/site/ScrollToTop";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NewsletterPopup />
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <Header />
      <main className="min-h-screen" suppressHydrationWarning>
        {children}
      </main>
      <Footer />
    </>
  );
}
