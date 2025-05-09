import { LlmCalculator } from "@/components/llm-calculator";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { useTranslations } from "next-intl";
import Script from "next/script";

export default function Home() {
  const t = useTranslations("calculator");

  return (
    <div className="flex flex-col min-h-screen">
      {/* JSON-LD structured data */}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "NVIDIA LLM Calculator",
            description:
              "Calculate GPU memory requirements for LLM models and find suitable NVIDIA GPUs for inference and training.",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            author: {
              "@type": "Organization",
              name: "NVIDIA",
              url: "https://www.nvidia.com",
            },
          }),
        }}
      />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Calculator Section */}
      <main
        id="calculator-section"
        className="container mx-auto py-20 px-4 flex-grow"
      >
        <h2 className="text-3xl font-bold text-center mb-8">{t("title")}</h2>
        <LlmCalculator />
      </main>

      <Footer />
    </div>
  );
}
