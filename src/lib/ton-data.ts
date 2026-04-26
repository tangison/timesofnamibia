// ========= TYPES =========

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  region: string;
  source: "LinkedIn" | "NIEIS" | "NamibiaJobs" | "CareerPortal";
  postedAgo: string;
  salary?: string;
  type: string;
  url: string;
}

export interface Tender {
  id: string;
  docId: string;
  title: string;
  department: string;
  deadline: string;
  estimatedValue: string;
  summary: string[];
  keyDates: string[];
  compliance: string[];
  status: "open" | "closing" | "closed";
}

export interface WireSubmission {
  id: string;
  title: string;
  category: string;
  priority: "routine" | "urgent" | "breaking";
  source: string;
  content: string;
  verified: boolean;
  timestamp: string;
  author: string;
}

// ========= REGIONS =========

export const NAMIBIA_REGIONS = [
  "Khomas",
  "Erongo",
  "Otjozondjupa",
  "Kunene",
  "Oshana",
  "Hardap",
  "//Kharas",
  "Zambezi",
  "Ohangwena",
  "Omusati",
  "Oshikoto",
  "Kavango East",
  "Kavango West",
];

export const JOB_SOURCES: Job["source"][] = [
  "LinkedIn",
  "NIEIS",
  "NamibiaJobs",
  "CareerPortal",
];

// ========= JOBS DATA =========

export const JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Mining Engineer",
    company: "Namdeb Diamond Corporation",
    location: "Windhoek",
    region: "Khomas",
    source: "LinkedIn",
    postedAgo: "2h ago",
    salary: "N$ 85,000 - 120,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-2",
    title: "Financial Analyst",
    company: "Bank of Namibia",
    location: "Windhoek",
    region: "Khomas",
    source: "NIEIS",
    postedAgo: "5h ago",
    salary: "N$ 55,000 - 72,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-3",
    title: "Marine Logistics Coordinator",
    company: "Walvis Bay Corridor Group",
    location: "Walvis Bay",
    region: "Erongo",
    source: "NamibiaJobs",
    postedAgo: "8h ago",
    salary: "N$ 42,000 - 58,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-4",
    title: "Environmental Impact Assessor",
    company: "Ministry of Environment",
    location: "Windhoek",
    region: "Khomas",
    source: "CareerPortal",
    postedAgo: "12h ago",
    salary: "N$ 48,000 - 65,000/mo",
    type: "Contract",
    url: "#",
  },
  {
    id: "job-5",
    title: "Tourism Operations Manager",
    company: "Namibia Wildlife Resorts",
    location: "Swakopmund",
    region: "Erongo",
    source: "LinkedIn",
    postedAgo: "1d ago",
    salary: "N$ 38,000 - 52,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-6",
    title: "Electrical Engineer — Solar Division",
    company: "NamPower",
    location: "Windhoek",
    region: "Khomas",
    source: "NIEIS",
    postedAgo: "1d ago",
    salary: "N$ 70,000 - 95,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-7",
    title: "Legal Counsel — Mining Rights",
    company: "Firm: LorentzAngula Inc.",
    location: "Windhoek",
    region: "Khomas",
    source: "NamibiaJobs",
    postedAgo: "2d ago",
    salary: "N$ 60,000 - 88,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-8",
    title: "Agricultural Extension Officer",
    company: "Ministry of Agriculture",
    location: "Otjiwarongo",
    region: "Otjozondjupa",
    source: "CareerPortal",
    postedAgo: "2d ago",
    salary: "N$ 32,000 - 45,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-9",
    title: "IT Systems Administrator",
    company: "MTC Namibia",
    location: "Oshakati",
    region: "Oshana",
    source: "LinkedIn",
    postedAgo: "3d ago",
    salary: "N$ 45,000 - 62,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-10",
    title: "Port Operations Supervisor",
    company: "Namport",
    location: "Walvis Bay",
    region: "Erongo",
    source: "NIEIS",
    postedAgo: "3d ago",
    salary: "N$ 50,000 - 68,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-11",
    title: "Geological Survey Technician",
    company: "Geological Survey of Namibia",
    location: "Windhoek",
    region: "Khomas",
    source: "NamibiaJobs",
    postedAgo: "4d ago",
    salary: "N$ 35,000 - 48,000/mo",
    type: "Contract",
    url: "#",
  },
  {
    id: "job-12",
    title: "Community Health Nurse",
    company: "Ministry of Health",
    location: "Rundu",
    region: "Kavango East",
    source: "CareerPortal",
    postedAgo: "4d ago",
    salary: "N$ 28,000 - 38,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-13",
    title: "Education District Officer",
    company: "Ministry of Education",
    location: "Katima Mulilo",
    region: "Zambezi",
    source: "NIEIS",
    postedAgo: "5d ago",
    salary: "N$ 30,000 - 42,000/mo",
    type: "Full-time",
    url: "#",
  },
  {
    id: "job-14",
    title: "Uranium Processing Plant Operator",
    company: "Rossing Uranium",
    location: "Arandis",
    region: "Erongo",
    source: "LinkedIn",
    postedAgo: "5d ago",
    salary: "N$ 55,000 - 75,000/mo",
    type: "Full-time",
    url: "#",
  },
];

// ========= TENDER DATA =========

export const TENDERS: Tender[] = [
  {
    id: "tender-1",
    docId: "GRN-2026-0451",
    title: "Supply of Medical Equipment to Regional Hospitals",
    department: "Ministry of Health and Social Services",
    deadline: "2026-05-15",
    estimatedValue: "N$ 12.5M — N$ 18M",
    summary: [
      "Procurement of ICU ventilators and patient monitoring systems for 8 regional hospitals",
      "Includes installation, training, and 3-year maintenance warranty",
      "Bidders must be registered with the Pharmacy Council of Namibia",
    ],
    keyDates: [
      "Briefing: 2026-04-28",
      "Clarification deadline: 2026-05-05",
      "Submission: 2026-05-15 10:00 CAT",
    ],
    compliance: [
      "B-BBEE Level 1-4 certification",
      "ISO 13485 Medical Devices certification",
      "Local content minimum 30%",
      "Valid tax clearance certificate",
    ],
    status: "open",
  },
  {
    id: "tender-2",
    docId: "GRN-2026-0387",
    title: "Construction of Windhoek-Klein Windhoek Road Upgrade",
    department: "Roads Authority of Namibia",
    deadline: "2026-05-08",
    estimatedValue: "N$ 85M — N$ 120M",
    summary: [
      "Dual carriageway upgrade of 6.2km stretch including stormwater drainage",
      "Phase 2 of the Windhoek Urban Transport Master Plan",
      "24-month construction timeline with penalties for delays",
    ],
    keyDates: [
      "Site visit: 2026-04-22",
      "Submission: 2026-05-08 14:00 CAT",
      "Award notification: 2026-06-15",
    ],
    compliance: [
      "Registered with Construction Industries Federation",
      "Minimum Grade 5CE contractor rating",
      "Environmental Clearance Certificate",
      "Performance guarantee of 10% of tender price",
    ],
    status: "closing",
  },
  {
    id: "tender-3",
    docId: "GRN-2026-0512",
    title: "National Broadband Fiber Optic Rollout — Phase 3",
    department: "Ministry of Information and Communication Technology",
    deadline: "2026-06-01",
    estimatedValue: "N$ 200M — N$ 280M",
    summary: [
      "Fiber-to-the-home deployment across 14 towns in northern Namibia",
      "Includes last-mile connectivity for 45,000 households",
      "Public-private partnership model with 15-year concession period",
    ],
    keyDates: [
      "RFI responses: 2026-04-30",
      "Briefing: 2026-05-12",
      "Submission: 2026-06-01 11:00 CAT",
    ],
    compliance: [
      "CRAN telecommunications license",
      "Minimum 5 years fiber deployment experience",
      "Local employment plan (minimum 60% Namibian workforce)",
      "Financial capacity: audited turnover > N$ 100M for past 3 years",
    ],
    status: "open",
  },
  {
    id: "tender-4",
    docId: "GRN-2026-0298",
    title: "Supply of Solar Panels for Off-Grid Schools",
    department: "Ministry of Education, Arts and Culture",
    deadline: "2026-04-30",
    estimatedValue: "N$ 8.5M — N$ 14M",
    summary: [
      "Solar PV systems (5kW-20kW) for 120 off-grid schools across 6 regions",
      "Includes battery storage, inverters, and smart monitoring",
      "Training of 2 personnel per school for basic maintenance",
    ],
    keyDates: [
      "Submission: 2026-04-30 09:00 CAT",
      "Evaluation: 2026-05-10 to 2026-05-20",
    ],
    compliance: [
      "IREC or equivalent solar certification",
      "Local warehouse and spare parts inventory",
      "2-year warranty with 48-hour response SLA",
      "Environmental impact assessment for each site",
    ],
    status: "closing",
  },
  {
    id: "tender-5",
    docId: "GRN-2026-0621",
    title: "Feasibility Study: Lüderitz Deep-Water Port Expansion",
    department: "Namibian Ports Authority (Namport)",
    deadline: "2026-07-01",
    estimatedValue: "N$ 4.5M — N$ 7M",
    summary: [
      "Comprehensive feasibility study including environmental, economic, and engineering assessments",
      "Assessment of container terminal capacity expansion to handle Post-Panamax vessels",
      "Includes stakeholder consultation and public participation process",
    ],
    keyDates: [
      "Briefing: 2026-05-15",
      "Clarification deadline: 2026-06-10",
      "Submission: 2026-07-01 10:00 CAT",
    ],
    compliance: [
      "Registered professional engineers (EngC Namibia)",
      "Minimum 3 similar port feasibility studies in SADC region",
      "Environmental Assessment Practitioner registration",
      "BEE certificate Level 1-3",
    ],
    status: "open",
  },
];

// ========= WIRE SUBMISSIONS =========

export const INITIAL_SUBMISSIONS: WireSubmission[] = [
  {
    id: "wire-1",
    title: "Gold Road Mining Announces New Exploration License in Erongo",
    category: "Mining",
    priority: "urgent",
    source: "Mining Chamber of Namibia",
    content:
      "Gold Road Mining Ltd. has been granted an exclusive exploration license (EPL-7892) covering 45,000 hectares in the Erongo Region. The license area shows promising gold and rare earth mineral indicators based on preliminary airborne geophysical surveys.",
    verified: true,
    timestamp: "2026-04-26T08:30:00Z",
    author: "T. Shimwetha",
  },
  {
    id: "wire-2",
    title: "Bank of Namibia Holds Repo Rate Steady at 7.75%",
    category: "Economy",
    priority: "routine",
    source: "BoN Press Release",
    content:
      "The Monetary Policy Committee of the Bank of Namibia has decided to keep the repo rate unchanged at 7.75%. Governor Johannes !Gawaxab cited moderating inflation pressures and stable exchange rate dynamics as key factors in the decision.",
    verified: true,
    timestamp: "2026-04-26T07:15:00Z",
    author: "M. Amupanda",
  },
  {
    id: "wire-3",
    title: "BREAKING: Wildfire Threatens Brandberg Heritage Site",
    category: "National",
    priority: "breaking",
    source: "Erongo Regional Council",
    content:
      "A fast-moving wildfire is approaching the Brandberg Mountain heritage site. Emergency services have been deployed. The Ministry of Environment has activated its disaster response protocol. Tourists in the area are being evacuated.",
    verified: true,
    timestamp: "2026-04-26T09:45:00Z",
    author: "K. Gowaseb",
  },
  {
    id: "wire-4",
    title: "New Renewable Energy Feed-in Tariff Policy Draft Released",
    category: "Energy",
    priority: "routine",
    source: "Electricity Control Board",
    content:
      "The ECB has published draft regulations for a revised renewable energy feed-in tariff structure. The policy aims to incentivize small-scale solar and wind producers. Public comments are open until May 30, 2026.",
    verified: false,
    timestamp: "2026-04-25T16:20:00Z",
    author: "N. Shiweda",
  },
  {
    id: "wire-5",
    title: "Trans-Kalahari Corridor Upgrade Funding Secured",
    category: "Infrastructure",
    priority: "urgent",
    source: "Road Fund Administration",
    content:
      "The Road Fund Administration has confirmed N$ 340M in funding from the African Development Bank for the Trans-Kalahari Corridor upgrade. The project will widen 120km of the B6 highway between Gobabis and the Botswana border.",
    verified: true,
    timestamp: "2026-04-25T14:00:00Z",
    author: "H. Amutenya",
  },
];

// ========= TICKER ITEMS =========

export const TICKER_ITEMS = [
  "BREAKING: Brandberg wildfire — evacuation underway ▸",
  "BoN holds repo rate at 7.75% ▸",
  "Gold Road Mining secures EPL-7892 in Erongo ▸",
  "NIEIS: 847 new job listings this week ▸",
  "Trans-Kalahari Corridor: N$340M AfDB funding confirmed ▸",
  "NamPort: Lüderitz deep-water port feasibility tender open ▸",
  "Rossing Uranium processing plant hiring — 14 positions ▸",
  "Windhoek-Klein Windhoek road upgrade tender closing May 8 ▸",
  "National broadband fiber rollout Phase 3 — N$280M ▸",
  "Solar panels for 120 off-grid schools — tender closes April 30 ▸",
  "USD/NAD: 18.42 ▲ 0.3% ▸",
  "JSE All Share: 89,234 ▼ 0.1% ▸",
  "BTC/USD: $94,210 ▲ 1.2% ▸",
];

// ========= FEATURED ARTICLE =========

export const FEATURED_ARTICLE = {
  headline: "Namibia's Green Hydrogen Dream: Can the Desert Fuel the World?",
  subheadline:
    "As global energy giants pour billions into the Tsau //Khaeb project, questions emerge about local benefit and environmental trade-offs",
  author: "T. Shimwetha & M. Amupanda",
  date: "26 April 2026",
  category: "Economy",
  imageAlt:
    "Aerial view of solar panels and wind turbines in the Namib desert with hydrogen processing facility",
  content: `Namibia stands at the threshold of an energy revolution. The Tsau //Khaeb (Sperrgebiet) National Park, once accessible only to diamond miners, is now the epicenter of what could become the world's largest green hydrogen production facility. Three consortiums — Hyphen Hydrogen Energy, HDF Energy, and the Daures Green Hydrogen Village — are racing to convert the desert's abundant sun and wind into the fuel of the future.

The numbers are staggering. The Hyphen project alone promises N$ 120 billion in investment over two phases, with first production targeted for 2027. At full capacity, the facility would produce 350,000 tonnes of green hydrogen annually — enough to replace significant fossil fuel consumption in European and Asian markets.

But beneath the gleaming projections lies a more complex reality. Local communities in the //Kharas region have raised concerns about water usage in one of the world's driest countries. The desalination plant required for the project will consume an estimated 25MW of power before a single kilogram of hydrogen is produced.

"We cannot drink hydrogen," says Anna Fredericks, a community leader from Lüderitz. "What good is a green revolution if our people still live without clean water and reliable electricity?"

The Ministry of Mines and Energy maintains that community benefit agreements are being negotiated in good faith. A local content requirement of 30% Namibian employment and procurement has been written into all project licenses.

Meanwhile, environmental groups have questioned the wisdom of industrializing a national park. The Sperrgebiet is home to unique biodiversity, including endemic succulent plants found nowhere else on Earth.

The debate encapsulates Namibia's broader challenge: how to harness its extraordinary natural resources — from uranium to diamonds to now sunlight and wind — in a way that truly benefits its 2.6 million citizens. The green hydrogen dream may yet prove transformative, but only if the promises etched in project proposals become reality on the ground.`,
};
