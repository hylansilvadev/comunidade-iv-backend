import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SupabaseService } from 'src/core/supabase/supabase.service';

@Injectable()
export class ProfileService {
  private readonly supabaseBucket: string;

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {
    this.supabaseBucket = this.configService.get<string>(
      'SUPABASE_BUCKET_NAME',
    );
  }

  create(createProfileDto: CreateProfileDto): Promise<Profile> {
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
    const profile = await this.findOne(id);
    await this.profileRepository.remove(profile);
  }

  async uploadProfileImage(
    profileId: string,
    file: Express.Multer.File,
  ): Promise<Profile> {
    const profile = await this.findOne(profileId);
    const supabase = this.supabaseService.getClient();

    if (profile.imagemDoPerfil) {
      try {
        const oldImageKey = profile.imagemDoPerfil.split(
          `${this.supabaseBucket}/`,
        )[1];
        if (oldImageKey) {
          await supabase.storage
            .from(this.supabaseBucket)
            .remove([oldImageKey]);
        }
      } catch (error) {
        console.error(
          'Falha ao remover a imagem antiga (pode ser a primeira imagem):',
          error.message,
        );
      }
    }

    const fileExtension = path.extname(file.originalname);
    const newFileName = `users-images/${randomUUID()}${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(this.supabaseBucket)
      .upload(newFileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error('ERRO DO SUPABASE AO FAZER UPLOAD:', uploadError);
      throw new InternalServerErrorException('Erro ao fazer upload da imagem.');
    }

    const { data } = supabase.storage
      .from(this.supabaseBucket)
      .getPublicUrl(newFileName);

    profile.imagemDoPerfil = data.publicUrl;
    return this.profileRepository.save(profile);
  }
}
