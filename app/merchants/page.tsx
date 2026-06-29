import { MerchantBenefits } from "@/components/MerchantBenefits";
import { HowSettlementWorks } from "@/components/HowSettlementWorks";
import { FeeSavings } from "@/components/FeeSavings";
import { MerchantOnboardingSteps } from "@/components/MerchantOnboardingSteps";
import { ForEcosystem } from "@/components/ForEcosystem";
import { OnboardingForm } from "@/components/OnboardingForm";

export const metadata = {
  title: "For Merchants — FirstRound Payment Network",
  description:
    "Accept payments with up to 70% lower fees, instant settlement, and zero chargebacks. Join the FirstRound merchant network.",
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
