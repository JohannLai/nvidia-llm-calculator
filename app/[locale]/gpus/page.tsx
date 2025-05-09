import { type Metadata } from "next";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { Navigation } from "@/components/navigation";
import { NvidiaGpus } from "@/components/nvidia-gpus";
import { Footer } from "@/components/footer";

// Add metadata for SEO
export const generateMetadata = (): Metadata => {
  return {
    title: "NVIDIA GPU Library for LLMs | Find Optimal GPUs for AI Workloads",
    description:
      "Explore NVIDIA's GPU library designed for LLM workloads. Find the perfect GPU for your AI inference and training needs based on memory requirements.",
    alternates: {
      canonical: `/gpus`,
      languages: {
        en: "/en/gpus",
        zh: "/zh/gpus",
      },
    },
  };
};

export default function GpusPage() {
  const t = useTranslations("gpus");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD structured data */}
      <Script
        id="gpu-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "NVIDIA GPU Library for LLMs",
            description:
              "Explore NVIDIA's GPU library designed for LLM workloads. Find the perfect GPU for your AI inference and training needs.",
            mainContentOfPage: {
              "@type": "WebPageElement",
              isPartOf: {
                "@id": "https://nvidia-llm-calculator.vercel.app",
              },
            },
          }),
        }}
      />

      <div className="min-h-screen flex flex-col">
        <main className="container mx-auto py-10 px-4 flex-grow">
          <Navigation />
          <h1 className="text-3xl font-bold text-center mb-8 mt-20">
            {t("title")}
          </h1>
          <NvidiaGpus />
        </main>
        <Footer />
      </div>
    </div>
  );
}
