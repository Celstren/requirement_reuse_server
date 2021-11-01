import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoilerplateDto } from './dto/create-boilerplate.dto';
import { UpdateBoilerplateDto } from './dto/update-boilerplate.dto';
import { Boilerplate } from './entities/boilerplate.entity';

@Injectable()
export class BoilerplateService {

  constructor(
    @InjectRepository(Boilerplate)
    private boilerplateRepository: Repository<Boilerplate>,
  ) {}

  create(createBoilerplateDto: CreateBoilerplateDto) {
    return this.boilerplateRepository.save(createBoilerplateDto);
  }

  findAll() {
    return this.boilerplateRepository.find();
  }

  findByMarketType(marketTypeId: number) {
    return this.boilerplateRepository.find({
      marketTypeId: marketTypeId
    });
  }

  async autogenerate(createBoilerplateDto: CreateBoilerplateDto[], marketTypeId: number) {
    await this.deleteByMarketType(marketTypeId);
    return this.boilerplateRepository.save(createBoilerplateDto);
  }

  deleteByMarketType(marketTypeId: number) {
    return this.boilerplateRepository.delete({
      marketTypeId: marketTypeId
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} boilerplate`;
  }

  update(id: number, updateBoilerplateDto: UpdateBoilerplateDto) {
    return `This action updates a #${id} boilerplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} boilerplate`;
  }
}
