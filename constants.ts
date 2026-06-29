// Single source of truth for copy and network figures.
// Edit these and the whole site updates.

export const SITE = {
  name: "FirstRound",
  tagline: "The merchant payment network. Lower fees, instant settlement, zero chargebacks.",
  email: "support@firstroundcoin.com",
  phone: "+1 616 259 5438",
  location: "Detroit, Michigan",
  waitlistUrl: "https://form.jotform.com/252994210496060",
};

// Network performance figures shown in the trust strip / hero.
export const METRICS = {
  settlementTime: "~3s",
  networkFee: "0.8%",
  uptime: "99.9%",
  standard: "ISO 20022",
};

// Typical card-processing baseline used by the fee-savings calculator.
export const FEES = {
  cardPercent: 0.029, // 2.9%
  cardFlat: 0.3, // $0.30 per transaction
  firstRoundPercent: 0.008, // 0.8%
  firstRoundFlat: 0, // no per-transaction flat fee
  avgTicket: 45, // assumed average transaction size for tx-count math
};

export const PAYMENT_USE_CASES = [
  {
    key: "in-store",
    title: "In-store payments",
    body: "Accept payments at the counter with a tap or QR. Funds clear before the customer reaches the door.",
  },
  {
    key: "online",
    title: "Online checkout",
    body: "A drop-in checkout for your store or app. One integration, settlement in seconds, no chargebacks.",
  },
  {
    key: "invoicing",
    title: "Invoicing & B2B",
    body: "Send a payment request, get paid, and reconcile automatically with structured ISO 20022 data.",
  },
  {
    key: "cross-border",
    title: "Cross-border settlement",
    body: "Move value across markets without correspondent-bank delays or weekend holds.",
  },
];

export const SETTLEMENT_STEPS = [
  {
    n: "01",
    title: "Customer pays",
    body: "A customer pays at checkout — in-store, online, or by invoice — in the currency they already use.",
  },
  {
    n: "02",
    title: "Network settles",
    body: "The FirstRound network clears and confirms the transaction in seconds over a non-custodial rail.",
  },
  {
    n: "03",
    title: "You receive",
    body: "Funds land in your merchant account. You hold the keys — FirstRound never takes custody of your money.",
  },
];

export const COMPLIANCE = [
  {
    title: "Non-custodial architecture",
    body: "Merchants hold their own keys. FirstRound never takes custody of merchant funds — settlement happens directly to you.",
  },
  {
    title: "Merchant verification (KYC)",
    body: "Every business is verified through KYC/AML and business onboarding checks before going live on the network.",
  },
  {
    title: "Privacy by design",
    body: "Transaction data is minimized and encrypted. Customers are never asked for more than a payment actually needs.",
  },
  {
    title: "ISO 20022 aligned",
    body: "Structured payment messaging that speaks the language of modern banking and settlement systems out of the box.",
  },
];

export const MERCHANT_BENEFITS = [
  {
    stat: "Up to 90%",
    label: "lower fees",
    body: "Replace 2.9% + 30¢ card economics with a flat network fee under 1%.",
  },
  {
    stat: "~3 seconds",
    label: "to settle",
    body: "No multi-day holds or weekend delays. Funds are spendable almost immediately.",
  },
  {
    stat: "Zero",
    label: "chargebacks",
    body: "Payments are final once settled, removing the fraud and dispute overhead of cards.",
  },
  {
    stat: "100%",
    label: "your funds",
    body: "Non-custodial by design — your money is never pooled, lent, or held by a third party.",
  },
];

export const MERCHANT_ONBOARDING = [
  {
    n: "01",
    title: "Apply",
    body: "Tell us about your business. Takes a few minutes — no technical setup required to start.",
  },
  {
    n: "02",
    title: "Get verified",
    body: "We run business verification (KYC) and AML checks, typically cleared within a couple of business days.",
  },
  {
    n: "03",
    title: "Integrate",
    body: "Drop in our checkout, generate a payment QR, or send your first invoice. SDKs and a hosted option are available.",
  },
  {
    n: "04",
    title: "Go live",
    body: "Start accepting payments and settling in seconds. Track everything from your merchant dashboard.",
  },
];
