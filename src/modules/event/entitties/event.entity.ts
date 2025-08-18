import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  nome: string;

  @Column({ nullable: true })
  local: string;

  @Column('int', { default: 0 })
  pontos: number;

  @Column({ type: 'timestamp' })
  data: Date;

  @Column({ type: 'time', nullable: true })
  hora: string;

  @Column({ nullable: true })
  role: string;

  @ManyToMany(() => Profile)
  @JoinTable()
  pessoas: Profile[];
}
