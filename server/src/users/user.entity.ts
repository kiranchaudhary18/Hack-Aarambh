import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiToken } from "../tokens/api-token.entity";
import { Role } from "../admin/entities/role.entity";

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

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: "roleId" })
  roleEntity?: Role;

  @Column({ nullable: true, type: "uuid" })
  roleId?: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  avatar!: string;

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
