import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateKoleksiTanamanTable1745988590200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Membuat tabel 'plants'
        await queryRunner.query(`
            CREATE TABLE plants (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL, -- Foreign Key ke users
                location_id INTEGER NULL, -- Foreign Key ke locations, boleh NULL
                name VARCHAR(255) NOT NULL,
                species VARCHAR(255) NULL,
                notes TEXT NULL,
                photo_url VARCHAR(255) NULL,
                date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Menambahkan Foreign Key constraint ke tabel 'users'
        // Diasumsikan tabel 'users' sudah ada
        await queryRunner.query(`
            ALTER TABLE plants
            ADD CONSTRAINT fk_plants_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        `);
        // Constraint ke 'locations' akan ditambahkan setelah tabel 'locations' dibuat

        // Membuat index untuk performa
        await queryRunner.query(`CREATE INDEX idx_plants_user_id ON plants(user_id);`);
        await queryRunner.query(`CREATE INDEX idx_plants_location_id ON plants(location_id);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Menghapus index
        await queryRunner.query(`DROP INDEX IF EXISTS idx_plants_location_id;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_plants_user_id;`);

        // Menghapus tabel (Foreign key constraints biasanya otomatis terhapus,
        // tapi bisa juga dihapus manual ALTER TABLE plants DROP CONSTRAINT fk_plants_user;)
        await queryRunner.query(`DROP TABLE IF EXISTS plants;`);
    }
}