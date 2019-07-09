import React from 'react'
import Pagination from 'react-js-pagination'

export const PG = props => {
	return(
		<div className={`pull-${ props.pull || 'right'}`} hidden={ props.hidden || false }>
			<Pagination 
				activePage={ props.activePage || 1 }
				itemsCountPerPage={ props.itemsCountPerPage || 5 }
				totalItemsCount={ props.totalItemsCount || 1 }
				pageRangeDisplayed={ props.pageRangeDisplayed || 5 }
				itemClass="page-item"
				linkClass="page-link"
				onChange={ props.onChange || null }
			/>
		</div>
	)
}