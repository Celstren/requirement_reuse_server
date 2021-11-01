import { ApiProperty } from '@nestjs/swagger';
import { classToPlain, Exclude } from 'class-transformer';
import { MarketType } from 'src/market-type/entities/market-type.entity';
import { ProductBacklog } from 'src/product-backlog/entities/product-backlog.entity';
import { ProfileUser } from 'src/profile-user/entities/profile-user.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  Timestamp,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

export enum ProjectVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity('project')
@Unique('project_key', ['projectName'])
export class Project {
  @PrimaryGeneratedColumn({ name: 'project_id' })
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', name: 'project_name', length: 50 })
  @ApiProperty()
  projectName: string;

  @Column({
    type: 'enum',
    name: 'visibility',
    default: ProjectVisibility.PUBLIC,
    enum: ProjectVisibility,
  })
  @ApiProperty({ enum: ProjectVisibility })
  visibility: string;

  @Column({ type: 'int', name: 'profile_user_id' })
  @ApiProperty()
  profileUserId: number;

  @Column({ type: 'int', name: 'market_type_id' })
  @ApiProperty()
  marketTypeId: number;

  @Column({ type: 'varchar', name: 'template_url', nullable: true })
  @ApiProperty()
  templateUrl: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Timestamp;

  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Timestamp;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => ProfileUser, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'profile_user_id', referencedColumnName: 'id' })
  profileUser: ProfileUser;

  @OneToOne(() => MarketType, { eager: true })
  @JoinColumn({ name: 'market_type_id', referencedColumnName: 'id' })
  @ApiProperty({ type: MarketType })
  marketType: MarketType;

  @ManyToMany(() => Tag, { eager: true, cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'project_tag',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  @ApiProperty({ type: Tag, isArray: true })
  tags: Tag[];

  @ManyToMany(() => ProfileUser, { eager: true, cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'project_employee',
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'profile_user_id',
      referencedColumnName: 'id',
    },
  })
  @ApiProperty({ type: ProfileUser, isArray: true })
  employees: ProfileUser[];

  @OneToMany(() => ProductBacklog, (productBacklog) => productBacklog.project, {
    eager: true,
    cascade: true,
  })
  @ApiProperty({ type: () => ProductBacklog, isArray: true })
  productBacklogs: ProductBacklog[];

  toJSON() {
    return classToPlain(this);
  }
}
