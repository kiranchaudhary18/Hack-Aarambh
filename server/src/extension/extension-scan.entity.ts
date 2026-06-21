import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class ExtensionScan {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column()
  url!: string;

  @Column()
  scanType!: "url" | "text" | "email";

  @Column({ type: "json", nullable: true })
  result!: {
    riskScore: number;
    riskLevel: "safe" | "suspicious" | "scam";
    reasons: string[];
    confidence: number;
  };

  @Column({ nullable: true })
  pageTitle!: string;

  @Column({ nullable: true })
  domain!: string;

  @Column({ default: false })
  isScam!: boolean;

  @Column({ default: false })
  reported!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;
}
