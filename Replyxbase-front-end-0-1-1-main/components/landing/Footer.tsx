import React from "react";
import { getTranslations } from "next-intl/server";
import { Zap, Linkedin, Instagram, Globe, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

const Footer = async () => {
  const t = await getTranslations("Landing.Footer");
  const tCommon = await getTranslations("Common");
  const year = new Date().getFullYear();

  const footerSections = [
    { 
      title: t("product"), 
      links: [
        { key: "features", href: "#features" },
        { key: "pricing", href: "#pricing" },
        { key: "integrations", href: "#integrations" },
        { key: "changelog", href: "#changelog" }
      ]
    },
    { 
      title: t("company"), 
      links: [
        { key: "about", href: "#about" },
        { key: "careers", href: "#careers" },
        { key: "blog", href: "#blog" },
        { key: "contact", href: "#contact" }
      ]
    },
    { 
      title: t("resources"), 
      links: [
        { key: "docs", href: "#docs" },
        { key: "api", href: "#api" },
        { key: "community", href: "#community" },
        { key: "help", href: "#help" }
      ]
    },
    { 
      title: t("legal"), 
      links: [
        { key: "privacy", href: "#privacy" },
        { key: "terms", href: "#terms" },
        { key: "security", href: "#security" },
        { key: "status", href: "#status" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-400" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Globe, href: "#", label: "Website", color: "hover:text-[#ffd600]" }
  ];

  return (
    <footer className="bg-zinc-900 text-white pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ffd600]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-2 border-white/20 relative group">
                <Zap className="w-8 h-8 text-zinc-900 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-[#ffd600]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              </div>
              <span className="font-bold text-3xl text-white tracking-tight">Replyxbase</span>
            </div>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-sm">
              {t("desc")}
            </p>
            
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className={`w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white/70 ${social.color} transition-all border-2 border-white/20 hover:border-white/30 hover:bg-white/15 hover:scale-110`} 
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {footerSections.map((section, i) => (
            <div key={i} className="md:col-span-2">
              <h4 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
                {section.title}
                <Sparkles className="w-4 h-4 text-[#ffd600]" />
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a 
                      href={link.href} 
                      className="text-base text-white/70 hover:text-white transition-all inline-flex items-center gap-2 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{t(`links.${link.key}`)}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mb-12 p-8 bg-white/5 rounded-2xl border-2 border-white/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{t("newsletter.title")}</h3>
              <p className="text-white/70 text-sm">{t("newsletter.description")}</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input 
                type="email" 
                placeholder={t("newsletter.placeholder")}
                className="flex-1 md:w-64 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 transition-all"
                aria-label={t("newsletter.placeholder")}
              />
              <button className="px-6 py-3 bg-[#ffd600] text-zinc-900 font-semibold rounded-xl hover:bg-[#ffd600]/90 transition-all border-2 border-[#ffd600] flex items-center gap-2">
                {t("newsletter.button")}
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-white/60">
              {tCommon("copyright", { year })}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full border-2 border-green-500/20">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold">{tCommon("allSystemsOperational")}</span>
              </div>
              
              <div className="hidden md:flex items-center gap-4 text-xs text-white/50">
                <Link href="#privacy" className="hover:text-white transition-colors">{t("links.privacy")}</Link>
                <span>•</span>
                <Link href="#terms" className="hover:text-white transition-colors">{t("links.terms")}</Link>
                <span>•</span>
                <Link href="#security" className="hover:text-white transition-colors">{t("links.security")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
