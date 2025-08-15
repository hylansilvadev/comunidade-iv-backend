import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  local: string;

  @Column('int', { default: 0 })
  pontos: number;

  @Column({ type: 'timestamp' })
  data: Date;

  @Column()
  role: string;

  @ManyToMany(() => Profile)
  @JoinTable()
  pessoas: Profile[];
}
