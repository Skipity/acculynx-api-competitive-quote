import type { ExtractedQuote } from "./field-contract";

export type JobSummary = {
  id: string;
  jobNumber: string;
  milestone: string;
  street: string;
  city: string;
  state: string;
  customer: string;
  modifiedDate: string;
};

export const MOCK_JOBS: JobSummary[] = [
  {
    id: "5ac46861-75ae-45fe-b512-ff8d85ce8ab3",
    jobNumber: "JK-4418",
    milestone: "Approved",
    street: "1842 Willow Creek Rd",
    city: "Rockford",
    state: "IL",
    customer: "Dana Ellison",
    modifiedDate: "2026-09-04T14:22:00Z",
  },
  {
    id: "e591bf22-9828-4144-bca8-42cbb8c6e2c0",
    jobNumber: "JK-4391",
    milestone: "Prospect",
    street: "77 Birch Lane",
    city: "Beloit",
    state: "WI",
    customer: "Marcus Hale",
    modifiedDate: "2026-09-03T09:11:00Z",
  },
  {
    id: "24732e2b-bc9f-4a7a-a0a3-6200902a6fb4",
    jobNumber: "JK-4370",
    milestone: "Lead",
    street: "901 N Main St",
    city: "Janesville",
    state: "WI",
    customer: "Priya Shah",
    modifiedDate: "2026-08-29T18:40:00Z",
  },
];

export const MOCK_FIELD_DEFINITIONS = [
  { id: "11111111-1111-4111-8111-111111111111", label: "Comp Quote Total", fieldType: "Number", entityType: "job" },
  { id: "22222222-2222-4222-8222-222222222222", label: "Comp Quote Squares", fieldType: "Number", entityType: "job" },
  { id: "33333333-3333-4333-8333-333333333333", label: "Comp Quote Competitor", fieldType: "Text", entityType: "job" },
  { id: "44444444-4444-4444-8444-444444444444", label: "Comp Quote Quality", fieldType: "Text", entityType: "job" },
  { id: "55555555-5555-4555-8555-555555555555", label: "Comp Motion", fieldType: "Text", entityType: "job" },
  { id: "66666666-6666-4666-8666-666666666666", label: "Comp Quote Received At", fieldType: "Date", entityType: "job" },
  { id: "77777777-7777-4777-8777-777777777777", label: "Comp Quote Brief", fieldType: "Text", entityType: "job" },
];

export const SAMPLE_EXTRACT: ExtractedQuote = {
  competitorName: "Summit Roofing Co.",
  totalPrice: 18450,
  squares: 24,
  materialFamily: "asphalt",
  scopeTags: ["tear-off", "underlayment"],
  warrantyMentioned: true,
  missing: ["exclusions"],
  quoteQuality: "complete",
  recommendedMotion: "defend",
  salesBrief:
    "Summit at $18,450 on ~24 sq asphalt. Tear-off listed; exclusions thin. Defend on scope and decking, do not race the number.",
  confidence: 0.86,
  evidence: [
    "Header: SUMMIT ROOFING CO. — Residential Proposal",
    "Total due: $18,450.00",
    "Squares: 24",
    "Shingles: GAF Timberline HDZ",
  ],
};

export const SAMPLE_QUOTE_TEXT = `SUMMIT ROOFING CO.
Residential Roofing Proposal
1234 Industry Blvd, Rockford IL
Prepared for: Dana Ellison
Job site: 1842 Willow Creek Rd, Rockford IL

Scope
- Tear-off existing 3-tab shingles
- Install GAF Timberline HDZ (charcoal)
- Synthetic underlayment
- Ridge vent

Squares: 24
Material: Asphalt shingles
Labor + material total: $18,450.00
Warranty: GAF manufacturer warranty mentioned
Payment: 50% deposit, remainder on completion

Notes: Price good for 14 days. Gutters not included.
`;
