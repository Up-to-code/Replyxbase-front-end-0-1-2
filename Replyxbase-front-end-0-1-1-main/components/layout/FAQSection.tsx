"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is Replyxbase?",
      answer: "Replyxbase is an AI-powered customer support platform that helps businesses automate their customer service across multiple channels like WhatsApp, Website, and Email. Our AI agents can answer questions, book appointments, and resolve issues 24/7.",
    },
    {
      question: "How do I add data to my agent?",
      answer: "You can add data to your agent by connecting your knowledge base, uploading documents, or integrating with your existing tools. Our AI will automatically learn from your content to provide accurate responses.",
    },
    {
      question: "Is there a free plan?",
      answer: "Yes! We offer a free plan that includes 1 AI agent and 1,000 conversations per month. It's perfect for getting started and testing the platform.",
    },
    {
      question: "What are AI actions?",
      answer: "AI Actions allow your agent to perform tasks automatically, like booking appointments, processing orders, or fetching information from your CRM. You can configure custom actions to match your business needs.",
    },
    {
      question: "Do you support WhatsApp?",
      answer: "Yes, we fully support WhatsApp Business API! You can manage all your WhatsApp conversations from the unified inbox alongside other channels.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            badge="FAQ"
            title="Frequently asked questions"
            description="Everything you need to know about Replyxbase."
            center
            className="mb-16"
          />

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#005bbc]/20 transition-all overflow-hidden"
              >
                <button
                  className="w-full p-6 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg font-bold text-slate-900 pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-600 shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;


