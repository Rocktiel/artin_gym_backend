import { MigrationInterface, QueryRunner } from "typeorm";

export class UsernameUpdate1763134681936 implements MigrationInterface {
    name = 'UsernameUpdate1763134681936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "email" TO "username"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" TO "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" TO "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "username" TO "email"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
    }

}
