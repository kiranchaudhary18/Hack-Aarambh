import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('extension_metrics')
export class ExtensionMetrics {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  @Index()
  metricType!: string;

  @Column({ type: 'varchar' })
  metricName!: string;

  @Column({ type: 'float' })
  value!: number;

  @Column({ type: 'varchar', nullable: true })
  unit?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  timestamp!: Date;
}
