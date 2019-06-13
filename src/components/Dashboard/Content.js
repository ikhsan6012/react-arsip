import React from 'react'

export default function Content(props){
	const detail = Object.entries(props.dataDetail.data).map((data, i) => {
		if(data[0] !== 'lastUpdate'){
			return(
				<tr key={ data[0] }>
					{ data[0] === 'total' ? null : <td className="text-center">{ i +1 }</td> }
					{ data[0] === 'total' ? <td colSpan='2'>{ data[0].toUpperCase() }</td> : <td style={{ textTransform: 'capitalize' }}>{ data[0].split('_').join(' ') }</td> }
					<td className="text-center">{ data[1] }</td>
				</tr>
			)
		}
		return false
	})
	let lastUpdate = new Date(parseInt(props.dataDetail.data.lastUpdate)).toLocaleString('id')

	// LIST ITEM
	const ket_berkas = props.ket_berkas.data.map(kb => (
		<div className="col-md-4 col-sm-6 col-12" name="list" value={ kb.kd_berkas } key={ kb.kd_berkas }>
			<div className="info-box">
				<span className="info-box-icon bg-info-gradient">
					<i className="fa fa-star-o"></i>
				</span>
				<div className="info-box-content">
					<span className="info-box-text"  style={{ cursor: 'pointer' }} onClick={ props.getDetail }>{ kb.nama_berkas }</span>
					<span className="info-box-number">{ kb.jumlah }</span>
				</div>
			</div>
			<div className="card" hidden={ props.dataDetail.isHidden }>
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
					{ props.dataDetail.data.lastUpdate ? <p className="pull-right">Update terakhir: { lastUpdate }</p> : null }
				</div>
			</div>
		</div>
	))

	const detailWP = Object.entries(props.dataDetailWP.data).map((data, i) => {
		if(data[0] !== 'lastUpdate'){
			return(
				<tr key={ data[0] }>
					{ i === 4 ? null : <td className="text-center">{ i + 1 }</td> }
					{ i === 4 ? <td colSpan='2'>{ data[0].toUpperCase() }</td> : <td>{ data[0].toUpperCase() }</td> }
					<td className="text-center">{ data[1] }</td>
				</tr>
			)
		}
		return false
	})
	let lastUpdateWP = new Date(parseInt(props.dataDetailWP.data.lastUpdate)).toLocaleString('id')

	return(
		<section className="content">
			<div className="container-fluid">
				<h5 className="md-2">Informasi</h5>
				<div className="row">
					<div className="col-md-4 col-sm-6 col-12" name="list">
						<div className="info-box">
							<span className="info-box-icon bg-info-gradient">
								<i className="fa fa-star-o"></i>
							</span>
							<div className="info-box-content">
								<span className="info-box-text" style={{ cursor: 'pointer' }} onClick={ props.getDetailWP }>
									Wajib Pajak
								</span>
								<span className="info-box-number">{props.wp.jumlah}</span>
							</div>
						</div>
						<div className="card" hidden={ props.dataDetailWP.isHidden }>
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
											{ detailWP }
										</tbody>
									</table>
								</div>
								{ props.dataDetailWP.data.lastUpdate ? <p className="pull-right">Update terakhir: { lastUpdateWP }</p> : null }
							</div>
						</div>
					</div>
					{ ket_berkas }
				</div>
			</div>
		</section>
	)
}