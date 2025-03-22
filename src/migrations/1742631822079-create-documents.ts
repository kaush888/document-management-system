import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocuments1742631822079 implements MigrationInterface {
  name = 'CreateDocuments1742631822079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "fileName" character varying NOT NULL, "filePath" character varying NOT NULL, "fileSize" integer NOT NULL, "mimeType" character varying NOT NULL, "ownerId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_4106f2a9b30c9ff2f717894a970" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_4106f2a9b30c9ff2f717894a970"`,
    );
    await queryRunner.query(`DROP TABLE "documents"`);
  }
}
