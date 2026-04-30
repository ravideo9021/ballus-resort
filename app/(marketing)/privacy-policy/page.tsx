import type { Metadata } from "next";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/marketing/section-heading";
import { extractTextContent } from "@/components/marketing/rich-content";
import { getPageRecord } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Ballu's Resort & Café, Manali.",
};

export default async function PrivacyPolicyPage() {
  const page = await getPageRecord("privacy-policy");
  const body = page?.body ? extractTextContent(page.body) : null;

  return (
    <section className="bg-[#F5EFE3] pt-36 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <FadeUp>
          <SectionHeading eyebrow="Legal" headline="Privacy Policy" />
        </FadeUp>
        <FadeUp delay={0.15}>
          {body ? (
            <div
              className="prose-resort prose prose-lg max-w-none mt-12"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          ) : (
            <p className="text-[#0B1B22]/60 text-lg mt-12 leading-relaxed">
              Our privacy policy is being prepared. Please contact us at{" "}
              <a href="mailto:ballusresort@gmail.com" className="text-[#1A6B7A] underline">
                ballusresort@gmail.com
              </a>{" "}
              for any privacy-related questions.
            </p>
          )}
        </FadeUp>
      </div>
    </section>
  );
}
