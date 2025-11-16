import { MigrationInterface, QueryRunner } from "typeorm";

export class IsInsideUpdate1763242166548 implements MigrationInterface {
    name = 'IsInsideUpdate1763242166548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5445130a3fac8146bb7cea3d44"`);
        await queryRunner.query(`ALTER TABLE "members" ADD "is_inside" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "entries"."entry_type" IS 'Giriş (ENTRY) veya Çıkış (EXIT)'`);
        await queryRunner.query(`CREATE INDEX "IDX_2d5544d12f3dfdd6c3d66288a4" ON "entries" ("status", "entry_type", "timestamp_utc") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2d5544d12f3dfdd6c3d66288a4"`);
        await queryRunner.query(`COMMENT ON COLUMN "entries"."entry_type" IS 'Giriş (ENTRY) veya Çıkış (EXIT) olayı mı?'`);
        await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "is_inside"`);
        await queryRunner.query(`CREATE INDEX "IDX_5445130a3fac8146bb7cea3d44" ON "entries" ("tenant_id", "timestamp_utc") `);
    }

}
