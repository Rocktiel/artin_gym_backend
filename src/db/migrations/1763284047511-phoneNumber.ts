import { MigrationInterface, QueryRunner } from "typeorm";

export class PhoneNumber1763284047511 implements MigrationInterface {
    name = 'PhoneNumber1763284047511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" ADD "phoneNumber" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "phoneNumber"`);
    }

}
