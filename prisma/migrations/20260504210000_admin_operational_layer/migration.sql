-- Rozszerzenie statusów zamówienia, baza informacji (JSON), zgłoszenia strony weselnej, log powiadomień.

-- AlterTable ClientProfile — pola strukturalne „bazy informacji”
ALTER TABLE `ClientProfile` ADD COLUMN `infoJson` TEXT NULL;

-- Rozszerzenie ENUM Order.status
ALTER TABLE `Order` MODIFY COLUMN `status` ENUM(
    'DRAFT',
    'SUBMITTED',
    'AWAITING_PAYMENT',
    'PENDING_REVIEW',
    'APPROVED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
) NOT NULL DEFAULT 'DRAFT';

-- Rozszerzenie ENUM OrderEvent (fromStatus / toStatus)
ALTER TABLE `OrderEvent` MODIFY COLUMN `fromStatus` ENUM(
    'DRAFT',
    'SUBMITTED',
    'AWAITING_PAYMENT',
    'PENDING_REVIEW',
    'APPROVED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
) NULL;

ALTER TABLE `OrderEvent` MODIFY COLUMN `toStatus` ENUM(
    'DRAFT',
    'SUBMITTED',
    'AWAITING_PAYMENT',
    'PENDING_REVIEW',
    'APPROVED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
) NOT NULL;

-- CreateTable WeddingPageRequest
CREATE TABLE `WeddingPageRequest` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM(
        'NEW',
        'IN_REVIEW',
        'IN_PROGRESS',
        'AWAITING_CLIENT',
        'DONE',
        'CANCELLED'
    ) NOT NULL DEFAULT 'NEW',
    `internalNote` VARCHAR(8000) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `WeddingPageRequest_userId_idx`(`userId`),
    INDEX `WeddingPageRequest_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `WeddingPageRequest` ADD CONSTRAINT `WeddingPageRequest_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable NotificationLog
CREATE TABLE `NotificationLog` (
    `id` VARCHAR(191) NOT NULL,
    `channel` VARCHAR(32) NOT NULL,
    `templateKey` VARCHAR(80) NULL,
    `toEmail` VARCHAR(320) NULL,
    `subject` VARCHAR(500) NULL,
    `bodyPreview` VARCHAR(600) NULL,
    `metaJson` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NotificationLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
