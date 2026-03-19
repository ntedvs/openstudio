interface ProjectProps {
  image: string | null
  date: string
  title: string
  body: string
}

export default function Project({ image, date, title, body }: ProjectProps) {
  return (
    <article className="space-y-3">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full rounded-lg object-cover"
        />
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <time className="font-body text-sm text-neutral-500">{date}</time>
      </div>

      <p className="font-body text-neutral-700">{body}</p>
    </article>
  )
}
