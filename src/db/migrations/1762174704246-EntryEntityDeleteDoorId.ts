import { MigrationInterface, QueryRunner } from "typeorm";

export class EntryEntityDeleteDoorId1762174704246 implements MigrationInterface {
    name = 'EntryEntityDeleteDoorId1762174704246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entries" DROP COLUMN "door_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entries" ADD "door_id" uuid NOT NULL`);
    }

}
