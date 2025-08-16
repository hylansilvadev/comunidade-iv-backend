import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { SupabaseModule } from 'src/core/supabase/supabase.module';

@Module({
  imports: [UsersModule, SupabaseModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
