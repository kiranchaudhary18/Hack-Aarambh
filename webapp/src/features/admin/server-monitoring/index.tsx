import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Cpu, Zap, Database, Clock } from "lucide-react";

import { CPUUsage } from "./components/CPUUsage";
import { MemoryUsage } from "./components/MemoryUsage";
import { DiskUsage } from "./components/DiskUsage";
import { NetworkTraffic } from "./components/NetworkTraffic";
import { ProcessMonitoring } from "./components/ProcessMonitoring";
import { RequestRate } from "./components/RequestRate";
import { ResponseTime } from "./components/ResponseTime";
import { ErrorRate } from "./components/ErrorRate";
import { ActiveConnections } from "./components/ActiveConnections";
import { QueueStatus } from "./components/QueueStatus";
import { ConnectionPool } from "./components/ConnectionPool";
import { QueryPerformance } from "./components/QueryPerformance";
import { DatabaseSize } from "./components/DatabaseSize";
import { ReplicationLag } from "./components/ReplicationLag";
import { ServerUptime } from "./components/ServerUptime";
import { ServiceHealth } from "./components/ServiceHealth";
import { Incidents } from "./components/Incidents";
import { SLAMonitoring } from "./components/SLAMonitoring";

export function ServerMonitoring() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    document.title = "Server Monitoring — ScamSniff Admin";
  }, []);

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Server Monitoring</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Server Health</h1>
        <p className="mt-2 text-muted-foreground">
          System resources, API performance, database health, and uptime metrics
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </FadeIn>

      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="clay grid w-full grid-cols-4">
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            API Performance
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="uptime" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Uptime
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn>
                <CPUUsage />
              </FadeIn>
              <FadeIn delay={0.05}>
                <MemoryUsage />
              </FadeIn>
            </div>

            <FadeIn delay={0.1}>
              <DiskUsage />
            </FadeIn>

            <FadeIn delay={0.15}>
              <NetworkTraffic />
            </FadeIn>

            <FadeIn delay={0.2}>
              <ProcessMonitoring />
            </FadeIn>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="space-y-6">
            <FadeIn>
              <ActiveConnections />
            </FadeIn>

            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={0.05}>
                <RequestRate />
              </FadeIn>
              <FadeIn delay={0.1}>
                <ResponseTime />
              </FadeIn>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={0.15}>
                <ErrorRate />
              </FadeIn>
              <FadeIn delay={0.2}>
                <QueueStatus />
              </FadeIn>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <div className="space-y-6">
            <FadeIn>
              <ConnectionPool />
            </FadeIn>

            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={0.05}>
                <QueryPerformance />
              </FadeIn>
              <FadeIn delay={0.1}>
                <DatabaseSize />
              </FadeIn>
            </div>

            <FadeIn delay={0.15}>
              <ReplicationLag />
            </FadeIn>
          </div>
        </TabsContent>

        <TabsContent value="uptime" className="space-y-6">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn>
                <ServerUptime />
              </FadeIn>
              <FadeIn delay={0.05}>
                <ServiceHealth />
              </FadeIn>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={0.1}>
                <Incidents />
              </FadeIn>
              <FadeIn delay={0.15}>
                <SLAMonitoring />
              </FadeIn>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
