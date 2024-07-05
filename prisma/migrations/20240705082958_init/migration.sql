/*
  Warnings:

  - You are about to drop the `_usertoroles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_usertoroles` DROP FOREIGN KEY `_UserToroles_A_fkey`;

-- DropForeignKey
ALTER TABLE `_usertoroles` DROP FOREIGN KEY `_UserToroles_B_fkey`;

-- DropForeignKey
ALTER TABLE `service_instances` DROP FOREIGN KEY `Service_instances_userId_fkey`;

-- DropForeignKey
ALTER TABLE `temporal_token_pool` DROP FOREIGN KEY `Temporal_token_pool_userEmail_fkey`;

-- DropTable
DROP TABLE `_usertoroles`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'inactive',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UsersToroles` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UsersToroles_AB_unique`(`A`, `B`),
    INDEX `_UsersToroles_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Temporal_token_pool` ADD CONSTRAINT `Temporal_token_pool_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `Users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service_instances` ADD CONSTRAINT `Service_instances_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UsersToroles` ADD CONSTRAINT `_UsersToroles_A_fkey` FOREIGN KEY (`A`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UsersToroles` ADD CONSTRAINT `_UsersToroles_B_fkey` FOREIGN KEY (`B`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
