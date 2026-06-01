export function getDemoCredentials(project) {
  return {
    ...project,
    username: 'vaishnavi_user',
    password: 'secret1234',
    connectionUrl: `postgresql://vaishnavi_user@postgres/${project.name}?schema=${project.schema}`,
  }
}
