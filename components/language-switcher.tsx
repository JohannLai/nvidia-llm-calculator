"use client"

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

interface Language {
  locale: string;
  name: string;
}

const languages: Language[] = [
  { locale: 'en', name: 'English' },
  { locale: 'zh', name: '中文' }
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const onLanguageSelect = (newLocale: string) => {
    // Replace the locale segment of the pathname
    const path = pathname.replace(/^\/[^\/]+/, `/${newLocale}`)
    router.push(path)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem 
            key={language.locale}
            onClick={() => onLanguageSelect(language.locale)}
            className={locale === language.locale ? "bg-accent" : ""}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 