import { ApiProperty } from "@nestjs/swagger";
import { MarketType } from "src/market-type/entities/market-type.entity";
import { Requirement } from "src/requirement/entities/requirement.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";

@Entity('boilerplate')
export class Boilerplate {

    @PrimaryGeneratedColumn({ name: 'boilerplate_id' })
    @ApiProperty({ description: 'The id of the boilerplate' })
    id: number;

    @Column({ type: 'varchar', name: 'verb', length: 100 })
    @ApiProperty({ description: 'The verb of boilerplate' })
    verb: string;

    @Column({ type: 'varchar', name: 'phrase_object', length: 100 })
    @ApiProperty({ description: 'The object of boilerplate' })
    object: string;
    
    @Column({ type: 'varchar', name: 'detail', length: 300 })
    @ApiProperty({ description: 'The detail of boilerplate' })
    detail: string;

    @Column({ type: 'int', name: 'requirement_id' })
    @ApiProperty()
    requirementId: number;

    @Column({ type: 'int', name: 'market_type_id' })
    @ApiProperty()
    marketTypeId: number;

    @OneToOne(() => MarketType, { eager: true })
    @JoinColumn({ name: "market_type_id", referencedColumnName: "id" })
    @ApiProperty({ type: MarketType })
    marketType: MarketType;

    @OneToOne(() => Requirement, { eager: true })
    @JoinColumn({ name: "requirement_id", referencedColumnName: "id" })
    @ApiProperty({ type: Requirement })
    requirement: Requirement;

}
