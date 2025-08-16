import { IsUUID } from 'class-validator';

export class RegisterToEventDto {
  @IsUUID()
  profileId: string;
}
