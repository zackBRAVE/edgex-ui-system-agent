const HTTP = 'https'
const SERVER_HOST = '172.17.176.204'
const SERVER_PORT = '4040'

const auth_type = 'Bearer'
const token =
  'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3OWQ4ZGU5Yy0xMGM3LTRjOGYtODM3Mi1kYjMxNjgwYzdlNDQiLCJleHAiOjE2NDc0MjQ5NjIsIm5iZiI6MTY0NzQyMTM2MiwiaWF0IjoxNjQ3NDIxMzYyfQ.I8PJg72Z2R4Y7HKhqmdMrlj9zmGeN05GsfEcrVS6QLc5hfYECj-BJqre6MJSKRRUBEl5eXw86fPvDKLSc_5nvA'

export let HTTP_SERVER = HTTP + '://' + SERVER_HOST + ':' + SERVER_PORT

// for CORS purpose and proxy settings, change all the urls to below
HTTP_SERVER = '/api'

export const config = {
  headers: {
    Authorization: `${auth_type} ${token}`,
  },
}
