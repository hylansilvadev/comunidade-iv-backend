import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entitties/event.entity';
import { Profile } from '../profile/entities/profile.entity';
import { SupabaseModule } from '../../core/supabase/supabase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Profile]),SupabaseModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
