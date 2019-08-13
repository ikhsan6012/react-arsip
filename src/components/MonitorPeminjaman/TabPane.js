import React from 'react'
import { Route } from 'react-router-dom'

const TabPane = props => {
	const list = props.list.map(li => 
		<Route exact
			key={ li.url }
			path={`/monitor-peminjaman${li.url}`}
			component={ () => <li.component /> }
		/>
	)
	
	return(
		<div className="tab-pane active">
			<div className="col-md-12">
				{ list }
			</div>
		</div>
	)
}
export default TabPane