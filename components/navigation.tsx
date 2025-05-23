"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations, useLocale } from "next-intl";

export function Navigation() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const locale = useLocale(); // Get current locale
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-sm shadow-xl py-3"
          : "bg-gray-900/95 py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 relative">
            <img src="/favicon.svg" alt="Logo" className="h-full w-full" />
          </div>
          <Link
            href={`/${locale}`}
            className="text-white font-bold text-xl tracking-tight"
          >
            NVIDIA <span className="text-green-500">{t("brand")}</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href={`/${locale}`}
            className={`${
              pathname === `/${locale}`
                ? "text-white border-b-2 border-green-500"
                : "text-gray-300 hover:text-white"
            } transition-colors font-medium pb-1`}
          >
            {t("calculator")}
          </Link>
          <Link
            href={`/${locale}/gpus`}
            className={`${
              pathname === `/${locale}/gpus`
                ? "text-white border-b-2 border-green-500"
                : "text-gray-300 hover:text-white"
            } transition-colors font-medium pb-1`}
          >
            {t("gpuLibrary")}
          </Link>
          <Link
            href={`/${locale}#calculator-section`}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-md font-medium hover:from-green-600 hover:to-green-700 transition-colors shadow-md text-sm mr-0"
          >
            {t("calculateNow")}
          </Link>
          <div className="ml-2">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <div className="mr-3">
            <LanguageSwitcher />
          </div>
          <button
            onClick={toggleMobileMenu}
            className="text-white hover:text-green-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4">
              <Link
                href={`/${locale}`}
                className={`${
                  pathname === `/${locale}`
                    ? "text-white font-bold"
                    : "text-gray-300"
                } py-2 text-lg`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("calculator")}
              </Link>
              <Link
                href={`/${locale}/gpus`}
                className={`${
                  pathname === `/${locale}/gpus`
                    ? "text-white font-bold"
                    : "text-gray-300"
                } py-2 text-lg`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("gpuLibrary")}
              </Link>
              <a
                href={`/${locale}#calculator-section`}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-md font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("calculateNow")}
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
