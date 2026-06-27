import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class ExtensionSettings {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column({ type: "json", nullable: true })
  settings!: {
    notificationsEnabled?: boolean;
    scamAlertSound?: boolean;
    autoScanEnabled?: boolean;
    riskThreshold?: number;
    theme?: "light" | "dark" | "system";
    notificationPreferences?: {
      scamPatternsDigest?: boolean;
      weeklyScanSummary?: boolean;
      productUpdates?: boolean;
      scamAlerts?: boolean;
      securityAlerts?: boolean;
      patternUpdates?: boolean;
      accountUpdates?: boolean;
    };
  };

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: "json", nullable: true })
  deviceInfo!: {
    browser?: string;
    os?: string;
    version?: string;
    lastSeen?: Date;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;
}
