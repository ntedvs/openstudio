import "@fontsource-variable/fraunces"
import "@fontsource-variable/hanken-grotesk"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router"
import AdminAuthors from "./admin/admin-authors.tsx"
import AdminProjects from "./admin/admin-projects.tsx"
import Admin from "./admin/admin.tsx"
import App from "./app.tsx"
import "./index.css"
import Layout from "./layout.tsx"
import ProjectPage from "./project-page.tsx"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
          </Route>

          <Route path="/admin" element={<Admin />}>
            <Route index element={<AdminProjects />} />
            <Route path="authors" element={<AdminAuthors />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConvexProvider>
  </StrictMode>,
)
