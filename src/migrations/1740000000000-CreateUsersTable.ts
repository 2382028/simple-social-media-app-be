import { MigrationInterface, QueryRunner } from "typeorm";

// <<< PASTIKAN NAMA CLASS INI SESUAI DENGAN NAMA FILE (TERMASUK TIMESTAMP) >>>
export class CreateUsersTable1740000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Membuat tabel 'users' sesuai dengan User Entity kamu
        await queryRunner.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                profile_picture VARCHAR(255) NULL,
                bio TEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Membuat index
        await queryRunner.query(`CREATE INDEX idx_users_email ON users(email);`);
        await queryRunner.query(`CREATE INDEX idx_users_username ON users(username);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Hapus index dulu
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_username;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_email;`);

        // Hapus tabel
        await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    }
}