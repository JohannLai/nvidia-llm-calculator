import { redirect } from 'next/navigation'
import { LlmCalculator } from '@/components/llm-calculator'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'

export default function Home() {
  redirect('/en');
}
