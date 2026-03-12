CREATE TABLE `activity_logs` (
	`id` varchar(36) NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50),
	`entityId` varchar(36),
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` varchar(36) NOT NULL,
	`listingId` varchar(36),
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(255),
	`customerPhone` varchar(50) NOT NULL,
	`customerWhatsapp` varchar(50),
	`message` text,
	`preferredViewingDate` timestamp,
	`status` enum('new','contacted','viewing_scheduled','negotiating','closed_won','closed_lost') NOT NULL DEFAULT 'new',
	`assignedTo` int,
	`source` varchar(50) DEFAULT 'website',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listing_status_history` (
	`id` varchar(36) NOT NULL,
	`listingId` varchar(36) NOT NULL,
	`oldStatus` varchar(20),
	`newStatus` varchar(20) NOT NULL,
	`changedBy` int,
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	`reason` text,
	CONSTRAINT `listing_status_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` varchar(36) NOT NULL,
	`sku` varchar(50) NOT NULL,
	`category` enum('vehicle','real_estate','land','commercial') NOT NULL,
	`subcategory` varchar(50),
	`title` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(15,2),
	`priceOnRequest` boolean DEFAULT false,
	`status` enum('available','sold','pending','reserved','coming_soon','archived') NOT NULL DEFAULT 'available',
	`soldDate` timestamp,
	`soldPrice` decimal(15,2),
	`condition` varchar(50),
	`specifications` json,
	`locationAddress` text,
	`locationArea` varchar(100),
	`locationCoordinates` varchar(100),
	`images` json,
	`primaryImage` int DEFAULT 0,
	`virtualTourUrl` text,
	`videoUrl` text,
	`featured` boolean DEFAULT false,
	`internalNotes` text,
	`viewCount` int DEFAULT 0,
	`inquiryCount` int DEFAULT 0,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	`archivedAt` timestamp,
	CONSTRAINT `listings_id` PRIMARY KEY(`id`),
	CONSTRAINT `listings_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','editor','viewer') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `whatsapp` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_listingId_listings_id_fk` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_assignedTo_users_id_fk` FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `listing_status_history` ADD CONSTRAINT `listing_status_history_listingId_listings_id_fk` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `listing_status_history` ADD CONSTRAINT `listing_status_history_changedBy_users_id_fk` FOREIGN KEY (`changedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `listings` ADD CONSTRAINT `listings_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_activity_user` ON `activity_logs` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_activity_created` ON `activity_logs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_inquiries_status` ON `inquiries` (`status`);--> statement-breakpoint
CREATE INDEX `idx_inquiries_listing_id` ON `inquiries` (`listingId`);--> statement-breakpoint
CREATE INDEX `idx_status_history_listing` ON `listing_status_history` (`listingId`);--> statement-breakpoint
CREATE INDEX `idx_listings_status` ON `listings` (`status`);--> statement-breakpoint
CREATE INDEX `idx_listings_category` ON `listings` (`category`);--> statement-breakpoint
CREATE INDEX `idx_listings_featured` ON `listings` (`featured`);--> statement-breakpoint
CREATE INDEX `idx_listings_created_at` ON `listings` (`createdAt`);