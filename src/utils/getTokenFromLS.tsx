export const getTokenFromLS = () => {
  const auth = JSON.parse(localStorage.getItem('persist:auth'))
  const trimmedToken = auth?.token?.slice(1, -1).replace(/\\/g, '')
  return trimmedToken
}
