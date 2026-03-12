import { ASINS, LOCATIONS, ReportData } from "@/lib/constants";

function getColor(count: number) {
  if (count === 0) return "#ef4444";
  if (count === 1) return "#f97316";
  return "#22c55e";
}

function getRadius(count: number) {
  return count === 0 ? 22 : 26;
}

const mapW = 900;
const mapH = 396;

export default function USMap({ report }: { report: ReportData }) {
  const { results } = report;

  const locationCounts = LOCATIONS.map((l) => ({
    ...l,
    count: ASINS.filter((a) => results[a.asin]?.[l.zip]).length,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-red-500">📍</span> Express Delivery Availability by Location
      </h2>

      <div className="relative w-full" style={{ paddingBottom: "30.8%" }}>
        <svg
          viewBox={`0 0 ${mapW} ${mapH}`}
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="dot-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000033" />
            </filter>
            <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e4eef8" />
              <stop offset="100%" stopColor="#cddff2" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={mapW} height={mapH} rx="10" fill="url(#mapBg)" />
          <path
            d="M 90 63 L 810 63 L 835 98 L 855 160 L 812 253 L 768 318 L 655 350 L 542 358 L 428 350 L 315 341 L 200 318 L 112 270 L 66 206 L 66 126 Z"
            fill="#b6d0e8"
            stroke="#8ab0ce"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M 655 350 L 672 368 L 655 384 L 636 375 L 634 350 Z"
            fill="#b6d0e8"
            stroke="#8ab0ce"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <line x1="66" y1="206" x2="810" y2="180" stroke="#9bbdd6" strokeWidth="0.5" opacity="0.4" />
          <line x1="350" y1="63" x2="340" y2="358" stroke="#9bbdd6" strokeWidth="0.5" opacity="0.4" />
          <text x={mapW / 2} y={mapH - 5} textAnchor="middle" fontSize="11" fill="#7a9ab8" fontStyle="italic">
            Approximate US Geography
          </text>

          {locationCounts.map((loc) => {
            const cx = (loc.x / 100) * mapW;
            const cy = (loc.y / 100) * mapH;
            const r = getRadius(loc.count);
            const color = getColor(loc.count);
            return (
              <g key={loc.zip}>
                <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.95} filter="url(#dot-shadow)" />
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="bold" fill="white">
                  {loc.count}
                </text>
                <text x={cx} y={cy + r + 16} textAnchor="middle" fontSize="13" fontWeight="600" fill="white" stroke="white" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke">
                  {loc.city}
                </text>
                <text x={cx} y={cy + r + 16} textAnchor="middle" fontSize="13" fontWeight="600" fill="#1e3a5f">
                  {loc.city}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-4 mt-3 justify-center text-xs text-gray-600">
        {[
          { color: "#ef4444", label: "0 SKUs overnight" },
          { color: "#f97316", label: "1 SKU overnight" },
          { color: "#22c55e", label: "Both SKUs overnight" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
