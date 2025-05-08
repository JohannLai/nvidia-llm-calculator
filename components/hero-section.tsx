"use client"

import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function HeroSection() {
  const t = useTranslations('hero');
  
  const scrollToCalculator = () => {
    document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })
  }
  
  // Reference for the canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // GPU particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas to full container size
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Create particles
    const particles: {
      x: number, 
      y: number, 
      radius: number, 
      color: string, 
      speed: number,
      direction: number
    }[] = []
    
    const colors = ['#76B900', '#1A73E8', '#00A3E0', '#FF6900']
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.7 + 0.1,
        direction: Math.random() * Math.PI * 2
      })
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += Math.cos(particle.direction) * particle.speed
        particle.y += Math.sin(particle.direction) * particle.speed
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.direction = Math.PI - particle.direction
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.direction = -particle.direction
        }
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black to-gray-900">
      {/* Canvas for particle animation */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 text-center">
        <div
          className="mb-6 opacity-0 translate-y-4 animate-[fadeInUp_0.8s_ease-out_forwards]"
        >
          <span className="px-4 py-1 text-sm font-medium text-white bg-green-600 rounded-full">
            {t("badge")}
          </span>
        </div>
        
        <h1 
          className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl opacity-0 translate-y-4 animate-[fadeInUp_0.8s_0.2s_ease-out_forwards]"
        >
          <span className="block">{t("title.line1")}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            {t("title.line2")}
          </span>
        </h1>
        
        <p 
          className="max-w-2xl mt-6 text-xl text-gray-300 opacity-0 translate-y-4 animate-[fadeInUp_0.8s_0.4s_ease-out_forwards]"
        >
          {t("description")}
        </p>
        
        <div 
          className="flex flex-col items-center mt-12 space-y-6 opacity-0 translate-y-4 animate-[fadeInUp_0.8s_0.6s_ease-out_forwards]"
        >
          <Button 
            onClick={scrollToCalculator} 
            size="lg" 
            className="px-8 py-6 text-lg font-semibold transition-all bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            {t("button")}
          </Button>
        </div>
      </div>
      
      {/* Moved arrow outside the content div to fix positioning */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-gray-400" />
      </div>
      {/* GPU Circuit Graphics - Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-20">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#76B900" d="M50,20 L150,20 L180,50 L180,150 L150,180 L50,180 L20,150 L20,50 Z" />
          <path fill="none" stroke="#76B900" strokeWidth="2" d="M60,40 L140,40 L160,60 L160,140 L140,160 L60,160 L40,140 L40,60 Z" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="#76B900" strokeWidth="2" />
          <line x1="20" y1="100" x2="70" y2="100" stroke="#76B900" strokeWidth="2" />
          <line x1="130" y1="100" x2="180" y2="100" stroke="#76B900" strokeWidth="2" />
          <line x1="100" y1="20" x2="100" y2="70" stroke="#76B900" strokeWidth="2" />
          <line x1="100" y1="130" x2="100" y2="180" stroke="#76B900" strokeWidth="2" />
        </svg>
      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="30" width="140" height="140" rx="10" fill="none" stroke="#00A3E0" strokeWidth="2" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#00A3E0" strokeWidth="2" />
          <circle cx="100" cy="100" r="20" fill="none" stroke="#00A3E0" strokeWidth="2" />
          <line x1="60" y1="60" x2="80" y2="80" stroke="#00A3E0" strokeWidth="2" />
          <line x1="140" y1="60" x2="120" y2="80" stroke="#00A3E0" strokeWidth="2" />
          <line x1="60" y1="140" x2="80" y2="120" stroke="#00A3E0" strokeWidth="2" />
          <line x1="140" y1="140" x2="120" y2="120" stroke="#00A3E0" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
} 