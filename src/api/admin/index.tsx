export const testpost = () => {
  return axios.post('http://localhost:8080/api/auth/login', {
    phone: '123453342512sadfdsa52',
  })
}
