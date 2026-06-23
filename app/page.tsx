import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { PaymentUseCases } from "@/components/PaymentUseCases";
import { HowSettlementWorks } from "@/components/HowSettlementWorks";
import { FeeSavings } from "@/components/FeeSavings";
import { Compliance } from "@/components/Compliance";
import { ForEcosystem } from "@/components/ForEcosystem";
import { MerchantCTA } from "@/components/MerchantCTA";
import { ContactSection } from "@/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <PaymentUseCases />
      <HowSettlementWorks />
      <FeeSavings />
      <Compliance />
      <ForEcosystem />
      <MerchantCTA />
      <ContactSection />
    </>
  );
}
