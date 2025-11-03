import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntryEntity1762173699557 implements MigrationInterface {
    name = 'CreateEntryEntity1762173699557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."entries_entry_type_enum" AS ENUM('ENTRY', 'EXIT')`);
        await queryRunner.query(`CREATE TYPE "public"."entries_status_enum" AS ENUM('SUCCESS', 'FAIL_EXPIRED', 'FAIL_INVALID', 'FAIL_NO_ACCESS')`);
        await queryRunner.query(`CREATE TABLE "entries" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "tenant_id" integer NOT NULL, "member_id" integer NOT NULL, "door_id" uuid NOT NULL, "timestamp_utc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "entry_type" "public"."entries_entry_type_enum" NOT NULL, "status" "public"."entries_status_enum" NOT NULL DEFAULT 'SUCCESS', "failure_reason" character varying, "scanned_data" character varying, CONSTRAINT "PK_23d4e7e9b58d9939f113832915b" PRIMARY KEY ("id")); COMMENT ON COLUMN "entries"."entry_type" IS 'Giriş (ENTRY) veya Çıkış (EXIT) olayı mı?'; COMMENT ON COLUMN "entries"."status" IS 'Erişim sonucu (Başarılı, Süresi Dolmuş, Yetkisiz vb.)'`);
        await queryRunner.query(`CREATE INDEX "IDX_5445130a3fac8146bb7cea3d44" ON "entries" ("tenant_id", "timestamp_utc") `);
        await queryRunner.query(`ALTER TABLE "entries" ADD CONSTRAINT "FK_834b12e8b61247b872e8d7131bc" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entries" ADD CONSTRAINT "FK_d4db54f4183d1233a799e1d46cc" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entries" DROP CONSTRAINT "FK_d4db54f4183d1233a799e1d46cc"`);
        await queryRunner.query(`ALTER TABLE "entries" DROP CONSTRAINT "FK_834b12e8b61247b872e8d7131bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5445130a3fac8146bb7cea3d44"`);
        await queryRunner.query(`DROP TABLE "entries"`);
        await queryRunner.query(`DROP TYPE "public"."entries_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."entries_entry_type_enum"`);
    }

}
