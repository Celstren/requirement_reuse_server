import { ApiProperty } from "@nestjs/swagger";
import { classToPlain, Exclude } from "class-transformer";
import { ProfileUser } from "src/profile-user/entities/profile-user.entity";
import { Requirement } from "src/requirement/entities/requirement.entity";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Timestamp, ManyToOne, Entity, Unique } from "typeorm";

@Entity('requirement_priority')
@Unique('requirement_key', ['profileUserId','requirementId','priorityValue','priorityType'])
export class RequirementPriority {

    @PrimaryGeneratedColumn({ name: 'requirement_priority_id' })
    @ApiProperty()
    id: number;

    @Column({ type: 'varchar', name: 'priority_value', length: 50 })
    @ApiProperty()
    priorityValue: string;

    @Column({ type: 'varchar', name: 'priority_type', length: 30 })
    @ApiProperty()
    priorityType: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Timestamp;

    @UpdateDateColumn({ name: 'modified_at' })
    modifiedAt: Timestamp;

    @Column({ type: 'int', name: 'profile_user_id' })
    @ApiProperty()
    profileUserId: number;

    @Column({ type: 'int', name: 'requirement_id' })
    @ApiProperty()
    requirementId: number;

    @OneToOne(() => ProfileUser, { eager: true })
    @JoinColumn({ name: "profile_user_id", referencedColumnName: "id" })
    @ApiProperty()
    profileUser: ProfileUser;

    @Exclude({ toPlainOnly: true })
    @ManyToOne(() => Requirement)
    @JoinColumn({ name: "requirement_id", referencedColumnName: "id" })
    requirement: Requirement;

    toJSON() {
        return classToPlain(this);
    }

}