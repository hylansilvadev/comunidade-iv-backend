import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  nomeCompleto: string;

  @Column({ length: 255, nullable: true })
  bio: string;

  @Column({ nullable: true })
  imagemDoPerfil: string;

  @Column({ nullable: true })
  empresa: string;

  @Column({ nullable: true })
  cargo: string;

  @Column({ nullable: true })
  localizacao: string;

  @OneToOne(() => User, (user) => user.userProfile)
  user: User;
}
