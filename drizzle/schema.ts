import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  json,
  boolean,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control for admin, editor, viewer.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "editor", "viewer"])
    .default("user")
    .notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Listings table - stores all properties and vehicles
 */
export const listings = mysqlTable(
  "listings",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    sku: varchar("sku", { length: 50 }).notNull().unique(),
    category: mysqlEnum("category", [
      "vehicle",
      "real_estate",
      "land",
      "commercial",
    ]).notNull(),
    subcategory: varchar("subcategory", { length: 50 }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 15, scale: 2 }),
    priceOnRequest: boolean("priceOnRequest").default(false),
    status: mysqlEnum("status", [
      "available",
      "sold",
      "pending",
      "reserved",
      "coming_soon",
      "archived",
    ])
      .notNull()
      .default("available"),
    soldDate: timestamp("soldDate"),
    soldPrice: decimal("soldPrice", { precision: 15, scale: 2 }),
    condition: varchar("condition", { length: 50 }),
    specifications: json("specifications"),
    locationAddress: text("locationAddress"),
    locationArea: varchar("locationArea", { length: 100 }),
    locationCoordinates: varchar("locationCoordinates", { length: 100 }),
    images: json("images"), // Array of image URLs
    primaryImage: int("primaryImage").default(0),
    virtualTourUrl: text("virtualTourUrl"),
    videoUrl: text("videoUrl"),
    featured: boolean("featured").default(false),
    internalNotes: text("internalNotes"),
    viewCount: int("viewCount").default(0),
    inquiryCount: int("inquiryCount").default(0),
    createdBy: int("createdBy").references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    publishedAt: timestamp("publishedAt"),
    archivedAt: timestamp("archivedAt"),
  },
  (table) => ({
    statusIdx: index("idx_listings_status").on(table.status),
    categoryIdx: index("idx_listings_category").on(table.category),
    featuredIdx: index("idx_listings_featured").on(table.featured),
    createdAtIdx: index("idx_listings_created_at").on(table.createdAt),
  })
);

export type Listing = typeof listings.$inferSelect;
export type InsertListing = typeof listings.$inferInsert;

/**
 * Status history table - audit trail for listing status changes
 */
export const listingStatusHistory = mysqlTable(
  "listing_status_history",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    listingId: varchar("listingId", { length: 36 })
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    oldStatus: varchar("oldStatus", { length: 20 }),
    newStatus: varchar("newStatus", { length: 20 }).notNull(),
    changedBy: int("changedBy").references(() => users.id),
    changedAt: timestamp("changedAt").defaultNow().notNull(),
    reason: text("reason"),
  },
  (table) => ({
    listingIdIdx: index("idx_status_history_listing").on(table.listingId),
  })
);

export type ListingStatusHistory = typeof listingStatusHistory.$inferSelect;
export type InsertListingStatusHistory =
  typeof listingStatusHistory.$inferInsert;

/**
 * Inquiries/Leads table - customer inquiries for listings
 */
export const inquiries = mysqlTable(
  "inquiries",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    listingId: varchar("listingId", { length: 36 }).references(
      () => listings.id,
      { onDelete: "cascade" }
    ),
    customerName: varchar("customerName", { length: 255 }).notNull(),
    customerEmail: varchar("customerEmail", { length: 255 }),
    customerPhone: varchar("customerPhone", { length: 50 }).notNull(),
    customerWhatsapp: varchar("customerWhatsapp", { length: 50 }),
    message: text("message"),
    preferredViewingDate: timestamp("preferredViewingDate"),
    status: mysqlEnum("status", [
      "new",
      "contacted",
      "viewing_scheduled",
      "negotiating",
      "closed_won",
      "closed_lost",
    ])
      .notNull()
      .default("new"),
    assignedTo: int("assignedTo").references(() => users.id),
    source: varchar("source", { length: 50 }).default("website"),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    statusIdx: index("idx_inquiries_status").on(table.status),
    listingIdIdx: index("idx_inquiries_listing_id").on(table.listingId),
  })
);

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * Activity logs table - audit trail for all admin actions
 */
export const activityLogs = mysqlTable(
  "activity_logs",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: int("userId").references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entityType", { length: 50 }),
    entityId: varchar("entityId", { length: 36 }),
    details: json("details"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_activity_user").on(table.userId),
    createdAtIdx: index("idx_activity_created").on(table.createdAt),
  })
);

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

/**
 * Relations for type safety
 */
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  inquiries: many(inquiries),
  activityLogs: many(activityLogs),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  creator: one(users, {
    fields: [listings.createdBy],
    references: [users.id],
  }),
  statusHistory: many(listingStatusHistory),
  inquiries: many(inquiries),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  listing: one(listings, {
    fields: [inquiries.listingId],
    references: [listings.id],
  }),
  assignee: one(users, {
    fields: [inquiries.assignedTo],
    references: [users.id],
  }),
}));
