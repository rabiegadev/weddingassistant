-- Logowanie Google: opcjonalne hasło, powiązanie konta przez `googleSub`.
ALTER TABLE `User` MODIFY `passwordHash` VARCHAR(191) NULL;

ALTER TABLE `User` ADD COLUMN `googleSub` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `User_googleSub_key` ON `User`(`googleSub`);
