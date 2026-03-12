import { ASINS, LOCATIONS, ReportData } from "@/lib/constants";

export default function SummaryCards({ report }: { report: ReportData }) {
  const { results } = report;

  const skusWithAny = ASINS.filter((a) =>
    LOCATIONS.some((l) => results[a.asin]?.[l.zip])
  ).length;

  const locationCounts = LOCATIONS.map((l) => ({
    ...l,
    count: ASINS.filter((a) => results[a.asin]?.[l.zip]).length,
  }));
  const topCity = locationCounts.reduce((a, b) => (b.count > a.count ? b : a));

  const asinCounts = ASINS.map((a) => ({
    ...a,
    count: LOCATIONS.filter((l) => results[a.asin]?.[l.zip]).length,
  }));
  const topSku = asinCounts.reduce((a, b) => (b.count > a.count ? b : a));

  // Short label: strip "Chameleon — "
  const topSkuShort = topSku.model.replace("Chameleon — ", "");

  const cards = [
    {
      value: ASINS.length.toString(),
      label: "SKUs Tracked",
      sub: "Lava Graphite + Lemon Green",
      color: "text-[#7dc800]",
    },
    {
      value: skusWithAny.toString(),
      label: "SKUs w/ Any Overnight",
      sub: "Across 10 locations",
      color: "text-[#7dc800]",
    },
    {
      value: topCity.city.toUpperCase(),
      label: "Best Overnight City",
      sub: `${topCity.count} of ${ASINS.length} SKUs available`,
      color: "text-[#5aaa00]",
    },
    {
      value: `${topSku.count}/10`,
      label: topSkuShort,
      sub: "Widest overnight coverage",
      color: "text-[#7dc800]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm text-center">
          <div className={`text-4xl font-extrabold ${card.color}`}>
            {card.value}
          </div>
          <div className="text-gray-700 font-semibold mt-1 text-sm">
            {card.label}
          </div>
          <div className="text-gray-400 text-xs mt-0.5">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
