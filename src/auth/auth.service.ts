import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.senha,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return data;
  }

  async signUp(createUserDto: CreateUserDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.signUp({
      email: createUserDto.email,
      password: createUserDto.senha,
      options: {
        data: {
          nome: createUserDto.nome,
        },
      },
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    await this.usersService.create(createUserDto);

    return data;
  }
}
