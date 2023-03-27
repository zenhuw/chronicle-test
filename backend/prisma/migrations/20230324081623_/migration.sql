-- AlterTable
ALTER TABLE `User` ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `deleted_by_id` VARCHAR(191) NULL,
    MODIFY `last_name` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL;
