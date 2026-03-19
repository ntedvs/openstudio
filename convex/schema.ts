import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  authors: defineTable({
    name: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
  }),

  projects: defineTable({
    slug: v.string(),
    title: v.string(),
    body: v.string(),
    coverImage: v.id("_storage"),
  }).index("by_slug", ["slug"]),

  projectImages: defineTable({
    projectId: v.id("projects"),
    image: v.id("_storage"),
    order: v.number(),
  }).index("by_projectId", ["projectId"]),

  projectAuthors: defineTable({
    projectId: v.id("projects"),
    authorId: v.id("authors"),
  })
    .index("by_projectId", ["projectId"])
    .index("by_authorId", ["authorId"]),
})
