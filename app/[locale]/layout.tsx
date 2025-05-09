import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NVIDIA LLM Calculator | GPU Memory Requirements for AI Models",
  description:
    "Calculate GPU memory requirements for LLM models and find suitable NVIDIA GPUs for inference and training. Optimize your AI infrastructure with our free tool.",
  keywords:
    "NVIDIA, LLM, GPU, calculator, AI, machine learning, deep learning, inference, training, GPU memory",
  authors: [{ name: "NVIDIA" }],
  category: "Technology",
  creator: "NVIDIA",
  publisher: "NVIDIA",
  metadataBase: new URL("https://nvidia-llm-calculator.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      zh: "/zh",
    },
  },
  openGraph: {
    title: "NVIDIA LLM Calculator | GPU Memory Requirements for AI Models",
    description:
      "Calculate GPU memory requirements for LLM models and find suitable NVIDIA GPUs for inference and training.",
    url: "https://nvidia-llm-calculator.vercel.app",
    siteName: "NVIDIA LLM Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NVIDIA LLM Calculator | GPU Memory Requirements for AI Models",
    description:
      "Calculate GPU memory requirements for LLM models and find suitable NVIDIA GPUs for inference and training.",
    creator: "@nvidia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Generate static params for locales
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // await params before accessing properties
  const { locale } = await params;

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        <link
          rel="canonical"
          href={`https://nvidia-llm-calculator.vercel.app/${locale}`}
        />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
      <Analytics />
    </html>
  );
}
