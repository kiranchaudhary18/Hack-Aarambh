import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Download, Users, TrendingUp, AlertTriangle, Zap } from "lucide-react";

import { TotalInstalls } from "./components/TotalInstalls";
import { InstallSources } from "./components/InstallSources";
import { InstallTrends } from "./components/InstallTrends";
import { UninstallReasons } from "./components/UninstallReasons";
import { VersionDistribution } from "./components/VersionDistribution";
import { ActiveUsers } from "./components/ActiveUsers";
import { SessionDuration } from "./components/SessionDuration";
import { FeatureUsage } from "./components/FeatureUsage";
import { ToolbarClicks } from "./components/ToolbarClicks";
import { ContextMenuUsage } from "./components/ContextMenuUsage";
import { RetentionRate } from "./components/RetentionRate";
import { CohortAnalysis } from "./components/CohortAnalysis";
import { ChurnRate } from "./components/ChurnRate";
import { ReturnFrequency } from "./components/ReturnFrequency";
import { ExtensionCrashes } from "./components/ExtensionCrashes";
import { APIFailures } from "./components/APIFailures";
import { PermissionErrors } from "./components/PermissionErrors";
import { ContentScriptErrors } from "./components/ContentScriptErrors";
import { BackgroundWorkerErrors } from "./components/BackgroundWorkerErrors";
import { ExtensionLoadTime } from "./components/ExtensionLoadTime";
import { MemoryUsage } from "./components/MemoryUsage";
import { ScanCompletionTime } from "./components/ScanCompletionTime";
import { OCRProcessingTime } from "./components/OCRProcessingTime";

export function ExtensionMonitoring() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    document.title = "Extension Monitoring — ScamSniff Admin";
  }, []);

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Extension Monitoring</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Extension Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Installation, usage, retention, errors, and performance metrics
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </FadeIn>

      <Tabs defaultValue="installation" className="space-y-6">
        <TabsList className="clay grid w-full grid-cols-5">
          <TabsTrigger value="installation" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Installation
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usage
          </TabsTrigger>
          <TabsTrigger value="retention" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Retention
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Errors
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="installation" className="space-y-6">
          <div className="space-y-6">
            <FadeIn>
              <TotalInstalls />
            </FadeIn>

            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={0.05}>
                <InstallSources />
              </FadeIn>
              <FadeIn delay={0.1}>
                <InstallTrends />
              </FadeIn>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={0.15}>
                <UninstallReasons />
              </FadeIn>
              <FadeIn delay={0.2}>
                <VersionDistribution />
              </FadeIn>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn>
                <ActiveUsers />
              </FadeIn>
              <FadeIn delay={0.05}>
                <SessionDuration />
              </FadeIn>
            </div>

            <FadeIn delay={0.1}>
              <FeatureUsage />
            </FadeIn>

            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={0.15}>
                <ToolbarClicks />
              </FadeIn>
              <FadeIn delay={0.2}>
                <ContextMenuUsage />
              </FadeIn>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn>
                <RetentionRate />
              </FadeIn>
              <FadeIn delay={0.05}>
                <ChurnRate />
              </FadeIn>
            </div>

            <FadeIn delay={0.1}>
              <CohortAnalysis />
            </FadeIn>

            <FadeIn delay={0.15}>
              <ReturnFrequency />
            </FadeIn>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <div className="space-y-6">
            <FadeIn>
              <ExtensionCrashes />
            </FadeIn>

            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={0.05}>
                <APIFailures />
              </FadeIn>
              <FadeIn delay={0.1}>
                <PermissionErrors />
              </FadeIn>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={0.15}>
                <ContentScriptErrors />
              </FadeIn>
              <FadeIn delay={0.2}>
                <BackgroundWorkerErrors />
              </FadeIn>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn>
                <ExtensionLoadTime />
              </FadeIn>
              <FadeIn delay={0.05}>
                <MemoryUsage />
              </FadeIn>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <FadeIn delay={0.1}>
                <ScanCompletionTime />
              </FadeIn>
              <FadeIn delay={0.15}>
                <OCRProcessingTime />
              </FadeIn>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
