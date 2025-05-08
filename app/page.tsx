import { LlmCalculator } from '@/components/llm-calculator'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Calculator Section */}
      <main id="calculator-section" className="container mx-auto py-20 px-4 flex-grow">
        <h2 className="text-3xl font-bold text-center mb-8">NVIDIA LLM Calculator</h2>
        <LlmCalculator />
      </main>
      
      <Footer />
    </div>
  )
}
