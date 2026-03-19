import { useQuery } from "convex/react"
import { Link } from "react-router"
import { api } from "../convex/_generated/api"
import ProjectCard from "./project.tsx"

export default function App() {
  const projects = useQuery(api.projects.list)

  if (!projects) return null

  return (
    <main className="mx-auto max-w-2xl space-y-12 px-6 pb-8">
      {projects.map((project) => (
        <Link
          key={project._id}
          to={`/projects/${project.slug}`}
          className="block"
        >
          <ProjectCard
            image={project.coverImageUrl}
            title={project.title}
            body={project.body}
            date={new Date(project._creationTime).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
        </Link>
      ))}
    </main>
  )
}
