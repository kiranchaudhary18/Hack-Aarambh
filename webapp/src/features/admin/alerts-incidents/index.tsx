import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { AlertTriangle, AlertCircle, Settings } from "lucide-react";

import { AlertHistory } from "./components/AlertHistory";
import { IncidentManagement } from "./components/IncidentManagement";
import { AlertConfiguration } from "./components/AlertConfiguration";

export function AlertsIncidents() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    document.title = "Alerts & Incidents — ScamSniff Admin";
  }, []);

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

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="clay grid w-full grid-cols-3">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alert History
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Incidents
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          <FadeIn>
            <AlertHistory />
          </FadeIn>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <FadeIn>
            <IncidentManagement />
          </FadeIn>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <FadeIn>
            <AlertConfiguration />
          </FadeIn>
        </TabsContent>
      </Tabs>
    </div>
  );
}
