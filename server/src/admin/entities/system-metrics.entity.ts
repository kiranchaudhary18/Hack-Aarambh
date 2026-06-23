import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('system_metrics')
export class SystemMetrics {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index()
  metricType!: string;

  @Column()
  @Index()
  metricName!: string;

  @Column({ type: 'float' })
  value!: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @Column({ type: 'timestamp' })
  @Index()
  timestamp!: Date;
}
