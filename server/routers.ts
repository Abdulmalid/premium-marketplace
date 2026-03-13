import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  getInquiries,
  createInquiry,
  updateInquiry,
  logActivity,
  recordStatusChange,
} from "./db";
import { TRPCError } from "@trpc/server";

// Validation schemas
const createListingSchema = z.object({
  category: z.enum(["vehicle", "real_estate", "land", "commercial"]),
  subcategory: z.string(),
  title: z.string().min(5),
  description: z.string().min(20),
  price: z.number().positive().optional(),
  priceOnRequest: z.boolean().default(false),
  condition: z.string().optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  locationAddress: z.string(),
  locationArea: z.string(),
  locationCoordinates: z.string().optional(),
  images: z.array(z.string()).optional(),
  primaryImage: z.number().default(0),
  virtualTourUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  featured: z.boolean().default(false),
  internalNotes: z.string().optional(),
});

const updateListingSchema = createListingSchema.partial();

const createInquirySchema = z.object({
  listingId: z.string(),
  customerName: z.string().min(2),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(10),
  customerWhatsapp: z.string().optional(),
  message: z.string().optional(),
  preferredViewingDate: z.date().optional(),
});

// Listings router
const listingsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        status: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
        limit: z.number().default(12),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return await getListings({
        category: input.category,
        status: input.status,
        featured: input.featured,
        limit: input.limit,
        offset: input.offset,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const listing = await getListingById(input.id);
      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Listing not found",
        });
      }
      return listing;
    }),

  create: protectedProcedure
    .input(createListingSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "editor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and editors can create listings",
        });
      }

      const sku = `${input.category.toUpperCase()}-${Date.now()}`;
      const listing = await createListing({
        id: crypto.randomUUID(),
        sku,
        category: input.category,
        subcategory: input.subcategory,
        title: input.title,
        description: input.description,
        price: input.price ? parseFloat(input.price.toString()) : null,
        priceOnRequest: input.priceOnRequest,
        condition: input.condition,
        specifications: input.specifications ? JSON.stringify(input.specifications) : null,
        locationAddress: input.locationAddress,
        locationArea: input.locationArea,
        locationCoordinates: input.locationCoordinates,
        images: input.images ? JSON.stringify(input.images) : null,
        primaryImage: input.primaryImage,
        virtualTourUrl: input.virtualTourUrl,
        videoUrl: input.videoUrl,
        featured: input.featured,
        internalNotes: input.internalNotes,
        createdBy: ctx.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await logActivity({
        id: crypto.randomUUID(),
        userId: ctx.user.id,
        action: "CREATE_LISTING",
        entityType: "listing",
        entityId: sku,
        details: { title: input.title, category: input.category },
        createdAt: new Date(),
      });

      return listing;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateListingSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "editor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and editors can update listings",
        });
      }

      const listing = await getListingById(input.id);
      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Listing not found",
        });
      }

      const updateData = {
        ...input.data,
        specifications: input.data.specifications ? JSON.stringify(input.data.specifications) : undefined,
        images: input.data.images ? JSON.stringify(input.data.images) : undefined,
        updatedAt: new Date(),
      };

      await updateListing(input.id, updateData);

      await logActivity({
        id: crypto.randomUUID(),
        userId: ctx.user.id,
        action: "UPDATE_LISTING",
        entityType: "listing",
        entityId: input.id,
        details: { changes: Object.keys(input.data) },
        createdAt: new Date(),
      });

      return { success: true };
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["available", "sold", "pending", "reserved", "coming_soon", "archived"]),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "editor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and editors can update listing status",
        });
      }

      const listing = await getListingById(input.id);
      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Listing not found",
        });
      }

      const oldStatus = listing.status;
      await updateListing(input.id, {
        status: input.status,
        updatedAt: new Date(),
      });

      await recordStatusChange(
        input.id,
        oldStatus,
        input.status,
        ctx.user.id,
        input.reason
      );

      await logActivity({
        id: crypto.randomUUID(),
        userId: ctx.user.id,
        action: "UPDATE_STATUS",
        entityType: "listing",
        entityId: input.id,
        details: { oldStatus, newStatus: input.status, reason: input.reason },
        createdAt: new Date(),
      });

      return { success: true };
    }),
});

// Inquiries router
const inquiriesRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        listingId: z.string().optional(),
        status: z.array(z.string()).optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "editor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and editors can view inquiries",
        });
      }

      return await getInquiries({
        listingId: input.listingId,
        status: input.status,
        limit: input.limit,
        offset: input.offset,
      });
    }),

  create: publicProcedure
    .input(createInquirySchema)
    .mutation(async ({ input }) => {
      const inquiry = await createInquiry({
        id: crypto.randomUUID(),
        listingId: input.listingId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        customerWhatsapp: input.customerWhatsapp,
        message: input.message,
        preferredViewingDate: input.preferredViewingDate,
        status: "new",
        source: "website",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true, inquiryId: inquiry };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["new", "contacted", "viewing_scheduled", "negotiating", "closed_won", "closed_lost"]).optional(),
        assignedTo: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "editor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins and editors can update inquiries",
        });
      }

      const updateData = {
        ...(input.status && { status: input.status }),
        ...(input.assignedTo && { assignedTo: input.assignedTo }),
        ...(input.notes && { notes: input.notes }),
        updatedAt: new Date(),
      };

      await updateInquiry(input.id, updateData);

      await logActivity({
        id: crypto.randomUUID(),
        userId: ctx.user.id,
        action: "UPDATE_INQUIRY",
        entityType: "inquiry",
        entityId: input.id,
        details: updateData,
        createdAt: new Date(),
      });

      return { success: true };
    }),
});

// Admin dashboard router
const adminRouter = router({
  stats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "editor") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins and editors can access dashboard",
      });
    }

    const allListings = await getListings({ limit: 1000 });
    const activeListings = allListings.filter(
      (l) => l.status === "available" || l.status === "pending" || l.status === "reserved"
    );
    const soldListings = allListings.filter((l) => l.status === "sold");
    const inquiries = await getInquiries({ limit: 1000 });

    return {
      totalListings: allListings.length,
      activeListings: activeListings.length,
      soldListings: soldListings.length,
      totalInquiries: inquiries.length,
      newInquiries: inquiries.filter((i) => i.status === "new").length,
      revenueValue: activeListings.reduce((sum, l) => sum + (typeof l.price === 'number' ? l.price : 0), 0),
    };
  }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  listings: listingsRouter,
  inquiries: inquiriesRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
