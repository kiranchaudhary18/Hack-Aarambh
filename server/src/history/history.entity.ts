import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class History {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text")
  input!: string;

  @Column("simple-json", { nullable: true })
  result: any;

  @Column({ nullable: true })
  userId!: string;

  @Column({ default: "pending" })
  status!: "pending" | "processed" | "failed";

  @Column({ nullable: true })
  processedAt!: Date;

  @Column({ nullable: true })
  pdfUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
