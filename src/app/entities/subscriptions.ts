import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class subscriptions extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  name: string;
  @Column({ type: 'float', nullable: false, default: 0 })
  amount: number;
  @Column({ type: 'float', nullable: false, default: 0 })
  duration: number;
}
