import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  topic!: string;

  @Column({ nullable: true })
  key?: string | null;

  @Column({ type: 'jsonb' })
  value!: Record<string, unknown>;

  @Column({ type: 'int', nullable: true })
  partition?: number | null;

  @Column({ type: 'varchar', nullable: true })
  offset?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  messageTimestamp?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
