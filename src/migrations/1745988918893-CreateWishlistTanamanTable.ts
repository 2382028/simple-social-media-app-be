import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWishlistTanamanTable1745988918893 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Membuat tabel 'wishlist_items'
        await queryRunner.query(`
            CREATE TABLE wishlist_items (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL, -- Foreign Key ke users
                plant_name VARCHAR(255) NOT NULL,
                notes TEXT NULL,
                source_idea VARCHAR(255) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Menambahkan Foreign Key constraint ke tabel 'users'
        await queryRunner.query(`
            ALTER TABLE wishlist_items
            ADD CONSTRAINT fk_wishlist_items_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        `);

        // Membuat index
        await queryRunner.query(`CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Menghapus index
        await queryRunner.query(`DROP INDEX IF EXISTS idx_wishlist_items_user_id;`);

        // Menghapus tabel
        await queryRunner.query(`DROP TABLE IF EXISTS wishlist_items;`);
    }
}