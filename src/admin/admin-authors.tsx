import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { api } from "../../convex/_generated/api"
import { useUpload } from "./use-upload.ts"

export default function AdminAuthors() {
  const authors = useQuery(api.authors.list)
  const createAuthor = useMutation(api.authors.create)
  const removeAuthor = useMutation(api.authors.remove)
  const { upload, uploading } = useUpload()

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const image = imageFile ? await upload(imageFile) : undefined
    await createAuthor({ name, bio: bio || undefined, image })
    setName("")
    setBio("")
    setImageFile(null)
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="font-display text-xl font-semibold">New Author</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="block w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />

        <textarea
          placeholder="Bio (optional)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={2}
          className="block w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />

        <div>
          <label className="mb-1 block text-sm text-neutral-600">
            Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Create Author"}
        </button>
      </form>

      <div>
        <h2 className="font-display mb-4 text-xl font-semibold">Authors</h2>
        {!authors ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : authors.length === 0 ? (
          <p className="text-sm text-neutral-500">No authors yet.</p>
        ) : (
          <ul className="space-y-3">
            {authors.map((a) => (
              <li
                key={a._id}
                className="flex items-center justify-between rounded border border-neutral-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{a.name}</p>
                  {a.bio && (
                    <p className="text-xs text-neutral-500">{a.bio}</p>
                  )}
                </div>
                <button
                  onClick={() => removeAuthor({ id: a._id })}
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
