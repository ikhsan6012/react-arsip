import React from 'react'
import { Link } from 'react-router-dom'

export default props => {
	const contentTitle = props.contentHeader.slice(-1)[0].name
	
	const items = props.contentHeader.map(item => {
		return(
			<li className="breadcrumb-item" key={ item.name }>
				{ item.name }
			</li>
		)
	})
	
	return(
		<section className="content-header">
			<div className="container-fluid">
				<div className="row mb-2">
					<div className="col-sm-6">
						<h1> { contentTitle } </h1>
					</div>
					<div className="col-sm-6">
						<ol className="breadcrumb float-sm-right">
							<li className="breadcrumb-item">
								<Link to="/">Home</Link>
							</li>
							{ items }
						</ol>
					</div>
				</div>
			</div>
		</section>
	)
}