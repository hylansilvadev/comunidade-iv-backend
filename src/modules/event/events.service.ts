import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entitties/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RegisterToEventDto } from './dto/register-to-event.dto';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async create(dto: CreateEventDto) {
    const event = this.eventsRepository.create(dto);
    return this.eventsRepository.save(event);
  }

  findAll() {
    return this.eventsRepository.find({ relations: ['pessoas'] });
  }

  async findOne(id: string) {
    const event = await this.eventsRepository.findOne({ where: { id }, relations: ['pessoas'] });
    if (!event) throw new NotFoundException('Evento não encontrado');
    return event;
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.findOne(id);
    Object.assign(event, dto);
    return this.eventsRepository.save(event);
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    return this.eventsRepository.remove(event);
  }

  async registerToEvent(eventId: string, dto: RegisterToEventDto) {
    const event = await this.findOne(eventId);
    const profile = await this.profilesRepository.findOne({ where: { id: dto.profileId } });

    if (!profile) throw new NotFoundException('Perfil não encontrado');

    if (!event.pessoas) event.pessoas = [];
    if (event.pessoas.some(p => p.id === profile.id)) {
      return event;
    }

    event.pessoas.push(profile);
    return this.eventsRepository.save(event);
  }
}
