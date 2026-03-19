import slugify from "@sindresorhus/slugify"
import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import { useUpload } from "./use-upload.ts"

export default function AdminProjects() {
  const projects = useQuery(api.projects.list)
  const authors = useQuery(api.authors.list)
  const createProject = useMutation(api.projects.create)
  const removeProject = useMutation(api.projects.remove)
  const { upload, uploading } = useUpload()

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [selectedAuthors, setSelectedAuthors] = useState<Id<"authors">[]>([])

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!coverFile) return
    const coverImage = await upload(coverFile)
    await createProject({
      title,
      slug: slugify(title),
      body,
      coverImage,
      authorIds: selectedAuthors.length > 0 ? selectedAuthors : undefined,
    })
    setTitle("")
    setBody("")
    setCoverFile(null)
    setSelectedAuthors([])
  }

  function toggleAuthor(id: Id<"authors">) {
    setSelectedAuthors((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="font-display text-xl font-semibold">New Project</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="block w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />

        <textarea
          placeholder="Description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={3}
          className="block w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />

        <div>
          <label className="mb-1 block text-sm text-neutral-600">
            Cover image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
            required
            className="text-sm"
          />
        </div>

        {authors && authors.length > 0 && (
          <div>
            <label className="mb-1 block text-sm text-neutral-600">
              Authors
            </label>
            <div className="flex flex-wrap gap-2">
              {authors.map((a) => (
                <button
                  key={a._id}
                  type="button"
                  onClick={() => toggleAuthor(a._id)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    selectedAuthors.includes(a._id)
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 text-neutral-700"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Create Project"}
        </button>
      </form>

      <div>
        <h2 className="font-display mb-4 text-xl font-semibold">Projects</h2>
        {!projects ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-neutral-500">No projects yet.</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((p) => (
              <li
                key={p._id}
                className="flex items-center justify-between rounded border border-neutral-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-neutral-500">/{p.slug}</p>
                </div>
                <button
                  onClick={() => removeProject({ id: p._id })}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
