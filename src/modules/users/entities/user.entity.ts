import { Profile } from 'src/modules/profile/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100, nullable: false })
  email: string;

  @OneToOne(() => Profile, { cascade: true, eager: true })
  @JoinColumn()
  userProfile: Profile;
}
