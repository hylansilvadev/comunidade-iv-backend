import { Exclude } from 'class-transformer';
import { Profile } from 'src/profile/entities/profile.entity';
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

  @Exclude()
  @Column({ nullable: false })
  senha: string;

  @OneToOne(() => Profile, { cascade: true, eager: true })
  @JoinColumn()
  userProfile: Profile;
}
