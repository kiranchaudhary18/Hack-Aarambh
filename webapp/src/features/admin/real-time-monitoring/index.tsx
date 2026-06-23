import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { useLocation } from "react-router-dom";

import { UserRegistrations } from "./components/UserRegistrations";
import { ScanCompletions } from "./components/ScanCompletions";
import { ScamDetections } from "./components/ScamDetections";
import { ExtensionInstallations } from "./components/ExtensionInstallations";
import { APIErrors } from "./components/APIErrors";
import { SystemAlerts } from "./components/SystemAlerts";
import { AlertThresholds } from "./components/AlertThresholds";
import { ScamDetectionRate } from "./components/ScamDetectionRate";
import { APILatencySpike } from "./components/APILatencySpike";
import { ServerCPU } from "./components/ServerCPU";
import { MemoryUsage } from "./components/MemoryUsage";
import { ConnectionPoolStatus } from "./components/ConnectionPoolStatus";
import { ExtensionErrorRate } from "./components/ExtensionErrorRate";
import { ModelAccuracy } from "./components/ModelAccuracy";
import { LiveDashboard } from "./components/LiveDashboard";
import { RealTimeNotifications } from "./components/RealTimeNotifications";
import { LiveUserCount } from "./components/LiveUserCount";
import { AlertDelivery } from "./components/AlertDelivery";

export function RealTimeMonitoring() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    document.title = "Live Event — ScamSniff Admin";
  }, []);

  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes("/events")) return "events";
    if (path.includes("/alerts")) return "alerts";
    if (path.includes("/websocket")) return "websocket";
    return "events";
  };

  const activeSection = getActiveSection();

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Live Event</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Live Event Feed</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time events, alerts, and WebSocket integration
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </FadeIn>

      {activeSection === "events" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn>
              <UserRegistrations />
            </FadeIn>
            <FadeIn delay={0.05}>
              <ScanCompletions />
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <ScamDetections />
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.15}>
              <ExtensionInstallations />
            </FadeIn>
            <FadeIn delay={0.2}>
              <APIErrors />
            </FadeIn>
          </div>

          <FadeIn delay={0.25}>
            <SystemAlerts />
          </FadeIn>
        </div>
      )}

      {activeSection === "alerts" && (
        <div className="space-y-6">
          <FadeIn>
            <ScamDetectionRate />
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.05}>
              <ServerCPU />
            </FadeIn>
            <FadeIn delay={0.1}>
              <MemoryUsage />
            </FadeIn>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.15}>
              <ConnectionPoolStatus />
            </FadeIn>
            <FadeIn delay={0.2}>
              <ExtensionErrorRate />
            </FadeIn>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.25}>
              <ModelAccuracy />
            </FadeIn>
            <FadeIn delay={0.3}>
              <APILatencySpike />
            </FadeIn>
          </div>

          <FadeIn delay={0.35}>
            <AlertThresholds />
          </FadeIn>
        </div>
      )}

      {activeSection === "websocket" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn>
              <LiveDashboard />
            </FadeIn>
            <FadeIn delay={0.05}>
              <LiveUserCount />
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <RealTimeNotifications />
          </FadeIn>

          <FadeIn delay={0.15}>
            <AlertDelivery />
          </FadeIn>
        </div>
      )}
    </div>
  );
}
