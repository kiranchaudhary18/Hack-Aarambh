import {
  LiveEvent,
  UserRegistration,
  ScanCompletion,
  ScamDetection,
  ExtensionInstall,
  APIError,
  SystemAlert,
} from "../types/real-time-monitoring";

export const liveEvents: LiveEvent[] = [];

export const userRegistrations: UserRegistration[] = [];

export const scanCompletions: ScanCompletion[] = [];

export const scamDetections: ScamDetection[] = [];

export const extensionInstalls: ExtensionInstall[] = [];

export const apiErrors: APIError[] = [];

export const systemAlerts: SystemAlert[] = [];
