import swal from 'sweetalert'
import { fetchDataGQL } from './helpers'

export const login = e => {
  e.preventDefault()
  const username = document.querySelectorAll('#formLogin .form-control')[0].value
  const password = document.querySelectorAll('#formLogin .form-control')[1].value
  const body = {query: `{
    user(username: "${username}", password: "${password}"){
      _id
      username
      nama
      token
    }
  }`}
  return fetchDataGQL(body)
    .then(({data, errors}) => {
      if(!data.user) {
        return swal('Username atau Password Salah...', { icon: 'error' })
          .then(() => {
            const inputDOM = document.querySelectorAll('#formLogin input')
            inputDOM.forEach(input => input.value = '')
            inputDOM[0].focus()
          })
      }
      localStorage.setItem('username', data.user.username)
      return swal('Login Berhasil!', {
        icon: 'success'
      }).then(() => {
        localStorage.setItem('token', data.user.token)
        window.location.href = process.env.REACT_APP_HOST
      })
    })
    .catch(err => console.log(err))
}

export const logout = () => {
  swal('Logout Berhasil!', {
    icon: 'success'
  }).then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('formData')
    localStorage.removeItem('username')
    window.location.href = process.env.REACT_APP_HOST
  })
}