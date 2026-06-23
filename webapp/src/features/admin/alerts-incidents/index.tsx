import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { useLocation } from "react-router-dom";

import { AlertHistory } from "./components/AlertHistory";
import { IncidentManagement } from "./components/IncidentManagement";
import { AlertConfiguration } from "./components/AlertConfiguration";

export function AlertsIncidents() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    document.title = "Alerts & Incidents — ScamSniff Admin";
  }, []);

  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes("/history")) return "history";
    if (path.includes("/incidents")) return "incidents";
    if (path.includes("/configuration")) return "configuration";
    return "history";
  };

  const activeSection = getActiveSection();

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Alerts & Incidents</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Alert Management</h1>
        <p className="mt-2 text-muted-foreground">
          Alert history, incident management, and configuration
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </FadeIn>

      {activeSection === "history" && (
        <FadeIn>
          <AlertHistory />
        </FadeIn>
      )}

      {activeSection === "incidents" && (
        <FadeIn>
          <IncidentManagement />
        </FadeIn>
      )}

      {activeSection === "configuration" && (
        <FadeIn>
          <AlertConfiguration />
        </FadeIn>
      )}
    </div>
  );
}
