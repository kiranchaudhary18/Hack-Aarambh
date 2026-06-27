import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('scam_database')
export class ScamDatabase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  @Index()
  companyName!: string;

  @Column({ type: 'varchar', nullable: true })
  @Index()
  domain?: string;

  @Column({ type: 'varchar' })
  @Index()
  scamType!: string;

  @Column({ type: 'varchar', default: 'medium' })
  severity!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'json', default: '[]' })
  sources!: any[];

  @Column({ type: 'integer', default: 0 })
  reportCount!: number;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ type: 'boolean', default: false })
  isExternal!: boolean;

  @Column({ type: 'varchar', nullable: true })
  externalSource?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
