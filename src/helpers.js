module.exports = {
	fetchDataGQL: body => {
		const api = process.env.REACT_APP_API_SERVER || "http://localhost:3001"
		return fetch(`${api}/graphql`, {
			method: 'post',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(body)
		})
	},
	fetchDataGQL2: body => {
		const api = process.env.REACT_APP_API_SERVER || "http://localhost:3001"
		const headers = { 
			'Content-Type': 'application/json'
		}
		const token = localStorage.getItem('token')
		if(token) headers['Authorization'] = `Bearer ${token}`
		return fetch(`${api}/graphql2`, {
			method: 'post',
			headers,
			body: JSON.stringify(body)
		})
	}
}