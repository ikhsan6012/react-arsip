const swal = require('sweetalert')

const fetchDataGQL = body => {
	const api = process.env.REACT_APP_API_SERVER || "http://localhost:3001"
	const headers = { 
		'Content-Type': 'application/json'
	}
	const token = localStorage.getItem('token')
	if(token) headers['Authorization'] = `Bearer ${token}`
	return fetch(`${api}/graphql`, {
		method: 'post',
		headers,
		body: JSON.stringify(body)
	}).then(res => res.json())
}

const handleErrors = errors => {
	if(errors.name === 'SessionError') {
		return swal(errors.message, { icon: 'error' })
			.then(() => {
				document.querySelector('nav .btn-danger').click()
			})
	} else if(errors.length) {
		return errors.forEach(err => {
			console.error(err)
		})
	}
}

const setToken = extensions => {
	if(extensions ? extensions.token : false){
		localStorage.setItem('token', extensions.token)
	}
}

module.exports = { fetchDataGQL, handleErrors, setToken }