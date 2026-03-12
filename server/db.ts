import { eq, desc, and, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  listings,
  inquiries,
  activityLogs,
  listingStatusHistory,
  type Listing,
  type Inquiry,
  type ActivityLog,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Listings queries
export async function getListings(filters?: {
  category?: string;
  status?: string[];
  featured?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Listing[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters?.category) {
    conditions.push(eq(listings.category, filters.category as any));
  }
  if (filters?.status && filters.status.length > 0) {
    conditions.push(inArray(listings.status, filters.status as any));
  }
  if (filters?.featured) {
    conditions.push(eq(listings.featured, true));
  }

  let query: any = db.select().from(listings);

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  query = query.orderBy(desc(listings.createdAt));

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.offset(filters.offset);
  }

  return await query;
}

export async function getListingById(id: string): Promise<Listing | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(listings)
    .where(eq(listings.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createListing(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(listings).values(data);
}

export async function updateListing(id: string, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(listings)
    .set(data)
    .where(eq(listings.id, id));
}

// Inquiries queries
export async function getInquiries(filters?: {
  listingId?: string;
  status?: string[];
  limit?: number;
  offset?: number;
}): Promise<Inquiry[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters?.listingId) {
    conditions.push(eq(inquiries.listingId, filters.listingId));
  }
  if (filters?.status && filters.status.length > 0) {
    conditions.push(inArray(inquiries.status, filters.status as any));
  }

  let query: any = db.select().from(inquiries);

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  query = query.orderBy(desc(inquiries.createdAt));

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.offset(filters.offset);
  }

  return await query;
}

export async function createInquiry(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(inquiries).values(data);
}

export async function updateInquiry(id: string, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(inquiries)
    .set(data)
    .where(eq(inquiries.id, id));
}

// Activity logs
export async function logActivity(data: any) {
  const db = await getDb();
  if (!db) return;
  await db.insert(activityLogs).values(data);
}

// Status history
export async function recordStatusChange(
  listingId: string,
  oldStatus: string | null,
  newStatus: string,
  userId?: number,
  reason?: string
) {
  const db = await getDb();
  if (!db) return;
  await db.insert(listingStatusHistory).values({
    id: crypto.randomUUID(),
    listingId,
    oldStatus,
    newStatus,
    changedBy: userId,
    reason,
  });
}
