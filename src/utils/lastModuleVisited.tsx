export const lastModuleVisited = (action: 'set' | 'get', value?: string) => {
  const nameInLS = 'last-module-visited'
  if (action === 'set') {
    return localStorage.setItem(nameInLS, JSON.stringify(value))
  }
  if (action === 'get') {
    return JSON.parse(localStorage.getItem(nameInLS))
  }
}
