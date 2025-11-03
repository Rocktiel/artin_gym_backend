import { MigrationInterface, QueryRunner } from "typeorm";

export class MemberEntityAddPhysicalData1762167156531 implements MigrationInterface {
    name = 'MemberEntityAddPhysicalData1762167156531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" ADD "physical_data" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "physical_data"`);
    }

}
