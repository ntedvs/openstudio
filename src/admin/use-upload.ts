import { useMutation } from "convex/react"
import { useState } from "react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"

export function useUpload() {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)
  const [uploading, setUploading] = useState(false)

  async function upload(file: File): Promise<Id<"_storage">> {
    setUploading(true)
    try {
      const url = await generateUploadUrl()
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      const { storageId } = await res.json()
      return storageId as Id<"_storage">
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}
