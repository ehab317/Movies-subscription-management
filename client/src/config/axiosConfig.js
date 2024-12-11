/**
 * a function for creating a global axios instance with authentication headers
 * 
 * an axios instance that allowes to send requests to the server with authentication
 *  headers in order to send and receive auth tokens
 *
 */
import axios from 'axios'
const secret = process.env.REACT_APP_LOGIN_SECRET

const axiosRequest = axios.create({
    headers: {
        'Content-Type': 'application/json',
      },
    withCredentials: true
})

axiosRequest.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = token
      } else {
        config.headers.Authorization = secret
      }
      return config
    },
    (error) => Promise.reject(error)
  )

export default axiosRequest