import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  bigint,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// NextAuth 테이블들 (공식 문서에 맞게 수정)
export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const account = pgTable(
  "account",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: bigint("expires_at", { mode: "number" }),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    providerProviderAccountIdIdx: index("provider_provider_account_id_idx").on(
      table.provider,
      table.providerAccountId
    ),
  })
);

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    identifierTokenIdx: index("identifier_token_idx").on(
      table.identifier,
      table.token
    ),
  })
);

// 커스텀 테이블들 (복수형 유지)
export const families = pgTable("families", {
  id: uuid("id").primaryKey().defaultRandom(),
  familyName: text("family_name").notNull(),
  password: text("password").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const familyMembers = pgTable(
  "family_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    familyId: uuid("family_id")
      .notNull()
      .references(() => families.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    nickname: text("nickname").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    familyUserIdIdx: index("family_user_id_idx").on(
      table.familyId,
      table.userId
    ),
  })
);

export const medications = pgTable("medications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  medicationName: text("medication_name").notNull(),
  medicationTime: timestamp("medication_time", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medicationLogs = pgTable("medication_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationId: uuid("medication_id")
    .notNull()
    .references(() => medications.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  isTaken: boolean("is_taken").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const feedItems = pgTable("feed_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const feedItemComments = pgTable("feed_item_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  feedItemId: uuid("feed_item_id")
    .notNull()
    .references(() => feedItems.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const feedItemLikes = pgTable(
  "feed_item_likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    feedItemId: uuid("feed_item_id")
      .notNull()
      .references(() => feedItems.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    feedItemUserIdIdx: index("feed_item_user_id_idx").on(
      table.feedItemId,
      table.userId
    ),
  })
);

// Relations
export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  familiesCreated: many(families),
  familyMemberships: many(familyMembers),
  medications: many(medications),
  medicationLogs: many(medicationLogs),
  feedItems: many(feedItems),
  feedItemComments: many(feedItemComments),
  feedItemLikes: many(feedItemLikes),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const familiesRelations = relations(families, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [families.createdBy],
    references: [user.id],
  }),
  familyMembers: many(familyMembers),
  feedItems: many(feedItems),
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  family: one(families, {
    fields: [familyMembers.familyId],
    references: [families.id],
  }),
  user: one(user, { fields: [familyMembers.userId], references: [user.id] }),
}));

export const medicationsRelations = relations(medications, ({ one, many }) => ({
  user: one(user, { fields: [medications.userId], references: [user.id] }),
  medicationLogs: many(medicationLogs),
}));

export const medicationLogsRelations = relations(medicationLogs, ({ one }) => ({
  medication: one(medications, {
    fields: [medicationLogs.medicationId],
    references: [medications.id],
  }),
  user: one(user, { fields: [medicationLogs.userId], references: [user.id] }),
}));

export const feedItemsRelations = relations(feedItems, ({ one, many }) => ({
  family: one(families, {
    fields: [feedItems.familyId],
    references: [families.id],
  }),
  user: one(user, { fields: [feedItems.userId], references: [user.id] }),
  comments: many(feedItemComments),
  likes: many(feedItemLikes),
}));

export const feedItemCommentsRelations = relations(
  feedItemComments,
  ({ one }) => ({
    feedItem: one(feedItems, {
      fields: [feedItemComments.feedItemId],
      references: [feedItems.id],
    }),
    user: one(user, {
      fields: [feedItemComments.userId],
      references: [user.id],
    }),
  })
);

export const feedItemLikesRelations = relations(feedItemLikes, ({ one }) => ({
  feedItem: one(feedItems, {
    fields: [feedItemLikes.feedItemId],
    references: [feedItems.id],
  }),
  user: one(user, { fields: [feedItemLikes.userId], references: [user.id] }),
}));
