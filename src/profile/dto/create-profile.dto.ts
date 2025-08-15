import { IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  nomeCompleto: string;

  @IsString()
  bio?: string;

  @IsString()
  imagemDoPerfil?: string;

  @IsString()
  empresa?: string;

  @IsString()
  cargo?: string;

  @IsString()
  localizacao?: string;
}
