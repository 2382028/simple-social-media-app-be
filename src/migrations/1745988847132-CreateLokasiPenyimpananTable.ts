import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLokasiPenyimpananTable1745988847132 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Membuat tabel 'locations'
        await queryRunner.query(`
            CREATE TABLE locations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL, -- Foreign Key ke users
                name VARCHAR(255) NOT NULL,
                notes TEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Menambahkan Foreign Key constraint ke tabel 'users'
        await queryRunner.query(`
            ALTER TABLE locations
            ADD CONSTRAINT fk_locations_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        `);

        // Membuat index
        await queryRunner.query(`CREATE INDEX idx_locations_user_id ON locations(user_id);`);

        // SEKARANG: Tambahkan Foreign Key constraint dari tabel 'plants' ke tabel 'locations' yang baru dibuat
        await queryRunner.query(`
            ALTER TABLE plants
            ADD CONSTRAINT fk_plants_location
            FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL;
            -- Jika lokasi dihapus, location_id di plants menjadi NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Hapus constraint dari 'plants' ke 'locations' terlebih dahulu
        // Perlu cek nama constraint jika dibuat otomatis atau berbeda
         await queryRunner.query(`ALTER TABLE plants DROP CONSTRAINT IF EXISTS fk_plants_location;`);

        // Hapus index
        await queryRunner.query(`DROP INDEX IF EXISTS idx_locations_user_id;`);

        // Hapus tabel 'locations' (Constraint fk_locations_user akan ikut terhapus)
        await queryRunner.query(`DROP TABLE IF EXISTS locations;`);
    }
}