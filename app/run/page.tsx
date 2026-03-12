"use client";

import { useEffect, useRef, useState } from "react";

function buildBookmarklet(): string {
  const vercelUrl = "https://xbotgo-prime-tracker.vercel.app";
  const code = `(async function(){const ASINS=[{asin:'B0D7HQFKPB',model:'Chameleon — Lava Graphite'},{asin:'B0DG2DYQD8',model:'Chameleon — Lemon Green'}];const LOCS=[{zip:'10001',city:'New York',state:'NY'},{zip:'77001',city:'Houston',state:'TX'},{zip:'60601',city:'Chicago',state:'IL'},{zip:'98101',city:'Seattle',state:'WA'},{zip:'13090',city:'Liverpool',state:'NY'},{zip:'91101',city:'Pasadena',state:'CA'},{zip:'32801',city:'Orlando',state:'FL'},{zip:'27601',city:'Raleigh',state:'NC'},{zip:'94103',city:'San Francisco',state:'CA'},{zip:'80202',city:'Denver',state:'CO'}];const box=document.createElement('div');box.style.cssText='position:fixed;top:16px;right:16px;background:#1a1a1a;color:#fff;padding:20px;border-radius:12px;z-index:2147483647;font-family:sans-serif;font-size:13px;width:300px;max-height:400px;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.5);border:1px solid #7dc800';document.body.appendChild(box);const rows=[];function render(s){box.innerHTML='<b style="color:#7dc800">xBotGo Overnight Checker</b><br><br>'+rows.slice(-10).join('<br>')+(s?'<br><span style="color:#9ca3af">'+s+'</span>':'');}render('Starting…');async function changeZip(zip){try{const r=await fetch('/gp/delivery/ajax/address-change.html',{method:'POST',credentials:'include',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({locationType:'LOCATION_INPUT',zipCode:zip,storeContext:'generic',deviceType:'web',pageType:'Gateway',actionSource:'glow'}).toString()});return r.ok;}catch(e){return false;}}async function checkAsin(asin){try{const r=await fetch('/dp/'+asin,{credentials:'include'});const h=await r.text();return h.toLowerCase().includes('7am');}catch(e){return false;}}const results={};for(const loc of LOCS){render('📍 '+loc.city+'…');await changeZip(loc.zip);await new Promise(r=>setTimeout(r,1500));const checks=await Promise.all(ASINS.map(async a=>{const p=await checkAsin(a.asin);if(!results[a.asin])results[a.asin]={};results[a.asin][loc.zip]=p;return p;}));const n=checks.filter(Boolean).length;rows.push((n===ASINS.length?'🟢':n>0?'🟡':'🔴')+' '+loc.city+': '+n+'/'+ASINS.length);render('');}const data={results,checkedAt:new Date().toISOString(),checkedAtMs:Date.now()};const encoded=btoa(JSON.stringify(data));const url='${vercelUrl}/run#data='+encoded;box.innerHTML='<b style="color:#7dc800">xBotGo Overnight Checker</b><br><br>'+rows.join('<br>')+'<br><br><span style="color:#4ade80;font-weight:bold">✅ Done!</span><br><br><a href="'+url+'" target="_blank" style="display:inline-block;background:#7dc800;color:#000;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">→ Save Report</a>';})();`;
  return "javascript:" + code;
}

function CopyBookmarklet({ linkRef }: { linkRef: React.RefObject<HTMLAnchorElement | null> }) {
  const [copied, setCopied] = useState(false);
  const code = buildBookmarklet();

  useEffect(() => {
    if (linkRef.current) linkRef.current.setAttribute("href", code);
  }, [code, linkRef]);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button
      onClick={copy}
      className="w-full font-bold px-6 py-3 rounded-xl text-sm transition-colors"
      style={{ background: "#7dc800", color: "#000" }}
    >
      {copied ? "✅ Copied! Now add it as a bookmark →" : "📋 Copy Bookmarklet Code"}
    </button>
  );
}

export default function RunPage() {
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error" | "no-secret">("idle");
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("xbotgo-overnight-secret");
    if (saved) setSecret(saved);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#data=")) return;
    const encoded = hash.slice(6);
    window.history.replaceState(null, "", "/run");
    const savedSecret = localStorage.getItem("xbotgo-overnight-secret");
    if (!savedSecret) { setStatus("no-secret"); return; }
    (async () => {
      setStatus("saving");
      try {
        const json = atob(encoded);
        const parsed = JSON.parse(json);
        setCheckedAt(parsed.checkedAt);
        const res = await fetch("/api/save-results", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-save-secret": savedSecret },
          body: json,
        });
        setStatus(res.ok ? "success" : "error");
      } catch { setStatus("error"); }
    })();
  }, []);

  function handleSecretChange(val: string) {
    setSecret(val);
    localStorage.setItem("xbotgo-overnight-secret", val);
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#7dc800" }}>
          xBotGo Overnight Tracker — Runner
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Checks for Prime Overnight delivery by 7AM across 10 US ZIP codes.
        </p>

        {status === "saving" && (
          <div className="mb-6 p-4 bg-blue-900 border border-blue-600 rounded-xl text-blue-200 text-sm">
            ⏳ Saving report data…
          </div>
        )}
        {status === "success" && (
          <div className="mb-6 p-4 bg-green-900 border border-green-600 rounded-xl">
            <p className="text-green-300 font-bold text-base mb-1">✅ Report saved!</p>
            <p className="text-green-400 text-sm mb-3">
              {checkedAt ? `Checked ${new Date(checkedAt).toLocaleString()}` : ""}
              {" · "}Vercel auto-deploys in ~1 min.
            </p>
            <a href="/" className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
              View Public Report →
            </a>
          </div>
        )}
        {status === "error" && (
          <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-xl text-red-300 text-sm">
            ❌ Save failed — check your secret and try again.
          </div>
        )}
        {status === "no-secret" && (
          <div className="mb-6 p-4 bg-yellow-900 border border-yellow-600 rounded-xl text-yellow-300 text-sm">
            ⚠️ Results received but no secret saved. Enter your secret below, then run again.
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-5 mb-5">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Save Secret <span className="text-gray-500 font-normal">(saved in your browser)</span>
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => handleSecretChange(e.target.value)}
            placeholder="your save secret"
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2"
            style={{ focusRingColor: "#7dc800" } as React.CSSProperties}
          />
          <p className="text-gray-500 text-xs mt-1">Stored locally — enter once.</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 mb-5">
          <p className="text-sm font-medium text-gray-300 mb-3">
            Install bookmarklet <span className="text-gray-500 font-normal">(one-time setup)</span>
          </p>
          <CopyBookmarklet linkRef={linkRef} />
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p className="font-semibold text-gray-300">To install in Chrome:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click <b>Copy Code</b> above</li>
              <li>Right-click your bookmarks bar → <b>Add page…</b></li>
              <li>Name: <span className="text-gray-200">xBotGo Overnight</span></li>
              <li>Paste the copied code as the <b>URL</b></li>
              <li>Click Save</li>
            </ol>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 text-sm text-gray-400">
          <p className="font-semibold text-gray-200 mb-2">Weekly run:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to <a href="https://www.amazon.com" target="_blank" rel="noreferrer" className="underline" style={{ color: "#7dc800" }}>amazon.com</a> (logged in)</li>
            <li>Click the bookmarklet — status panel appears</li>
            <li>Wait ~2 min for all 10 locations</li>
            <li>Click <b>→ Save Report</b> — auto-saves here</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
