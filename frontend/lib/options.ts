export const PAYMENT_CHANNELS: { value: string; label: string }[] = [
  { value: "instant_payment", label: "Instant payment" },
  { value: "p2p_application", label: "P2P application" },
  { value: "wire_transfer", label: "Wire transfer" },
  { value: "ach", label: "ACH" },
  { value: "debit_card", label: "Debit card" },
  { value: "credit_card", label: "Credit card" },
  { value: "cryptocurrency", label: "Cryptocurrency" },
  { value: "gift_card", label: "Gift card" },
  { value: "check", label: "Check" },
  { value: "cash", label: "Cash" },
  { value: "marketplace_payment", label: "Marketplace payment" },
  { value: "unknown", label: "Unknown" },
  { value: "not_applicable", label: "Not applicable" },
];

export const INSTITUTION_TYPES: { value: string; label: string }[] = [
  { value: "bank", label: "Bank" },
  { value: "credit_union", label: "Credit union" },
  { value: "card_issuer", label: "Card issuer" },
  { value: "payment_application", label: "Payment application" },
  { value: "cryptocurrency_exchange", label: "Cryptocurrency exchange" },
  { value: "mortgage_servicer", label: "Mortgage servicer" },
  { value: "insurance_company", label: "Insurance company" },
  { value: "debt_collector", label: "Debt collector" },
  { value: "marketplace", label: "Marketplace" },
  { value: "investment_provider", label: "Investment provider" },
  { value: "other", label: "Other" },
  { value: "unknown", label: "Unknown" },
];

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC","PR","VI","GU","AS","MP","unknown",
];
