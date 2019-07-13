import swal from 'sweetalert'

export const fetchDataGQL = body => {
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

export const handleErrors = errors => {
	if(errors.name === 'SessionError') {
		return swal(errors.message, { icon: 'error', timer: 1000 })
			.then(() => {
				document.querySelector('nav .btn-danger').click()
			})
	} else if(errors.length) {
		swal({
			text: errors[0].message, 
			icon: 'error' 
		})
		return errors.forEach(err => {
			console.error(err)
		})
	}
}

export const setToken = extensions => {
	if(extensions ? extensions.token : false){
		localStorage.setItem('token', extensions.token)
	}
}