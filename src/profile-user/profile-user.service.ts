import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomMessages } from 'src/exception/custom-messages';
import { Project } from 'src/project/entities/project.entity';
import { ProjectService } from 'src/project/project.service';
import { ArrayValidator } from 'src/utils/validators/array.validator';
import { CommonValidator } from 'src/utils/validators/common.validator';
import { QueryValidator } from 'src/utils/validators/query.validator';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateProfileUserDto } from './dto/create-profile-user.dto';
import { UpdateProfileUserDto } from './dto/update-profile-user.dto';
import { ProfileUser } from './entities/profile-user.entity';

@Injectable()
export class ProfileUserService {

  constructor(
    @InjectRepository(ProfileUser)
    private profileUsersRepository: Repository<ProfileUser>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {}

  async create(createProfileUserDto: CreateProfileUserDto): Promise<ProfileUser> {
    return this.profileUsersRepository.save(createProfileUserDto);
  }

  async validateSuscription(profileUserId: number): Promise<boolean> {
    let user = await this.findOne(profileUserId);
    return user?.suscribed ?? false;
  }

  async validateProjects(profileUserId: number): Promise<boolean> {
    let projects = await this.projectService.findByProfileUserId(profileUserId);
    return ArrayValidator.isNotEmpty(projects);
  }

  async createEmployees(profileUsers: CreateEmployeeDto[]): Promise<ProfileUser[]> {
    return this.profileUsersRepository.save(profileUsers);
  }

  async findAll(): Promise<ProfileUser[]> {
    let profileUsers = await this.profileUsersRepository.find();
    return profileUsers;
  }

  async findOne(id: number): Promise<ProfileUser> {
    let user = await this.profileUsersRepository.findOne(id);
    return CommonValidator.validateObjectFound<ProfileUser>(user, CustomMessages.PROFILE_USER_NOT_FOUND + ': ' + id?.toString());
  }

  async findByEmail(email: string): Promise<ProfileUser> {
    const user =  await this.profileUsersRepository.findOne({
      where: {
        email: email,
      }
    });
    return CommonValidator.validateObjectFound<ProfileUser>(user, CustomMessages.PROFILE_USER_NOT_FOUND + ': ' + email);
  }

  async addFavoriteProject(id: number, projectId: number): Promise<void> {
    let project = CommonValidator.validateObjectFound<Project>(await this.projectService.findOne(projectId), CustomMessages.PROJECT_NOT_FOUND);
    let user = await this.findOne(id);
    await this.profileUsersRepository
        .createQueryBuilder()
        .relation(ProfileUser, 'favoriteProjects')
        .of(user)
        .add(project);
  }

  async removeFavoriteProject(id: number, projectId: number): Promise<void>  {
    let project = CommonValidator.validateObjectFound<Project>(await this.projectService.findOne(projectId), CustomMessages.PROJECT_NOT_FOUND)
    let user = await this.findOne(id);
    await this.profileUsersRepository
        .createQueryBuilder()
        .relation(ProfileUser, 'favoriteProjects')
        .of(user)
        .remove(project);
  }

  async findFavoriteProjects(id: number): Promise<Project[]> {
    let user = await this.profileUsersRepository.findOne(id, { 
      relations: ['favoriteProjects']
    });
    return user?.favoriteProjects ?? [];
  }

  async update(id: number, updateProfileUserDto: UpdateProfileUserDto): Promise<void> {
    CommonValidator.validateNotNull(id);
    CommonValidator.validateNotNull(updateProfileUserDto);
    let updateResponse = await this.profileUsersRepository.update(id, updateProfileUserDto);
    QueryValidator.validateUpdatedRaws(updateResponse, CustomMessages.PROFILE_USER_NOT_FOUND);
  }

  async remove(id: number): Promise<void> {
    let deleteResponse = await this.profileUsersRepository.delete(id);
    QueryValidator.validateDeletedRaws(deleteResponse, CustomMessages.PROFILE_USER_NOT_FOUND);
  }
}
