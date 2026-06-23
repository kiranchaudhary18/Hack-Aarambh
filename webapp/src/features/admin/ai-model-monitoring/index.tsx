import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { useLocation } from "react-router-dom";

import { AccuracyOverview } from "./components/AccuracyOverview";
import { FalsePositiveRate } from "./components/FalsePositiveRate";
import { FalseNegativeRate } from "./components/FalseNegativeRate";
import { ConfidenceDistribution } from "./components/ConfidenceDistribution";
import { PredictionDrift } from "./components/PredictionDrift";
import { InferenceLatency } from "./components/InferenceLatency";
import { RequestThroughput } from "./components/RequestThroughput";
import { ResponseTimeByType } from "./components/ResponseTimeByType";
import { QueueDepth } from "./components/QueueDepth";
import { ProcessingTime } from "./components/ProcessingTime";
import { GPUUtilization } from "./components/GPUUtilization";
import { MemoryUsage } from "./components/MemoryUsage";
import { TokenUsage } from "./components/TokenUsage";
import { CostTracking } from "./components/CostTracking";
import { ModelVersion } from "./components/ModelVersion";
import { TrainingDataDrift } from "./components/TrainingDataDrift";
import { FeatureImportance } from "./components/FeatureImportance";
import { RetrainingTriggers } from "./components/RetrainingTriggers";

export function AIModelMonitoring() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    document.title = "AI Model Monitoring — ScamSniff Admin";
  }, []);

  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes("/accuracy")) return "accuracy";
    if (path.includes("/performance")) return "performance";
    if (path.includes("/resources")) return "resources";
    if (path.includes("/health")) return "health";
    return "accuracy";
  };

  const activeSection = getActiveSection();

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">AI Model Monitoring</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Model Performance</h1>
        <p className="mt-2 text-muted-foreground">
          Accuracy, performance, resources, and health metrics
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </FadeIn>

      {activeSection === "accuracy" && (
        <div className="space-y-6">
          <FadeIn>
            <AccuracyOverview />
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.05}>
              <FalsePositiveRate />
            </FadeIn>
            <FadeIn delay={0.1}>
              <FalseNegativeRate />
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <ConfidenceDistribution />
          </FadeIn>

          <FadeIn delay={0.2}>
            <PredictionDrift />
          </FadeIn>
        </div>
      )}

      {activeSection === "performance" && (
        <div className="space-y-6">
          <FadeIn>
            <InferenceLatency />
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.05}>
              <RequestThroughput />
            </FadeIn>
            <FadeIn delay={0.1}>
              <ResponseTimeByType />
            </FadeIn>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.15}>
              <QueueDepth />
            </FadeIn>
            <FadeIn delay={0.2}>
              <ProcessingTime />
            </FadeIn>
          </div>
        </div>
      )}

      {activeSection === "resources" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn>
              <GPUUtilization />
            </FadeIn>
            <FadeIn delay={0.05}>
              <MemoryUsage />
            </FadeIn>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.1}>
              <TokenUsage />
            </FadeIn>
            <FadeIn delay={0.15}>
              <CostTracking />
            </FadeIn>
          </div>
        </div>
      )}

      {activeSection === "health" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn>
              <ModelVersion />
            </FadeIn>
            <FadeIn delay={0.05}>
              <TrainingDataDrift />
            </FadeIn>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.1}>
              <FeatureImportance />
            </FadeIn>
            <FadeIn delay={0.15}>
              <RetrainingTriggers />
            </FadeIn>
          </div>
        </div>
      )}
    </div>
  );
}
