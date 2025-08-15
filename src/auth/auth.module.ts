import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [UsersModule, SupabaseModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
