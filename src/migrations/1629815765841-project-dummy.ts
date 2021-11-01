import { MarketType } from "src/market-type/entities/market-type.entity";
import { ProfileUser } from "src/profile-user/entities/profile-user.entity";
import { Project } from "src/project/entities/project.entity";
import {createQueryBuilder, getRepository, MigrationInterface, QueryRunner} from "typeorm";
import { marketTypeSeed, projectDummySeed, userDummySeed } from "./seeds/project-dummy.seed";

export class projectDummy1629815765841 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("---Executing migrations---")
        const [user] = await getRepository(ProfileUser)
        .save(userDummySeed)
        await getRepository(MarketType)
        .save(marketTypeSeed({profileUserId:user.id}))
        console.log("---Migrations Finished---")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("---Revert migrations---")
        const user = await getRepository(ProfileUser).findOneOrFail({
            where:{
                email:userDummySeed[0]?.email
            }
        })
        await createQueryBuilder(MarketType,"m")
        .delete()
        .where("m.market_type_name IN (:...projects)",{projects:marketTypeSeed({profileUserId:user.id}).map(x=>x.marketTypeName)})
        .execute()
        await Promise.all([
            getRepository(ProfileUser).delete(user.id)
        ])
        console.log("---Revert migrations finished---")
    }

}
