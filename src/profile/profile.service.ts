import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly supabaseService: SupabaseService,
  ) {}

  create(createProfileDto: CreateProfileDto) {
    const newProfile = this.profileRepository.create(createProfileDto);
    return this.profileRepository.save(newProfile);
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOneBy({ id });
    if (!profile) {
      throw new NotFoundException(`Perfil com ID "${id}" não encontrado.`);
    }
    return profile;
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const existingProfile = await this.profileRepository.findOneBy({ id });
    if (!existingProfile) {
      throw new NotFoundException(`Perfil com ID "${id}" não encontrado.`);
    }

    const profile = await this.profileRepository.preload({
      id,
      ...updateProfileDto,
    });

    if (!profile) {
      throw new NotFoundException(`Perfil com ID "${id}" não encontrado.`);
    }
    return this.profileRepository.save(profile);
  }

  async remove(id: string): Promise<void> {
    const existingProfile = await this.profileRepository.findOneBy({ id });
    if (!existingProfile) {
      throw new NotFoundException(`Perfil com ID "${id}" não encontrado.`);
    }

    await this.profileRepository.remove(existingProfile);
  }

  async uploadProfileImage(
    profileId: string,
    file: Express.Multer.File,
  ): Promise<Profile> {
    const profile = await this.findOne(profileId);
    const supabase = this.supabaseService.getClient();
    const filePath = `profile-images/${profileId}-${file.originalname}`;

    const { error } = await supabase.storage
      .from('profile-pictures') // Substitua pelo nome do seu bucket
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error('Erro ao fazer upload da imagem.');
    }

    const { data } = supabase.storage
      .from('profile-pictures') // Substitua pelo nome do seu bucket
      .getPublicUrl(filePath);

    profile.imagemDoPerfil = data.publicUrl;
    return this.profileRepository.save(profile);
  }
}
