import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Activity, AlertTriangle, Wifi } from "lucide-react";

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

  useEffect(() => {
    document.title = "Real-Time Monitoring — ScamSniff Admin";
  }, []);

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Real-Time Monitoring</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Live Event Feed</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time events, alerts, and WebSocket integration
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </FadeIn>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="clay grid w-full grid-cols-3">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Live Events
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="websocket" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            WebSocket
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="websocket" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
