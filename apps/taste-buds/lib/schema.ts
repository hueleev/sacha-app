import { timestamp, pgTable, text, primaryKey, integer, uuid } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm"; // Import relations for defining relationships

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const account = pgTable(
  "account",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (acc) => ({
    compoundKey: primaryKey({ columns: [acc.provider, acc.providerAccountId] }),
  })
);

export const session = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// profiles: 사용자 프로필 테이블
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  nickname: text("nickname").notNull(),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// common_codes: 공통 코드 테이블
export const commonCodes = pgTable("common_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  codeGroup: text("code_group").notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// music_contents: 음악 콘텐츠 정보 테이블
export const musicContents = pgTable("music_contents", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  releaseYear: integer("release_year"),
  image: text("image"),
  source: text("source"),
  sourceId: text("source_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// movie_contents: 영화 콘텐츠 정보 테이블
export const movieContents = pgTable("movie_contents", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  director: text("director"),
  releaseYear: integer("release_year"),
  image: text("image"),
  source: text("source"),
  sourceId: text("source_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// book_contents: 책 콘텐츠 정보 테이블
export const bookContents = pgTable("book_contents", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  author: text("author"),
  publicationYear: integer("publication_year"),
  image: text("image"),
  source: text("source"),
  sourceId: text("source_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// photo_contents: 사진 콘텐츠 정보 테이블
export const photoContents = pgTable("photo_contents", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// posts: 게시물 및 별점 테이블
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  contentTypeId: uuid("content_type_id").references(() => commonCodes.id, { onDelete: "restrict" }),
  musicContentId: uuid("music_content_id").references(() => musicContents.id, { onDelete: "cascade" }),
  movieContentId: uuid("movie_content_id").references(() => movieContents.id, { onDelete: "cascade" }),
  bookContentId: uuid("book_content_id").references(() => bookContents.id, { onDelete: "cascade" }),
  photoContentId: uuid("photo_content_id").references(() => photoContents.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// likes: 공감(좋아요) 테이블
export const likes = pgTable("likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// bookmarks: 찜하기 테이블
export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  contentTypeId: uuid("content_type_id").references(() => commonCodes.id, { onDelete: "restrict" }),
  musicContentId: uuid("music_content_id").references(() => musicContents.id, { onDelete: "cascade" }),
  movieContentId: uuid("movie_content_id").references(() => movieContents.id, { onDelete: "cascade" }),
  bookContentId: uuid("book_content_id").references(() => bookContents.id, { onDelete: "cascade" }),
  photoContentId: uuid("photo_content_id").references(() => photoContents.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// follows: 팔로우 관계 테이블
export const follows = pgTable("follows", {
  id: uuid("id").defaultRandom().primaryKey(),
  followerId: uuid("follower_id").references(() => user.id, { onDelete: "cascade" }),
  followingId: uuid("following_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations for better querying (optional but good practice)
export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(user, { fields: [profiles.userId], references: [user.id] }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(user, { fields: [posts.userId], references: [user.id] }),
  contentType: one(commonCodes, { fields: [posts.contentTypeId], references: [commonCodes.id] }),
  musicContent: one(musicContents, { fields: [posts.musicContentId], references: [musicContents.id] }),
  movieContent: one(movieContents, { fields: [posts.movieContentId], references: [movieContents.id] }),
  bookContent: one(bookContents, { fields: [posts.bookContentId], references: [bookContents.id] }),
  photoContent: one(photoContents, { fields: [posts.photoContentId], references: [photoContents.id] }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(user, { fields: [likes.userId], references: [user.id] }),
  post: one(posts, { fields: [likes.postId], references: [posts.id] }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(user, { fields: [bookmarks.userId], references: [user.id] }),
  contentType: one(commonCodes, { fields: [bookmarks.contentTypeId], references: [commonCodes.id] }),
  musicContent: one(musicContents, { fields: [bookmarks.musicContentId], references: [musicContents.id] }),
  movieContent: one(movieContents, { fields: [bookmarks.movieContentId], references: [movieContents.id] }),
  bookContent: one(bookContents, { fields: [bookmarks.bookContentId], references: [bookContents.id] }),
  photoContent: one(photoContents, { fields: [bookmarks.photoContentId], references: [photoContents.id] }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(user, { fields: [follows.followerId], references: [user.id], relationName: 'follower_user' }),
  following: one(user, { fields: [follows.followingId], references: [user.id], relationName: 'following_user' }),
}));