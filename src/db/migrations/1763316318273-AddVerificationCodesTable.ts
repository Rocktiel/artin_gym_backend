import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerificationCodesTable1763316318273 implements MigrationInterface {
    name = 'AddVerificationCodesTable1763316318273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "verification_codes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "phoneNumber" character varying NOT NULL, "code" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_18741b6b8bf1680dbf5057421d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b25ef0653c022cfbbea4919d4a" ON "verification_codes" ("phoneNumber") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_number" character varying(20) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b25ef0653c022cfbbea4919d4a"`);
        await queryRunner.query(`DROP TABLE "verification_codes"`);
    }

}
