import { MerchantBenefits } from "@/components/MerchantBenefits";
import { FeeSavings } from "@/components/FeeSavings";
import { MerchantOnboardingSteps } from "@/components/MerchantOnboardingSteps";
import { OnboardingForm } from "@/components/OnboardingForm";

export const metadata = {
  title: "Merchant Onboarding — FirstRound",
  description: "Apply to become a verified merchant on the FirstRound payment network.",
};

export default function MerchantsPage() {
  return (
    <>
      <MerchantBenefits />
      <FeeSavings />
      <MerchantOnboardingSteps />
      <OnboardingForm />
    </>
  );
}
