import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Dropterest",
  description: "Learn how Dropterest collects, uses, and protects your personal data and creative content.",
};

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[5px] bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B] text-xs font-mono font-bold mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>LEGAL &amp; PRIVACY</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#18181B] mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-[#71717A] mb-8 pb-6 border-b border-black/[0.06]">
            Last Updated: September 2026
          </p>

          <div className="space-y-6 text-sm text-[#52525B] leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-[#18181B] mb-2 font-editorial">1. Information We Collect</h2>
              <p>
                When you create an account on Dropterest or Motize, we collect your name, email address, password hash, and profile information. When you upload pins or digital asset drops, we store associated media and metadata securely.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#18181B] mb-2 font-editorial">2. How We Use Information</h2>
              <p>
                We use your data to authenticate your sessions, personalize your visual discovery feed, process creator payouts, and facilitate digital asset downloads and purchases.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#18181B] mb-2 font-editorial">3. Creator Rights &amp; Digital Assets</h2>
              <p>
                Creators retain 100% intellectual property rights over their original artwork, photography, 3D models, and digital files uploaded to Dropterest and Motize.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#18181B] mb-2 font-editorial">4. Security &amp; Data Protection</h2>
              <p>
                We use industry-standard encryption, secure HTTP-only session cookies, and strict PostgreSQL role-based authorization to protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#18181B] mb-2 font-editorial">5. Contact Us</h2>
              <p>
                If you have any questions regarding this Privacy Policy, please reach out to us at{" "}
                <a href="mailto:privacy@dropterest.com" className="text-[#18181B] font-semibold underline">
                  privacy@dropterest.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
