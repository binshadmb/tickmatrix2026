"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { TAB_REGISTRY } from "@/app/tabs/tabRegistry";

export default function CockpitShell() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ------------------------------------------------------------
  // 1️⃣ Read current main tab and subtab from URL
  // ------------------------------------------------------------
  const mainTab = searchParams.get("tab") || "LiveStatus";
  const subTab = searchParams.get("sub") || "OverviewLanding";

  // ------------------------------------------------------------
  // 2️⃣ Resolve component from registry
  // ------------------------------------------------------------
  const SubtabComponent = useMemo(() => {
    const category = TAB_REGISTRY[mainTab];
    if (!category) return null;

    return category[subTab] || category["OverviewLanding"];
  }, [mainTab, subTab]);

  // ------------------------------------------------------------
  // 3️⃣ Navigation handler
  // ------------------------------------------------------------
  function navigate(newMain: string, newSub: string) {
    router.push(`/?tab=${newMain}&sub=${newSub}`);
  }

  // ------------------------------------------------------------
  // 4️⃣ Create Main Tab Labels (Top Bar)
  // ------------------------------------------------------------
  const mainTabs = Object.keys(TAB_REGISTRY);

  // ------------------------------------------------------------
  // 5️⃣ Create SubTab Labels for current category (Bottom Bar)
  // ------------------------------------------------------------
  const subTabs = Object.keys(TAB_REGISTRY[mainTab] || {});

  // ------------------------------------------------------------
  // 6️⃣ Render UI
  // ------------------------------------------------------------
  return (
    <div className="w-full h-full flex flex-col bg-black text-white">

      {/* MAIN TABS */}
      <div className="flex gap-2 p-2 border-b border-gray-700">
        {mainTabs.map((tabName) => (
          <button
            key={tabName}
            className={`px-3 py-1 rounded ${
              mainTab === tabName ? "bg-blue-600" : "bg-gray-800"
            }`}
            onClick={() => navigate(tabName, "OverviewLanding")}
          >
            {tabName}
          </button>
        ))}
      </div>

      {/* SUBTABS */}
      <div className="flex gap-2 p-2 border-b border-gray-700 overflow-x-auto">
        {subTabs.map((sName) => (
          <button
            key={sName}
            className={`px-3 py-1 whitespace-nowrap rounded ${
              subTab === sName ? "bg-green-600" : "bg-gray-700"
            }`}
            onClick={() => navigate(mainTab, sName)}
          >
            {sName}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 p-4 overflow-auto">
        {SubtabComponent ? <SubtabComponent /> : <div>Invalid Subtab</div>}
      </div>
    </div>
  );
}
