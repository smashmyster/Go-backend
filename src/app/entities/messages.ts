import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { user } from './user';
import { messageTypes } from './message-type';
import { messagesChat } from './message-chat';

@Entity()
export class messages extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @ManyToOne(() => user)
  @JoinColumn({ name: 'sender', referencedColumnName: 'id' })
  sender: user;
  @ManyToOne(() => user)
  @JoinColumn({ name: 'receiver', referencedColumnName: 'id' })
  receiver: user;
  @ManyToOne(() => messageTypes)
  @JoinColumn({ name: 'messageType', referencedColumnName: 'id' })
  messageType: messageTypes;

  @ManyToOne(() => messagesChat)
  @JoinColumn({ name: 'chatLink', referencedColumnName: 'id' })
  chatLink: messagesChat;

  @Column({ type: 'boolean', nullable: true, default: false })
  read: boolean;
  @CreateDateColumn()
  createdOn: Date;
  @Column({ type: 'timestamp', default: () => null, nullable: true })
  readAt: Date;
  @Column({ type: 'varchar', default: '', nullable: false })
  message: string;
}
