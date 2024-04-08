import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { user } from './user';

@Entity()
export class messagesChat extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @ManyToOne(() => user)
  @JoinColumn({ name: 'firstUser', referencedColumnName: 'id' })
  firstUser: user;
  @ManyToOne(() => user)
  @JoinColumn({ name: 'secondUser', referencedColumnName: 'id' })
  secondUser: user;
  @CreateDateColumn()
  createdOn: Date;
  @UpdateDateColumn()
  lastUpdated: Date;
}
