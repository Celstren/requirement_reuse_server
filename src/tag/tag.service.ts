import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {

  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(tags: Tag[]): Promise<Tag[]>  {
    return this.tagRepository.save(tags);
  }

  findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

}
