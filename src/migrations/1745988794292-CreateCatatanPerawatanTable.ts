import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCatatanPerawatanTable1745988794292 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Membuat tabel 'care_logs'
        await queryRunner.query(`
            CREATE TABLE care_logs (
                id SERIAL PRIMARY KEY,
                plant_id INTEGER NOT NULL, -- Foreign Key ke plants
                care_type VARCHAR(100) NOT NULL, -- Misal: 'Penyiraman', 'Pemupukan'
                note TEXT NULL,
                log_date DATE NOT NULL, -- Hanya tanggal
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Menambahkan Foreign Key constraint ke tabel 'plants'
        // Diasumsikan tabel 'plants' sudah dibuat oleh migration sebelumnya
        await queryRunner.query(`
            ALTER TABLE care_logs
            ADD CONSTRAINT fk_care_logs_plant
            FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE;
        `);

        // Membuat index
        await queryRunner.query(`CREATE INDEX idx_care_logs_plant_id ON care_logs(plant_id);`);
        await queryRunner.query(`CREATE INDEX idx_care_logs_log_date ON care_logs(log_date);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Menghapus index
        await queryRunner.query(`DROP INDEX IF EXISTS idx_care_logs_log_date;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_care_logs_plant_id;`);

        // Menghapus tabel
        await queryRunner.query(`DROP TABLE IF EXISTS care_logs;`);
    }
}