import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";

export enum NotificationType {
  SCAM_ALERT = "scam_alert",
  SCAN_RESULT = "scan_result",
  SECURITY_ALERT = "security_alert",
  ACCOUNT_UPDATE = "account_update",
  PATTERN_UPDATE = "pattern_update",
}

export enum NotificationStatus {
  PENDING = "pending",
  DELIVERED = "delivered",
  READ = "read",
}

@Entity()
export class ExtensionNotification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  type!: NotificationType;

  @Column()
  title!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "json", nullable: true })
  data!: {
    url?: string;
    riskScore?: number;
    scanId?: string;
    actionUrl?: string;
  };

  @Column({
    type: "enum",
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status!: NotificationStatus;

  @Column({ default: false })
  read!: boolean;

  @Column({ type: "json", nullable: true })
  metadata!: {
    source?: "extension" | "site";
    priority?: "low" | "medium" | "high";
    expiresAt?: Date;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  deliveredAt!: Date;

  @Column({ nullable: true })
  readAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;
}
