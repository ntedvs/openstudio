import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("authors").order("desc").take(100)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("authors", args)
  },
})

export const update = mutation({
  args: {
    id: v.id("authors"),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id("authors") },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("projectAuthors")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.id))
      .take(500)
    for (const link of links) {
      await ctx.db.delete(link._id)
    }
    await ctx.db.delete(args.id)
  },
})
