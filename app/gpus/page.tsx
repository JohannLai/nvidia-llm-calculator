import { Navigation } from '@/components/navigation'
import { NvidiaGpus } from '@/components/nvidia-gpus'
import { Footer } from '@/components/footer'

export default function GpusPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto py-10 px-4 flex-grow">
        <Navigation />
        <h1 className="text-3xl font-bold text-center mb-8 mt-20">NVIDIA GPUs for Machine Learning</h1>
        <NvidiaGpus />
      </main>
      <Footer />
    </div>
  )
} 