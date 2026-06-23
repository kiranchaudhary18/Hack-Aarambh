import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, Index } from 'typeorm';

@Entity('system_settings')
export class SystemSettings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  key!: string;

  @Column({ type: 'json' })
  value!: any;

  @Column()
  @Index()
  category!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
