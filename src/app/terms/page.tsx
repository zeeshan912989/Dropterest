import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Dropterest",
  description: "Terms and conditions for using Dropterest and the Motize monetization platform.",
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-mono font-bold mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>LEGAL TERMS</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#18181B] mb-4">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-[#71717A] mb-8 pb-6 border-b border-black/[0.06]">
            Last Updated: September 2026
          </p>

          <div className="space-y-6 text-sm text-[#52525B] leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-[#18181B] mb-2 font-editorial">1. Acceptance of Terms</h2>
              <p>
                By creating an account or accessing Dropterest and Motize, you agree to comply with and be bound by these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#18181B] mb-2 font-editorial">2. User Conduct &amp; Content Guidelines</h2>
              <p>
                Users agree not to upload abusive, copyright-infringing, or malicious material. All pins and downloadable drops must comply with intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#18181B] mb-2 font-editorial">3. Creator Monetization &amp; Payouts</h2>
              <p>
                Creators on Motize agree to provide accurate payout details. Payouts are processed in accordance with the selected billing and payment terms after verification.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#18181B] mb-2 font-editorial">4. Purchases &amp; Digital Licenses</h2>
              <p>
                Digital asset downloads purchased via Dropterest come with personal or commercial licensing as specified by the respective creator at the time of purchase.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#18181B] mb-2 font-editorial">5. Termination</h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms, engage in fraud, or abuse our platform infrastructure.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
