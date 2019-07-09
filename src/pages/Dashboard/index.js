import React from 'react'
import ContentHeader from '../../components/ContentHeader'
import Content from './Content'


const Dashboard = () => {
	const contentHeader = [{ name: 'Dashboard' } ]

	return(
		<main className="content-wrapper">
			<ContentHeader contentHeader={ contentHeader } />
			<Content />
		</main>
	)
}
export default Dashboard