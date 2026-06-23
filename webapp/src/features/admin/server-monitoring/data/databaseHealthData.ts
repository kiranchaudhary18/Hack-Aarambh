import {
  ConnectionPool,
  QueryPerformance,
  DatabaseSize,
  ReplicationLag,
} from "../types/server-monitoring";

export const connectionPool: ConnectionPool = {
  total: 100,
  active: 42,
  idle: 38,
  waiting: 20,
  max: 100,
};

export const queryPerformance: QueryPerformance[] = [
  { query: "SELECT * FROM scans WHERE user_id = ?", avgTime: 45, count: 12500, slowQueries: 23 },
  { query: "SELECT * FROM results WHERE created_at > ?", avgTime: 82, count: 8900, slowQueries: 45 },
  { query: "INSERT INTO scans (...) VALUES (...)", avgTime: 35, count: 4500, slowQueries: 8 },
  { query: "UPDATE users SET last_login = ?", avgTime: 28, count: 3200, slowQueries: 5 },
  { query: "SELECT COUNT(*) FROM patterns", avgTime: 120, count: 5600, slowQueries: 78 },
];

export const databaseSize: DatabaseSize[] = [
  { database: "scamsniff", tables: 12, indexes: 24, size: 2.4, growth: "+12.5%" },
  { database: "scamsniff_analytics", tables: 8, indexes: 16, size: 1.8, growth: "+18.2%" },
  { database: "scamsniff_history", tables: 5, indexes: 10, size: 3.2, growth: "+8.7%" },
];

export const replicationLag: ReplicationLag = {
  primary: "db-primary-01",
  replica: "db-replica-01",
  lag: 0.2,
  status: "synced",
};
