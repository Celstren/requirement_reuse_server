import { ApiProperty } from "@nestjs/swagger";
import { classToPlain, Exclude } from "class-transformer";
import { Project } from "src/project/entities/project.entity";
import { Requirement } from "src/requirement/entities/requirement.entity";
import { Entity, Unique, PrimaryGeneratedColumn, Column, CreateDateColumn, Timestamp, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity('product_backlog')
@Unique('product_backlog_key', ['projectId','productBacklogName'])
export class ProductBacklog {

    @PrimaryGeneratedColumn({ name: 'product_backlog_id' })
    @ApiProperty()
    id: number;

    @Column({ type: 'varchar', name: 'product_backlog_name', length: 100 })
    @ApiProperty()
    productBacklogName: string;

    @Column({ type: 'int', name: 'project_id' })
    @ApiProperty()
    projectId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Timestamp;

    @UpdateDateColumn({ name: 'modified_at' })
    modifiedAt: Timestamp;

    @Exclude({ toPlainOnly: true })
    @ManyToOne(() => Project)
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    @ApiProperty({ type: ()=>Project })
    project: Project;

    @ApiProperty({ type: Requirement, isArray: true })
    @OneToMany(() => Requirement, requirement => requirement.productBacklog , { eager: true,cascade:true })
    requirements: Requirement[];

    toJSON() {
        return classToPlain(this);
    }

}