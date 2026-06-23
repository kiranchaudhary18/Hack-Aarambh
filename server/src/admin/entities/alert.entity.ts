import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column({ type: 'float' })
  threshold!: number;

  @Column()
  condition!: string;

  @Column({ default: true })
  enabled!: boolean;

  @Column({ type: 'json', default: '[]' })
  channels!: string[];

  @Column({ type: 'timestamp', nullable: true })
  lastTriggered?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
