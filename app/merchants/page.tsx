import { MerchantBenefits } from "@/components/MerchantBenefits";
import { HowSettlementWorks } from "@/components/HowSettlementWorks";
import { FeeSavings } from "@/components/FeeSavings";
import { MerchantOnboardingSteps } from "@/components/MerchantOnboardingSteps";
import { ForEcosystem } from "@/components/ForEcosystem";
import { OnboardingForm } from "@/components/OnboardingForm";

export const metadata = {
  title: "For Merchants — FirstRound Payment Network",
  description:
    "Instant settlement for your business. Join the FirstRound merchant network — funds clear in seconds, processing costs drop, and zero chargebacks.",
};

export default function MerchantsPage() {
  return (
    <>
      <MerchantBenefits />
      <HowSettlementWorks />
      <FeeSavings />
      <MerchantOnboardingSteps />
      <ForEcosystem />
      <OnboardingForm />
    </>
  );
}
