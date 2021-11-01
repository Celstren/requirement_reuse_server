import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/project/entities/project.entity';
import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from 'typeorm';

@Entity('market_type')
@Unique('market_type_key', ['marketTypeName'])
export class MarketType {
  @PrimaryGeneratedColumn({ name: 'market_type_id' })
  @ApiProperty({ description: 'The id of the market type' })
  id: number;


  @OneToOne(() => Project, (p) => p.marketType, {
    cascade: true,
  })
  @ApiProperty({ type: () => Project })
  project: Project;
    @Column({ type: 'varchar', name: 'market_type_name', length: 100 })
    @ApiProperty({ description: 'The name of the market type' })
    marketTypeName: string;
    
}
