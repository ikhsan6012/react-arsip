import React from 'react'

export const DetailWPItem = props => {
	// List Detail WP
	const detailWPList = Object.entries(props.detailWP.data).map((data, i) => {
		if(data[0] !== 'lastUpdate') return(
			<tr key={ data[0] } name="wps">
				{ data[0] === 'total' ? null : <td className="text-center">{ i + 1 }</td> }
				{ data[0] === 'total'
					? <td colSpan='2' onClick={ () => this.getWPs(data[0]) } style={{ cursor: 'pointer' }}>{ data[0].toUpperCase() }</td> 
					: <td onClick={ () => this.getWPs(data[0]) } style={{ cursor: 'pointer' }}>{ data[0].toUpperCase() }</td> }
				<td className="text-center">{ data[1] }</td>
			</tr>
		)
		else return false
	})
	const lastUpdate = props.detailWP.data.lastUpdate
		? new Date(parseInt(props.detailWP.data.lastUpdate)).toLocaleString('id')
		: null

	return(
		<div className="card" hidden={ props.detailWP.isHidden }>
			<div className="card-body">
				<div className="table-responsive">
					<table className="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th width="10px" className="text-center align-middle">No</th>
								<th className="text-center align-middle">Status</th>
								<th className="text-center align-middle">Jumlah</th>
							</tr>
						</thead>
						<tbody>
							{ detailWPList }
						</tbody>
					</table>
				</div>
				{ lastUpdate && <p className="pull-right">Update terakhir: { lastUpdate }</p> }
			</div>
		</div>
	)
}

export const DetailBerkasItem = props => {
	// List Detail Berkas
	const detail = Object.entries(props.detail.data).map((data, i) => {
		if(data[0] !== 'lastUpdate'){
			return(
				<tr key={ data[0] }>
					{ data[0] === 'total' ? null : <td className="text-center">{ i + 1 }</td> }
					{ data[0] === 'total' 
						? <td colSpan='2'>{ data[0].toUpperCase() }</td> 
						: <td style={{ textTransform: 'capitalize' }}>{ data[0].split('_').join(' ') }</td> }
					<td className="text-center">{ data[1] }</td>
				</tr>
			)
		}
		return false
	})
	let lastUpdate = props.detail.data.lastUpdate
		? new Date(parseInt(props.detail.data.lastUpdate)).toLocaleString('id')
		: null

	return(
		<div className="card" hidden={ props.detail.isHidden }>
			<div className="card-body">
				<div className="table-responsive">
					<table className="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th width="10px" className="text-center align-middle">No</th>
								<th className="text-center align-middle">Status</th>
								<th className="text-center">Jumlah</th>
							</tr>
						</thead>
						<tbody>
							{ detail }
						</tbody>
					</table>
				</div>
				{ lastUpdate && <p className="pull-right">Update terakhir: { lastUpdate }</p> }
			</div>
		</div>
	)
}