import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { user } from './user';
import { subscriptions } from './subscriptions';

@Entity()
export class userSubscriptions extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @ManyToOne(() => user)
  @JoinColumn({ name: 'userSubscribing', referencedColumnName: 'id' })
  userSubscribing: user;
  @ManyToOne(() => subscriptions)
  @JoinColumn({ name: 'subscription', referencedColumnName: 'id' })
  subscription: subscriptions;
  @Column({ type: 'boolean', nullable: true, default: false })
  active: boolean;
  @Column({ nullable: false })
  endDate: Date;
  @Column({ nullable: true })
  paymentDate: Date;
  @Column({ type: 'boolean', nullable: true, default: null })
  paid: boolean;
  @Column({ type: 'varchar', nullable: true, default: null })
  paymentTraceId: string;
}
