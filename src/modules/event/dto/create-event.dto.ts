import { IsString, IsNotEmpty, IsInt, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  local: string;

  @IsInt()
  pontos: number;

  @IsDateString()
  data: Date;

  @IsString()
  role: string;
}
