import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { PaymentUseCases } from "@/components/PaymentUseCases";
import { HowSettlementWorks } from "@/components/HowSettlementWorks";
import { Compliance } from "@/components/Compliance";
import { ForEcosystem } from "@/components/ForEcosystem";
import { ContactSection } from "@/components/ContactSection";
import { MerchantCTA } from "@/components/MerchantCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <PaymentUseCases />
      <HowSettlementWorks />
      <Compliance />
      <ForEcosystem />
      <MerchantCTA />
      <ContactSection />
    </>
  );
}
