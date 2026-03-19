import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").order("desc").take(50)
    return await Promise.all(
      projects.map(async (project) => {
        const coverImageUrl = await ctx.storage.getUrl(project.coverImage)
        const authorLinks = await ctx.db
          .query("projectAuthors")
          .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
          .take(20)
        const authors = await Promise.all(
          authorLinks.map((link) => ctx.db.get(link.authorId)),
        )
        return {
          ...project,
          coverImageUrl,
          authors: authors.filter(Boolean),
        }
      }),
    )
  },
})

export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    body: v.string(),
    coverImage: v.id("_storage"),
    authorIds: v.optional(v.array(v.id("authors"))),
  },
  handler: async (ctx, args) => {
    const { authorIds, ...fields } = args
    const projectId = await ctx.db.insert("projects", fields)
    for (const authorId of authorIds ?? []) {
      await ctx.db.insert("projectAuthors", { projectId, authorId })
    }
    return projectId
  },
})

export const update = mutation({
  args: {
    id: v.id("projects"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const authorLinks = await ctx.db
      .query("projectAuthors")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.id))
      .take(500)
    for (const link of authorLinks) {
      await ctx.db.delete(link._id)
    }
    const images = await ctx.db
      .query("projectImages")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.id))
      .take(500)
    for (const img of images) {
      await ctx.db.delete(img._id)
    }
    await ctx.db.delete(args.id)
  },
})

export const addImage = mutation({
  args: {
    projectId: v.id("projects"),
    image: v.id("_storage"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projectImages", args)
  },
})

export const removeImage = mutation({
  args: { id: v.id("projectImages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const addAuthor = mutation({
  args: {
    projectId: v.id("projects"),
    authorId: v.id("authors"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projectAuthors", args)
  },
})

export const removeAuthor = mutation({
  args: { id: v.id("projectAuthors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique()
    if (!project) return null

    const coverImageUrl = await ctx.storage.getUrl(project.coverImage)

    const authorLinks = await ctx.db
      .query("projectAuthors")
      .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
      .take(20)
    const authors = await Promise.all(
      authorLinks.map(async (link) => {
        const author = await ctx.db.get(link.authorId)
        if (!author) return null
        const imageUrl = author.image
          ? await ctx.storage.getUrl(author.image)
          : null
        return { ...author, imageUrl }
      }),
    )

    const images = await ctx.db
      .query("projectImages")
      .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
      .take(100)
    const imageUrls = await Promise.all(
      images.map(async (img) => ({
        ...img,
        url: await ctx.storage.getUrl(img.image),
      })),
    )

    return {
      ...project,
      coverImageUrl,
      authors: authors.filter(Boolean),
      images: imageUrls,
    }
  },
})
