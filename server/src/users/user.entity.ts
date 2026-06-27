import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ApiToken } from "../tokens/api-token.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "user" })
  role!: string;

  @Column({ nullable: true, type: "varchar" })
  name!: string | null;

  @Column({ nullable: true, type: "varchar" })
  avatar!: string | null;

  @Column({ default: 0 })
  scansUsed!: number;

  @Column({ default: 20 })
  scansLimit!: number;

  @Column({ default: "free" })
  plan!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ nullable: true, type: "varchar" })
  twoFactorSecret!: string | null;

  @Column({ default: false })
  twoFactorEnabled!: boolean;

  @Column({ type: "json", nullable: true, default: [] })
  twoFactorBackupCodes!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ApiToken, (apiToken) => apiToken.user)
  apiTokens!: ApiToken[];
}
