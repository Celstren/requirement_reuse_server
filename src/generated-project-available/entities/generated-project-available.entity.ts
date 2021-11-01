import { ApiProperty } from "@nestjs/swagger";
import { MarketType } from "src/market-type/entities/market-type.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('generated_project_available')
export class GeneratedProjectAvailable {

    @PrimaryGeneratedColumn({ name: 'generated_project_available_id' })
    @ApiProperty({ description: 'The id of the generated project available' })
    id: number;

    @Column({ type: 'varchar', name: 'requirements_url', length: 100 })
    @ApiProperty({ description: 'The url of the requirements generated' })
    requirementsUrl: string;

    @Column({ type: 'int', name: 'market_type_id' })
    @ApiProperty({ description: 'The id of the market type associated with the requirements' })
    marketTypeId: number;

    @OneToOne(() => MarketType, { eager: true })
    @JoinColumn({ name: "market_type_id", referencedColumnName: "id" })
    @ApiProperty({ type: MarketType })
    marketType: MarketType;

}