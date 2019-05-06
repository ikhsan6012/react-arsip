module.exports = {
	fetchDataGQL: body => {
		const api = process.env.REACT_APP_API_SERVER || "http://localhost:3001"
		return fetch(`${api}/graphql`, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		})
	}
}