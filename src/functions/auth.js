import swal from 'sweetalert'
import { fetchDataGQL } from './helpers'

export const login = async e => {
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
  try {
    const { data } = await fetchDataGQL(body)
    if(!data.user) {
      await swal('Username atau Password Salah...', { icon: 'error' })
      const inputDOM = document.querySelectorAll('#formLogin input')
      inputDOM.forEach(input => input.value = '')
      return inputDOM[0].focus()
    }
    localStorage.setItem('username', data.user.username)
    await swal('Login Berhasil!', {
      title: 'Login Berhasil!',
      text: `Selamat Datang, ${ data.user.nama }...`,
      icon: 'success'
    })
    localStorage.setItem('token', data.user.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.location.href = process.env.REACT_APP_HOST
  } catch (err) {
    console.log(err) 
  }
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

export const changePassword = async (setPasswordForm, e) => {
  e.preventDefault()
  const isSend = await swal('Apakah Anda Yakin Akan Mengubah Password ??', { icon: 'warning', buttons: ['Batal', 'Ya'] })
  if(isSend){
    const password_lama = document.querySelector('#password-lama')
    const password_baru = document.querySelector('#password-baru')
    const username = localStorage.getItem('username')
    const body = {query: `mutation{
      user: changePassword(username: "${ username }", password_lama: "${ password_lama.value }", password_baru: "${ password_baru.value }"){
        _id
      }
    }`}
    try {
      const { errors } = await fetchDataGQL(body)
      if(errors) {
        await swal(errors[0].message, { icon: 'error' })
        return password_lama.focus()
      }
      await swal('Berhasil Mengganti Password...', { icon: 'success' })
      setPasswordForm('')
    } catch (err) {      
      console.log(err) 
    }
  }
}