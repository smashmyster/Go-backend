import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserPhotos } from './user-photos';

@Entity()
export class user extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ nullable: true })
  name: string;
  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ type: 'varchar', nullable: true })
  password: string;
  @Column({ unique: true, select: true })
  phoneNumber: string;
  @Column({ nullable: true })
  expoPushNotificationToken: string;
  @Column({ type: 'varchar', nullable: true })
  loginToken: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;
  @Column({ type: 'timestamp', default: () => null, nullable: true })
  updatedOn: Date;
  @Column({ nullable: true })
  DOB: Date;
  @Column({ nullable: true })
  walletBalance: number;
  @Column({ nullable: true })
  fee: number;
  @Column({ type: 'varchar', nullable: true, default: '' })
  coverImage: string;
  @Column({ type: 'boolean', nullable: true, default: false })
  private: boolean;
  @Column({ type: 'boolean', nullable: true, default: false })
  verified: boolean;
  @Column({ type: 'boolean', nullable: true, default: false })
  active: boolean;
  @Column({ type: 'boolean', nullable: true, default: false })
  online: boolean;
  @Column({ type: 'boolean', nullable: true, default: false })
  disabled: boolean;
  @Column({ type: 'boolean', nullable: true, default: false })
  approved: boolean;
  @Column({ type: 'varchar', nullable: true, default: '' })
  location: string;
  @Column({ type: 'varchar', nullable: true, default: '' })
  latlong: string;
  @Column({ type: 'varchar', nullable: true, default: null })
  otp: string;
  @Column({ type: 'float', nullable: true, default: 0 })
  numberOfRequests: number;
  @Column({ type: 'float', nullable: true, default: 0 })
  requestsAccepted: number;
  @OneToMany(() => UserPhotos, (photo) => photo.user)
  photos: UserPhotos[];
}
