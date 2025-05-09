import { Navigation } from '@/components/navigation'
import { NvidiaGpus } from '@/components/nvidia-gpus'
import { Footer } from '@/components/footer'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // 正确等待 params
  const { locale } = await params;
  
  const t = await getTranslations({ locale, namespace: 'gpus' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function GpusPage({
  params
}: {
  params: { locale: string }
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gpus' });
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto py-10 px-4 flex-grow">
        <Navigation />
        <h1 className="text-3xl font-bold text-center mb-8 mt-20">{t('title')}</h1>
        <NvidiaGpus />
      </main>
      <Footer />
    </div>
  )
} 