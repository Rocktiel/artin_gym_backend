import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePackageEntity1762176849710 implements MigrationInterface {
    name = 'CreatePackageEntity1762176849710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."packages_duration_type_enum" AS ENUM('DAY', 'WEEK', 'MONTH', 'YEAR')`);
        await queryRunner.query(`CREATE TYPE "public"."packages_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "packages" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "tenant_id" integer NOT NULL, "package_name" character varying(150) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "duration_value" integer NOT NULL, "duration_type" "public"."packages_duration_type_enum" NOT NULL DEFAULT 'MONTH', "status" "public"."packages_status_enum" NOT NULL DEFAULT 'ACTIVE', "is_unlimited_access" boolean NOT NULL DEFAULT true, "can_be_frozen" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0cd77b1c7e72b50a342b559fc9" ON "packages" ("tenant_id", "status", "package_name") `);
        await queryRunner.query(`ALTER TABLE "entries" DROP COLUMN "scanned_data"`);
        await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "package_id"`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD "package_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "start_at"`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD "start_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "end_at"`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD "end_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "packages" ADD CONSTRAINT "FK_b527f80be64a1e62e97e696d666" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD CONSTRAINT "FK_1a92119208bcec10dce05559ad4" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "FK_1a92119208bcec10dce05559ad4"`);
        await queryRunner.query(`ALTER TABLE "packages" DROP CONSTRAINT "FK_b527f80be64a1e62e97e696d666"`);
        await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "end_at"`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD "end_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "start_at"`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD "start_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "package_id"`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD "package_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entries" ADD "scanned_data" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0cd77b1c7e72b50a342b559fc9"`);
        await queryRunner.query(`DROP TABLE "packages"`);
        await queryRunner.query(`DROP TYPE "public"."packages_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."packages_duration_type_enum"`);
    }

}
