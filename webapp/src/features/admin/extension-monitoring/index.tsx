import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  useEffect(() => {
    document.title = "Extension Monitoring — ScamSniff Admin";
  }, []);

  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes("/installation")) return "installation";
    if (path.includes("/usage")) return "usage";
    if (path.includes("/retention")) return "retention";
    if (path.includes("/errors")) return "errors";
    if (path.includes("/performance")) return "performance";
    return "installation";
  };

  const activeSection = getActiveSection();

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

      {activeSection === "installation" && (
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
      )}

      {activeSection === "usage" && (
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
      )}

      {activeSection === "retention" && (
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
      )}

      {activeSection === "errors" && (
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
      )}

      {activeSection === "performance" && (
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
      )}
    </div>
  );
}
