export const existingDemoProjects = [
  {
    id: 1,
    name: 'student_portal',
    schema: 'tenant_101',
    status: 'Active',
  },
  {
    id: 2,
    name: 'ecommerce_app',
    schema: 'tenant_205',
    status: 'Active',
  },
]

const DEMO_MODE_KEY = 'intelidbDemoUserMode'
const NEW_USER_PROJECTS_KEY = 'intelidbNewUserProjects'

export function setDemoUserMode(mode) {
  localStorage.setItem(DEMO_MODE_KEY, mode)
}

export function getDemoUserMode() {
  return localStorage.getItem(DEMO_MODE_KEY) || 'existing'
}

export function resetNewUserProjects() {
  localStorage.setItem(NEW_USER_PROJECTS_KEY, JSON.stringify([]))
}

export function getNewUserProjects() {
  const rawProjects = localStorage.getItem(NEW_USER_PROJECTS_KEY)

  if (!rawProjects) {
    return []
  }

  try {
    return JSON.parse(rawProjects)
  } catch {
    return []
  }
}

export function getVisibleProjects() {
  return getDemoUserMode() === 'new' ? getNewUserProjects() : existingDemoProjects
}

export function getProjectById(id) {
  const projects = [...existingDemoProjects, ...getNewUserProjects()]
  return projects.find((project) => String(project.id) === String(id))
}

export function createDemoProject({ name, description }) {
  const projects = getNewUserProjects()
  const nextProject = {
    id: Date.now(),
    name,
    description,
    schema: `tenant_${String(projects.length + 1).padStart(3, '0')}`,
    status: 'Active',
  }

  localStorage.setItem(
    NEW_USER_PROJECTS_KEY,
    JSON.stringify([...projects, nextProject]),
  )

  return nextProject
}
