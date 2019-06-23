import React from 'react'
import { DetailWPItem, DetailBerkasItem } from './DetailItem';

const List = props => {
	return(
		<div className="col-md-4 col-sm-6 col-12" name="list" value={ props.value }>
			<div className="info-box">
				<span className="info-box-icon bg-info-gradient">
					<i className="fa fa-star-o"></i>
				</span>
				<div className="info-box-content">
					{ props.children }
				</div>
			</div>
			{ props.detailWP &&<DetailWPItem detailWP={ props.detailWP } /> }
			{ props.detail &&<DetailBerkasItem detail={ props.detail } /> }
		</div>
	)
}

export default List