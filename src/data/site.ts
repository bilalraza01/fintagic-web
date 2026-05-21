// Single source of truth for all page content.

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Why Us", href: "#why" },
  { label: "Work", href: "#work" },
  { label: "Credentials", href: "#credentials" },
] as const;

export const CONTACT_HREF = "/contact-us";

export type Capability = {
  id: string;
  t1: string;
  t2: string;
  color: string;
  blurb: string;
};

export const CAPABILITIES: Capability[] = [
  {
    id: "bookkeeping",
    t1: "Ecommerce",
    t2: "Bookkeeping",
    color: "#00DF7F",
    blurb:
      "Clean, accrual-basis books that actually reflect how a DTC brand makes money, not a shoebox of Stripe payouts.",
  },
  {
    id: "cogs",
    t1: "Inventory",
    t2: "& COGS",
    color: "#37D366",
    blurb:
      "Landed cost, freight, and shrink tracked per SKU so your margins are real numbers, not vibes.",
  },
  {
    id: "salestax",
    t1: "Sales Tax",
    t2: "& Nexus",
    color: "#043D45",
    blurb:
      "Economic nexus monitored across all 50 states, registrations handled, filings never late.",
  },
  {
    id: "cashflow",
    t1: "Cash Flow",
    t2: "Forecasting",
    color: "#6C5CE7",
    blurb:
      "A 13-week cash model that tells you when you can place the next PO, before the bank does.",
  },
  {
    id: "cfo",
    t1: "Fractional",
    t2: "CFO",
    color: "#FF6B6B",
    blurb:
      "Board decks, unit economics, and raise-ready models from someone who has scaled DTC brands before.",
  },
  {
    id: "recon",
    t1: "Multi-Channel",
    t2: "Reconciliation",
    color: "#00B5D8",
    blurb:
      "Shopify, Amazon, TikTok Shop, Faire, and every processor reconciled to the cent, monthly.",
  },
  {
    id: "tax",
    t1: "Year-End",
    t2: "Tax Prep",
    color: "#E84393",
    blurb:
      "Entity strategy, R&D credits, and a tax return your CPA won't have to rebuild from scratch.",
  },
];

export type Value = {
  tag: string;
  title: string;
  body: string;
};

export const VALUES: Value[] = [
  {
    tag: "01",
    title: "Specialist",
    body: "We only do DTC. No generalists learning your business model on your dime.",
  },
  {
    tag: "02",
    title: "Accurate",
    body: "Reconciled to the cent across every channel, processor, and payout.",
  },
  {
    tag: "03",
    title: "Fast",
    body: "Monthly close landed by day 5, not a guessing game on day 25.",
  },
  {
    tag: "04",
    title: "Proactive",
    body: "We flag the margin leak before it quietly sinks the quarter.",
  },
];

export type Tool = { name: string; slug: string };

export const TOOLS: Tool[] = [
  { name: "QuickBooks", slug: "quickbooks" },
  { name: "Xero", slug: "xero" },
  { name: "Shopify", slug: "shopify" },
  { name: "Stripe", slug: "stripe" },
  { name: "Gusto", slug: "gusto" },
  { name: "PayPal", slug: "paypal" },
  { name: "Square", slug: "square" },
  { name: "WooCommerce", slug: "woocommerce" },
  { name: "BigCommerce", slug: "bigcommerce" },
  { name: "Mailchimp", slug: "mailchimp" },
];

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

export const STATS: Stat[] = [
  {
    value: 480,
    prefix: "$",
    suffix: "M+",
    label:
      "In ecommerce revenue reconciled to the cent across every sales channel and payment processor.",
  },
  {
    value: 312,
    suffix: "",
    label:
      "Direct-to-consumer brands whose books we keep clean, accurate, and always audit-ready.",
  },
  {
    value: 99.98,
    suffix: "%",
    decimals: 2,
    label:
      "Reconciliation accuracy across Shopify, Amazon, and every payout that hits the bank.",
  },
  {
    value: 5,
    suffix: "-day",
    label:
      "Average monthly close, so you steer the business on fresh numbers instead of stale guesses.",
  },
  {
    value: 7.2,
    prefix: "$",
    suffix: "M",
    decimals: 1,
    label:
      "In deductions and credits captured for clients that their previous firm quietly left on the table.",
  },
  {
    value: 14,
    suffix: " states",
    label:
      "Sales-tax states monitored and filed per client on average, with zero late filings on record.",
  },
  {
    value: 48,
    suffix: "h",
    label:
      "From kickoff to a fully onboarded finance stack, with no long ramp-up or handover pain.",
  },
];

export const VERTICALS = [
  "Apparel & Fashion",
  "Beauty & Skincare",
  "Food & Beverage",
  "Supplements",
  "Home & Lifestyle",
  "Pet",
  "Electronics",
  "Subscription Boxes",
];

export type CaseStudy = {
  metric: string;
  title: string;
  body: string;
  vertical: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    metric: "$0 → $9M",
    title: "Built the finance stack from scratch",
    body: "A skincare brand went from a single bank account to investor-grade books in 18 months: A2X, accrual COGS, and a board deck that closed their Series A.",
    vertical: "Beauty & Skincare",
  },
  {
    metric: "3 yrs",
    title: "Untangled three years of channel mess",
    body: "An apparel brand had Shopify and Amazon tangled into one ledger. We rebuilt clean, audit-ready books in six weeks without pausing operations.",
    vertical: "Apparel & Fashion",
  },
  {
    metric: "$410K",
    title: "Cut tax exposure with the right structure",
    body: "A supplements brand was over-collecting in some states and exposed in others. Nexus cleanup plus an entity restructure saved $410K.",
    vertical: "Supplements",
  },
  {
    metric: "$6M",
    title: "Made the numbers raise-ready",
    body: "A subscription-box brand needed cohort retention and contribution margin a VC would trust. They closed a $6M seed eight weeks later.",
    vertical: "Subscription Boxes",
  },
];

export const CREDENTIALS = [
  "QuickBooks ProAdvisor",
  "CA (ICAP)",
  "ACCA",
  "Xero Certified",
  "A2X Certified",
  "ACMA",
];
