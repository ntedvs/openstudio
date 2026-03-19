import { useQuery } from "convex/react"
import { Link, useParams } from "react-router"
import { api } from "../convex/_generated/api"

export default function ProjectPage() {
  const { slug } = useParams()
  const project = useQuery(api.projects.getBySlug, slug ? { slug } : "skip")

  if (project === undefined) return null

  if (!project) {
    return (
      <div className="font-body mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-neutral-500">Project not found.</p>

        <Link to="/" className="mt-4 inline-block text-sm underline">
          Back home
        </Link>
      </div>
    )
  }

  const date = new Date(project._creationTime).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <main className="mx-auto max-w-2xl px-6 pb-8">
      {project.coverImageUrl && (
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="w-full rounded-lg object-cover"
        />
      )}

      <div className="mt-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">{project.title}</h1>

        <time className="font-body text-sm text-neutral-500">{date}</time>
      </div>

      {project.authors.length > 0 && (
        <div className="font-body mt-3 flex flex-wrap gap-3">
          {project.authors.map(
            (author) =>
              author && (
                <div key={author._id} className="flex items-center gap-2">
                  {author.imageUrl && (
                    <img
                      src={author.imageUrl}
                      alt={author.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-neutral-600">
                    {author.name}
                  </span>
                </div>
              ),
          )}
        </div>
      )}

      <p className="font-body mt-4 text-neutral-700">{project.body}</p>

      {project.images.length > 0 && (
        <div className="mt-8 space-y-4">
          {project.images.map((img) =>
            img.url ? (
              <img
                key={img._id}
                src={img.url}
                alt=""
                className="w-full rounded-lg object-cover"
              />
            ) : null,
          )}
        </div>
      )}
    </main>
  )
}
