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
export class UserPhotos extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @ManyToOne(() => user)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  user: user;
  @Column({ type: 'varchar', nullable: false })
  image: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;
  @Column({ type: 'integer' })
  order: number;
}
