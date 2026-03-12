export const ASINS = [
  { asin: "B0D7HQFKPB", model: "Chameleon — Lava Graphite" },
  { asin: "B0DG2DYQD8", model: "Chameleon — Lemon Green" },
];

export const LOCATIONS = [
  { zip: "10001", city: "New York", state: "NY", x: 73.5, y: 31.5 },
  { zip: "77001", city: "Houston", state: "TX", x: 53.5, y: 62.5 },
  { zip: "60601", city: "Chicago", state: "IL", x: 62.0, y: 30.0 },
  { zip: "98101", city: "Seattle", state: "WA", x: 10.5, y: 15.5 },
  { zip: "13090", city: "Liverpool", state: "NY", x: 70.5, y: 26.5 },
  { zip: "91101", city: "Pasadena", state: "CA", x: 14.5, y: 52.5 },
  { zip: "32801", city: "Orlando", state: "FL", x: 67.5, y: 66.5 },
  { zip: "27601", city: "Raleigh", state: "NC", x: 70.0, y: 44.5 },
  { zip: "94103", city: "San Francisco", state: "CA", x: 8.0, y: 38.5 },
  { zip: "80202", city: "Denver", state: "CO", x: 38.0, y: 38.5 },
];

export type PrimeResult = {
  [asin: string]: {
    [zip: string]: boolean;
  };
};

export type ReportData = {
  results: PrimeResult;
  checkedAt: string;
  checkedAtMs: number;
};
