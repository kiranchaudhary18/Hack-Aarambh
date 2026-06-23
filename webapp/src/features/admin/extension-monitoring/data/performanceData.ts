import {
  ExtensionLoadTime,
  MemoryUsage,
  ScanCompletionTime,
  OCRProcessingTime,
} from "../types/extension-monitoring";

export const extensionLoadTime: ExtensionLoadTime = {
  avg: 245,
  p50: 220,
  p95: 380,
  p99: 520,
  change: "-8.5%",
};

export const memoryUsage: MemoryUsage = {
  avg: 45.2,
  peak: 78.5,
  perInstance: 12.4,
  change: "+3.2%",
};

export const scanCompletionTime: ScanCompletionTime = {
  avg: 1850,
  p50: 1680,
  p95: 2450,
  change: "-12.5%",
};

export const ocrProcessingTime: OCRProcessingTime = {
  avg: 850,
  p50: 720,
  p95: 1250,
  change: "-15.2%",
};
