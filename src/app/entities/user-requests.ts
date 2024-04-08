import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { user } from './user';

@Entity()
export class UserRequests extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @ManyToOne(() => user)
  @JoinColumn({ name: 'userRequesting', referencedColumnName: 'id' })
  userRequesting: user;
  @ManyToOne(() => user)
  @JoinColumn({ name: 'userReceivingRequest', referencedColumnName: 'id' })
  userReceivingRequest: user;
  @Column({ type: 'boolean', nullable: true, default: false })
  accepted: boolean;
  @Column({ nullable: true, default: '' })
  address: string;
  @Column({ type: 'boolean', nullable: true, default: false })
  paid: boolean;
  @Column({ type: 'int', nullable: true, default: 0 })
  price: number;
  @Column({ type: 'varchar', nullable: true, default: '' })
  location: string;
  @Column({ type: 'varchar', nullable: true, default: '' })
  latlong: string;
  @Column({ type: 'boolean', nullable: true, default: true })
  active: boolean;
  @Column({ type: 'boolean', nullable: true, default: false })
  missed: boolean;
  @Column({ type: 'boolean', nullable: true, default: false })
  rejected: boolean;
  @Column({ type: 'boolean', nullable: false, default: false })
  startDate: boolean;
  @Column({ type: 'boolean', nullable: false, default: false })
  completed: boolean;
  @Column({ nullable: true })
  startTime: Date;
  @Column({ nullable: true })
  endTime: Date;
  @Column()
  meetUpDate: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;
}
