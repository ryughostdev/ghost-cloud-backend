/*
  Warnings:

  - You are about to alter the column `sid` on the `session` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `session` MODIFY `sid` VARCHAR(191) NOT NULL,
    MODIFY `data` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'inactive';

-- CreateTable
CREATE TABLE `Temporal_token_pool` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Temporal_token_pool_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Temporal_token_pool` ADD CONSTRAINT `Temporal_token_pool_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
