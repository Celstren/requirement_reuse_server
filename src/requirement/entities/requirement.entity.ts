import { ApiProperty } from "@nestjs/swagger";
import { classToPlain, Exclude } from "class-transformer";
import { ProductBacklog } from "src/product-backlog/entities/product-backlog.entity";
import { RequirementPriority } from "src/requirement-priority/entities/requirement-priority.entity";
import { Entity, Unique, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp, JoinColumn, ManyToOne, OneToMany } from "typeorm";

export enum RequirementType {
    FUNCTIONAL = "FUNCTIONAL",
    NOT_FUNCTIONAL = "NOT_FUNCTIONAL"
}

@Entity('requirement')
@Unique('requirement_key', ['productBacklogId','systemDescription','actorDescription','actionDescription'])
export class Requirement {

    @PrimaryGeneratedColumn({ name: 'requirement_id' })
    @ApiProperty()
    id: number;

    @Column({ type: 'varchar', name: 'system_description', length: 50 })
    @ApiProperty()
    systemDescription: string;

    @Column({ type: 'varchar', name: 'actor_description', length: 30 })
    @ApiProperty()
    actorDescription: string;

    @Column({ type: 'varchar', name: 'action_description', length: 500 })
    @ApiProperty()
    actionDescription: string;

    @Column({ type: 'varchar', name: 'clean_action_description', length: 500, default: '' })
    @ApiProperty()
    cleanActionDescription: string;

    @Column({ type: 'varchar', name: 'details_description', length: 500, default: '' })
    @ApiProperty()
    detailsDescription: string;

    @Column({ type: 'enum', name: 'requirement_type', enum: RequirementType })
    @ApiProperty()
    requirementType: string;

    @Column({ type: 'int', name: 'popularity', default: 0 })
    @ApiProperty()
    popularity: number;

    @Column({ type: 'int', name: 'product_backlog_id' })
    @ApiProperty()
    productBacklogId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Timestamp;

    @UpdateDateColumn({ name: 'modified_at' })
    modifiedAt: Timestamp;

    @Exclude({ toPlainOnly: true })
    @ManyToOne(() => ProductBacklog)
    @JoinColumn({ name: "product_backlog_id", referencedColumnName: "id" })
    productBacklog: ProductBacklog;

    @OneToMany(() => RequirementPriority, requirementPriority => requirementPriority.requirement , { eager: true,cascade:true })
    @ApiProperty({ type: RequirementPriority, isArray: true })
    requirementPriorities: RequirementPriority[];

    toJSON() {
        return classToPlain(this);
    }

}