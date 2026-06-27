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
export class ApiToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  token!: string;

  @Column()
  userId!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ default: 50 })
  dailyLimit!: number;

  @Column({ default: 0 })
  usageCount!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastResetDate!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.apiTokens)
  @JoinColumn({ name: "userId" })
  user!: User;
}
