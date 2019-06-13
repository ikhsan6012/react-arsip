import React from 'react'
import { Route } from 'react-router-dom'

export default function TabPane(props){
	const list = props.list.map(li => {
		let url = `/berkas/tambah${li.url}`
		return(
			<Route
				exact
				path={ url }
				component={ () =>
					<li.component
						kd_berkas = { li.kd_berkas }
					/>
				}
				key={ url }
			/>
		)
	})
	
	return(
		<div className="tab-pane active">
			<div className="col-md-6">
				<div className="alert" hidden></div>
				{ list }
			</div>
		</div>
	)
}