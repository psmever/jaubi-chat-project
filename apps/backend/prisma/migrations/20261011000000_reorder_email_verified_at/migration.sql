-- AlterTable
ALTER TABLE `users`
MODIFY COLUMN `emailVerifiedAt` DATETIME(3) NULL
AFTER `passwordHash`;
