import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { useLocation } from "react-router-dom";

import { TrafficOverview } from "./components/TrafficOverview";
import { VisitorChart } from "./components/VisitorChart";
import { PageViewsChart } from "./components/PageViewsChart";
import { GeoDistribution } from "./components/GeoDistribution";
import { DeviceBreakdown } from "./components/DeviceBreakdown";
import { TrafficSources } from "./components/TrafficSources";
import { BounceRate } from "./components/BounceRate";
import { ConversionFunnel } from "./components/ConversionFunnel";
import { UserJourney } from "./components/UserJourney";
import { ErrorMonitoring } from "./components/ErrorMonitoring";
import { JSErrorsList } from "./components/JSErrorsList";
import { APIFailures } from "./components/APIFailures";
import { NetworkErrors } from "./components/NetworkErrors";
import { ErrorTrends } from "./components/ErrorTrends";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { PageLoadTimes } from "./components/PageLoadTimes";
import { CoreWebVitals } from "./components/CoreWebVitals";
import { APIResponseTimes } from "./components/APIResponseTimes";

export function WebsiteMonitoring() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    document.title = "Website Monitoring — ScamSniff Admin";
  }, []);

  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes("/traffic")) return "traffic";
    if (path.includes("/errors")) return "errors";
    if (path.includes("/performance")) return "performance";
    return "traffic";
  };

  const activeSection = getActiveSection();

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Website Monitoring</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Website Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time traffic, errors, and performance metrics
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </FadeIn>

      {activeSection === "traffic" && (
        <div className="space-y-6">
          <FadeIn>
            <TrafficOverview />
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.05}>
              <VisitorChart />
            </FadeIn>
            <FadeIn delay={0.1}>
              <PageViewsChart />
            </FadeIn>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.15}>
              <GeoDistribution />
            </FadeIn>
            <FadeIn delay={0.2}>
              <DeviceBreakdown />
            </FadeIn>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.25}>
              <TrafficSources />
            </FadeIn>
            <FadeIn delay={0.3}>
              <BounceRate />
            </FadeIn>
          </div>

          <FadeIn delay={0.35}>
            <ConversionFunnel />
          </FadeIn>

          <FadeIn delay={0.4}>
            <UserJourney />
          </FadeIn>
        </div>
      )}

      {activeSection === "errors" && (
        <div className="space-y-6">
          <FadeIn>
            <ErrorMonitoring />
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.05}>
              <JSErrorsList />
            </FadeIn>
            <FadeIn delay={0.1}>
              <APIFailures />
            </FadeIn>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.15}>
              <NetworkErrors />
            </FadeIn>
            <FadeIn delay={0.2}>
              <ErrorTrends />
            </FadeIn>
          </div>
        </div>
      )}

      {activeSection === "performance" && (
        <div className="space-y-6">
          <FadeIn>
            <PerformanceMetrics />
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.05}>
              <PageLoadTimes />
            </FadeIn>
            <FadeIn delay={0.1}>
              <CoreWebVitals />
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <APIResponseTimes />
          </FadeIn>
        </div>
      )}
    </div>
  );
}
