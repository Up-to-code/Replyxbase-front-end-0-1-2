"use client";
import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Logo from "@/components/brand/Logo";

const FooterSection: React.FC = () => {
  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Integrations", href: "#integrations" },
      { label: "Changelog", href: "#changelog" },
    ],
    Company: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
    Resources: [
      { label: "Documentation", href: "#docs" },
      { label: "API Reference", href: "#api" },
      { label: "Help Center", href: "#help" },
      { label: "Community", href: "#community" },
    ],
    Legal: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Security", href: "#security" },
      { label: "Status", href: "#status" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="bg-slate-900 text-white border-t-2 border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Logo size="sm" />
                <span className="font-bold text-xl">Replyxbase</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                The future of customer communication. AI-powered support that never sleeps.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border-2 border-slate-700 hover:border-[#005bbc] hover:bg-[#005bbc]/10 transition-all"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-slate-400 hover:text-[#005bbc] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-bold text-sm mb-4 text-slate-300 uppercase tracking-wider">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t-2 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Replyxbase Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="#privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#security" className="hover:text-white transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;


