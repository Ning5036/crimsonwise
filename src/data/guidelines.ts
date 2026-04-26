export interface Reference {
  id: string;
  authors: string;
  title: string;
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  hbThreshold?: number;
  region: "TW" | "WHO" | "AABB" | "EU" | "BCSH" | "other";
}

export const GUIDELINES: Reference[] = [
  {
    id: "tw2023",
    authors: "台灣輸血醫學會",
    title: "台灣輸血指引 2023",
    journal: "台灣輸血醫學會",
    year: 2023,
    hbThreshold: 7,
    region: "TW",
    url: "https://www.tsbt.org.tw/",
  },
  {
    id: "aabb2016",
    authors: "Carson JL, Guyatt G, Heddle NM, et al.",
    title:
      "Clinical Practice Guidelines From the AABB: Red Blood Cell Transfusion Thresholds and Storage",
    journal: "JAMA",
    year: 2016,
    doi: "10.1001/jama.2016.9185",
    url: "https://jamanetwork.com/journals/jama/fullarticle/2569055",
    hbThreshold: 7,
    region: "AABB",
  },
  {
    id: "who2016",
    authors: "WHO",
    title: "WHO Guidelines for the Use of Blood Components",
    journal: "World Health Organization",
    year: 2016,
    hbThreshold: 7,
    region: "WHO",
    url: "https://www.who.int/publications/i/item/9789241549660",
  },
  {
    id: "eu_nice2015",
    authors: "NICE",
    title: "Blood Transfusion (NG24) — NICE Guidelines",
    journal: "National Institute for Health and Care Excellence",
    year: 2015,
    hbThreshold: 7,
    region: "EU",
    url: "https://www.nice.org.uk/guidance/ng24",
  },
  {
    id: "bcsh2004",
    authors: "O'Shaughnessy DF, Atterbury C, Bolton-Maggs PHB, et al.",
    title:
      "Guidelines for the Use of Fresh-Frozen Plasma, Cryoprecipitate and Cryosupernatant",
    journal: "British Journal of Haematology",
    year: 2004,
    doi: "10.1111/j.1365-2141.2004.04972.x",
    url: "https://onlinelibrary.wiley.com/doi/10.1111/j.1365-2141.2004.04972.x",
    region: "BCSH",
  },
  {
    id: "cardiac2010",
    authors: "Hajjar LA, et al.",
    title: "Transfusion Requirements After Cardiac Surgery (TRACS RCT)",
    journal: "JAMA",
    year: 2010,
    doi: "10.1001/jama.2010.1984",
    url: "https://jamanetwork.com/journals/jama/fullarticle/186686",
    hbThreshold: 8,
    region: "other",
  },
  {
    id: "tricc1999",
    authors: "Hébert PC, et al.",
    title:
      "A Multicenter, Randomized, Controlled Clinical Trial of Transfusion Requirements in Critical Care (TRICC)",
    journal: "New England Journal of Medicine",
    year: 1999,
    doi: "10.1056/NEJM199902113400601",
    url: "https://www.nejm.org/doi/full/10.1056/NEJM199902113400601",
    hbThreshold: 7,
    region: "other",
  },
  {
    id: "focus2011",
    authors: "Carson JL, et al.",
    title:
      "Liberal or Restrictive Transfusion in High-Risk Patients after Hip Surgery (FOCUS)",
    journal: "New England Journal of Medicine",
    year: 2011,
    doi: "10.1056/NEJMoa1012452",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1012452",
    hbThreshold: 8,
    region: "other",
  },
];

export const HB_THRESHOLD_DATA = [
  { name: "台灣指引\n(TW 2023)", threshold: 7, color: "#c0392b" },
  { name: "AABB\n(2016)", threshold: 7, color: "#e74c3c" },
  { name: "WHO\n(2016)", threshold: 7, color: "#e67e22" },
  { name: "NICE\n(2015)", threshold: 7, color: "#f39c12" },
  { name: "心臟術後\n(TRACS)", threshold: 8, color: "#8e44ad" },
  { name: "髖關節術後\n(FOCUS)", threshold: 8, color: "#2980b9" },
];
