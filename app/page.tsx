"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ReportData } from "@/lib/constants";
import USMap from "@/components/USMap";
import SummaryCards from "@/components/SummaryCards";
import PrimeGrid from "@/components/PrimeGrid";

export default function Home() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/report-data.json")
      .then((r) => {
        if (!r.ok || r.headers.get("content-type")?.includes("text/html")) {
          throw new Error("No report data yet");
        }
        return r.json();
      })
      .then((data) => {
        if (!data) throw new Error("No report data yet");
        setReport(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#f0f2f5] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-1">
            <Image
              src="/xbotgo-logo.png"
              alt="xBotGo"
              width={120}
              height={40}
              className="rounded"
            />
            <h1 className="text-3xl font-bold text-gray-900">
              Prime Express Delivery Tracker
            </h1>
          </div>
          <p className="text-gray-500 mt-1 text-sm">
            2 SKUs &middot; 10 US ZIP codes &middot; Checks for Prime Express Delivery availability
            {report && (
              <>
                {" "}
                &middot; Checked{" "}
                {new Date(report.checkedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </>
            )}
          </p>
        </div>

        {loading && (
          <div className="text-center py-24 text-gray-400 text-lg">
            Loading report…
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg mb-2">No report data yet.</p>
            <p className="text-gray-400 text-sm">
              Visit <code className="bg-gray-200 px-1 rounded">/run</code> to
              generate the first report.
            </p>
          </div>
        )}

        {report && (
          <>
            <SummaryCards report={report} />
            <USMap report={report} />
            <PrimeGrid report={report} />
          </>
        )}
      </div>
    </main>
  );
}
