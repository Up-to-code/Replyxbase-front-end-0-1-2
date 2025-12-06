"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import LanguageSwitcher from "@/components/landing/LanguageSwitcher";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-slate-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size="sm" />
            <span className="font-bold text-xl text-slate-900 group-hover:text-[#005bbc] transition-colors">
              Replyxbase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-700 hover:text-[#005bbc] font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher & CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm">
              Log In
            </Button>
            <Button variant="primary" size="sm" glow>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-slate-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-slate-700 hover:text-[#005bbc] font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <LanguageSwitcher />
              <Button variant="ghost" size="sm" className="w-full">
                Log In
              </Button>
              <Button variant="primary" size="sm" className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

