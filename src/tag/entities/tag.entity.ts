import { ApiProperty } from "@nestjs/swagger";
import { classToPlain } from "class-transformer";
import { Entity, Unique, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('tag')
@Unique('tag_key', ['tagDescription'])
export class Tag {

    @PrimaryGeneratedColumn({ name: 'tag_id' })
    @ApiProperty()
    id: number;

    @Column({ type: 'varchar', name: 'tag_description', length: 50 })
    @ApiProperty()
    tagDescription: string = '';

    toJSON() {
        return classToPlain(this);
    }
    
}