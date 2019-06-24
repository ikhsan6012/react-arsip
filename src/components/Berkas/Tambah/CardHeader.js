import React from 'react'
import { NavLink } from 'react-router-dom'

const CardHeader = props => {
	const list = props.list.map(li => {
		const link = `/berkas/tambah${ li.url }`
		
		return(
			<li className="nav-item" key={ li.name } >
				<NavLink exact to={ link } className="nav-link">
					{ li.name }
				</NavLink>
			</li>
		)
	})

	return(
		<div className="card-header d-flex p-0">
			<ul className="nav nav-pills p-2">
				{ list }
			</ul>
		</div>
	)
}
export default CardHeader