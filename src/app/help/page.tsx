import React from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Mail, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Help & Support | Dropterest",
  description: "Get answers to frequently asked questions and support for Dropterest and Motize.",
};

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I create and share a Drop?",
      a: "Click on the '+' button in the navigation rail or dashboard, upload your visual image or file, select category tags, and optionally attach a digital package to sell.",
    },
    {
      q: "How does creator monetization on Motize work?",
      a: "Upload your design assets, UI kits, templates, or 3D models with a price. When users purchase, earnings are credited to your Motize wallet and paid out to your linked bank account.",
    },
    {
      q: "How do I reset my password?",
      a: "Visit the login page and click 'Forgot password?'. Enter your registered email to receive a secure password reset link.",
    },
    {
      q: "What payment methods are supported for payouts?",
      a: "We support direct bank transfers, Raast, JazzCash, Stripe Connect, and international wire transfers.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#18181B] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#71717A] hover:text-[#18181B] mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dropterest</span>
        </Link>

        <div className="p-8 sm:p-12 rounded-[5px] bg-white border border-black/[0.08] shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] text-xs font-mono font-bold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HELP &amp; SUPPORT</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#18181B] mb-4">
            Help Center
          </h1>
          <p className="text-xs font-mono text-[#71717A] mb-8 pb-6 border-b border-black/[0.06]">
            Find quick answers or contact our team
          </p>

          <div className="space-y-6 mb-10">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-[5px] bg-[#FAF8F5] border border-black/[0.06]">
                <h3 className="font-editorial text-base font-bold text-[#18181B] mb-2">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-[5px] bg-[#18181B] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[5px] bg-white/10 flex items-center justify-center text-[#4DE3A5]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Need more help?</h4>
                <p className="text-xs text-white/70">Our support team is available 24/7.</p>
              </div>
            </div>
            <a
              href="mailto:support@dropterest.com"
              className="px-5 py-2.5 rounded-[5px] bg-[#4DE3A5] text-[#064E3B] font-bold text-xs hover:bg-[#60ebb0] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
