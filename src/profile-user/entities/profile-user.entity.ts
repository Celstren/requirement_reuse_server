import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { classToPlain, Exclude } from 'class-transformer';
import { CustomMessages } from 'src/exception/custom-messages';
import { Project } from 'src/project/entities/project.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export enum AccountStatus {
  CREATED = 'CREATED',
  VERIFIED = 'VERIFIED',
}

@Entity('profile_user')
@Unique('profile_user_key', ['email'])
export class ProfileUser {
  @PrimaryGeneratedColumn({ name: 'profile_user_id' })
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', name: 'first_name', length: 50 })
  @ApiProperty()
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name', length: 50 })
  @ApiProperty()
  lastName: string;

  @Column({ type: 'varchar', name: 'email', length: 100 })
  @ApiProperty()
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', name: 'user_password', length: 100 })
  @ApiProperty()
  password: string;

  @Column({ type: 'text', name: 'primary_address', nullable: true })
  @ApiProperty({ default: '' })
  primaryAddress: string;

  @Column({ type: 'text', name: 'secundary_address', nullable: true })
  @ApiProperty({ default: '' })
  secundaryAddress: string;

  @Column({
    type: 'varchar',
    name: 'location_code',
    length: 20,
    default: 'es-pe',
  })
  @ApiProperty({ default: 'es-pe' })
  locationCode: string;

  @Column({
    type: 'varchar',
    name: 'location_description',
    length: 20,
    default: 'Spanish (Peru)',
  })
  @ApiProperty({ default: 'Spanish (Peru)' })
  locationDescription: string;

  @Column({ type: 'boolean', name: 'suscribed', default: false })
  @ApiProperty()
  suscribed: boolean;

  @Exclude({ toPlainOnly: true })
  @ManyToMany(() => Project)
  @JoinTable({
    name: 'project_favorite',
    joinColumn: {
      name: 'profile_user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
  })
  @ApiProperty({ type: () => Project, isArray: true })
  favoriteProjects: Project[];

  @Column({ type: 'text', name: 'refresh_token', nullable: true })
  @ApiProperty({ default: ""})
  refreshToken: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'enum', name: 'account_status', default: AccountStatus.VERIFIED, enum: AccountStatus })
  accountStatus: AccountStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Timestamp;

  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Timestamp;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'boolean', name: 'test_user', default: false })
  @ApiProperty()
  testUser: boolean;

  toJSON() {
    return classToPlain(this);
  }
}