import {
  CPUUsage,
  MemoryUsage,
  DiskUsage,
  NetworkTraffic,
  ProcessStatus,
} from "../types/server-monitoring";

export const cpuUsage: CPUUsage = {
  current: 42,
  average: 38,
  perCore: [35, 42, 38, 45, 40, 48, 36, 41],
  loadAverage: [1.2, 1.5, 1.8],
  stealTime: 0.1,
  change: "+5.2%",
};

export const memoryUsage: MemoryUsage = {
  ram: {
    total: 16,
    used: 12.4,
    free: 3.6,
    percentage: 77.5,
  },
  swap: {
    total: 8,
    used: 2.1,
    free: 5.9,
    percentage: 26.3,
  },
  buffers: 1.2,
  cache: 3.8,
  change: "+3.1%",
};

export const diskUsage: DiskUsage[] = [
  {
    mount: "/",
    total: 100,
    used: 67,
    free: 33,
    percentage: 67,
    iops: { read: 450, write: 320 },
    throughput: { read: 125, write: 89 },
  },
  {
    mount: "/var",
    total: 50,
    used: 28,
    free: 22,
    percentage: 56,
    iops: { read: 380, write: 290 },
    throughput: { read: 98, write: 76 },
  },
  {
    mount: "/home",
    total: 200,
    used: 145,
    free: 55,
    percentage: 72.5,
    iops: { read: 520, write: 410 },
    throughput: { read: 142, write: 115 },
  },
];

export const networkTraffic: NetworkTraffic[] = [
  { timestamp: "00:00", bandwidthIn: 12.5, bandwidthOut: 8.2, packetRateIn: 450, packetRateOut: 320, connections: 234 },
  { timestamp: "01:00", bandwidthIn: 8.3, bandwidthOut: 5.1, packetRateIn: 320, packetRateOut: 210, connections: 189 },
  { timestamp: "02:00", bandwidthIn: 5.2, bandwidthOut: 3.4, packetRateIn: 210, packetRateOut: 145, connections: 156 },
  { timestamp: "03:00", bandwidthIn: 4.1, bandwidthOut: 2.8, packetRateIn: 165, packetRateOut: 120, connections: 134 },
  { timestamp: "04:00", bandwidthIn: 3.5, bandwidthOut: 2.2, packetRateIn: 140, packetRateOut: 98, connections: 112 },
  { timestamp: "05:00", bandwidthIn: 4.8, bandwidthOut: 3.1, packetRateIn: 190, packetRateOut: 135, connections: 145 },
  { timestamp: "06:00", bandwidthIn: 8.9, bandwidthOut: 5.8, packetRateIn: 350, packetRateOut: 245, connections: 234 },
  { timestamp: "07:00", bandwidthIn: 15.2, bandwidthOut: 10.5, packetRateIn: 580, packetRateOut: 410, connections: 345 },
  { timestamp: "08:00", bandwidthIn: 22.4, bandwidthOut: 15.8, packetRateIn: 850, packetRateOut: 620, connections: 456 },
  { timestamp: "09:00", bandwidthIn: 28.6, bandwidthOut: 20.2, packetRateIn: 1080, packetRateOut: 790, connections: 567 },
  { timestamp: "10:00", bandwidthIn: 32.1, bandwidthOut: 23.5, packetRateIn: 1210, packetRateOut: 920, connections: 678 },
  { timestamp: "11:00", bandwidthIn: 35.8, bandwidthOut: 26.2, packetRateIn: 1350, packetRateOut: 1020, connections: 789 },
  { timestamp: "12:00", bandwidthIn: 34.2, bandwidthOut: 25.1, packetRateIn: 1290, packetRateOut: 980, connections: 756 },
  { timestamp: "13:00", bandwidthIn: 33.5, bandwidthOut: 24.8, packetRateIn: 1260, packetRateOut: 970, connections: 734 },
  { timestamp: "14:00", bandwidthIn: 34.8, bandwidthOut: 25.5, packetRateIn: 1310, packetRateOut: 995, connections: 745 },
  { timestamp: "15:00", bandwidthIn: 36.2, bandwidthOut: 26.8, packetRateIn: 1360, packetRateOut: 1040, connections: 767 },
  { timestamp: "16:00", bandwidthIn: 35.1, bandwidthOut: 25.9, packetRateIn: 1320, packetRateOut: 1010, connections: 754 },
  { timestamp: "17:00", bandwidthIn: 32.4, bandwidthOut: 24.1, packetRateIn: 1220, packetRateOut: 940, connections: 698 },
  { timestamp: "18:00", bandwidthIn: 28.9, bandwidthOut: 21.5, packetRateIn: 1080, packetRateOut: 840, connections: 623 },
  { timestamp: "19:00", bandwidthIn: 25.2, bandwidthOut: 18.8, packetRateIn: 940, packetRateOut: 730, connections: 545 },
  { timestamp: "20:00", bandwidthIn: 21.8, bandwidthOut: 16.2, packetRateIn: 810, packetRateOut: 630, connections: 478 },
  { timestamp: "21:00", bandwidthIn: 18.5, bandwidthOut: 13.8, packetRateIn: 690, packetRateOut: 540, connections: 412 },
  { timestamp: "22:00", bandwidthIn: 15.2, bandwidthOut: 11.4, packetRateIn: 570, packetRateOut: 445, connections: 356 },
  { timestamp: "23:00", bandwidthIn: 12.8, bandwidthOut: 9.5, packetRateIn: 480, packetRateOut: 370, connections: 298 },
];

export const processStatus: ProcessStatus[] = [
  { name: "NestJS", pid: 1234, cpu: 15.2, memory: 2.4, status: "running", uptime: "15d 4h 32m" },
  { name: "PostgreSQL", pid: 5678, cpu: 8.5, memory: 4.2, status: "running", uptime: "15d 4h 35m" },
  { name: "Python AI Engine", pid: 9012, cpu: 12.8, memory: 3.8, status: "running", uptime: "15d 4h 30m" },
  { name: "Redis", pid: 3456, cpu: 2.1, memory: 0.8, status: "running", uptime: "15d 4h 38m" },
  { name: "Nginx", pid: 7890, cpu: 1.5, memory: 0.4, status: "running", uptime: "15d 4h 40m" },
];
