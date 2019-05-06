import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import swal from 'sweetalert'

import logo from '../static/img/logo.png'

export default props => {
	const openMenu = e => {
		e.currentTarget.classList.toggle('menu-open')
	}

	const notLogin = e => {
		e.preventDefault()
		if(e.target.id === 'tambah'){
			swal('Anda Belum Login!', 'Silahkan Login Untuk Menambah Berkas', 'error')
		}
	}

	return(
		<aside className="main-sidebar sidebar-dark-primary elevation-4">
			<Link to="/" className="brand-link">
				<img src={logo} alt="" className="brand-image elevation-3"/>
				<span className="text-primary">Aplikasi</span> <span className="text-white">Arsip</span>
			</Link>
			<div className="sidebar">
				<nav className="mt-2">
					<ul className="nav nav-pills nav-sidebar flex-column">
						<li className="nav-item">
							<NavLink exact to="/" className="nav-link">
								<i className="nav-icon fa fa-tachometer"></i>
								<p>Dashboard</p>
							</NavLink>
						</li>
						<li className="nav-item has-treeview" onMouseEnter={ openMenu } onMouseLeave={ openMenu } data-toggle="collapse" data-target="#collapseBerkas" aria-expanded="true" aria-controls="collapseBerkas">
							<NavLink to="/berkas" id="berkas" className="nav-link">
								<i className="nav-icon fa fa-archive"></i>
								<p>
									Berkas
									<i className="right fa fa-angle-left"></i>
								</p>
							</NavLink>
							<ul id="collapseBerkas" className="nav nav-treeview">
								<li className="nav-item">
									{ localStorage.getItem('token')
										? <NavLink to="/berkas/tambah" className="nav-link">
												<i className="nav-icon fa fa-circle-o"></i>
												<p>Tambah</p>
											</NavLink>
										: <a href="/" id="tambah" className="nav-link" style={{ cursor: 'pointer' }} onClick={ notLogin }>
												<i className="nav-icon fa fa-circle-o"></i>
												<p>Tambah</p>
											</a>
									}
								</li>
								<li className="nav-item">
									<NavLink to="/berkas/cari" className="nav-link">
										<i className="nav-icon fa fa-circle-o"></i>
										<p>Cari</p>
									</NavLink>
								</li>
							</ul>
						</li>
						<li className="nav-item">
							<NavLink exact to="/monitorlb" className="nav-link">
								<i className="nav-icon fa fa-desktop"></i>
								<p>Monitor SPT LB</p>
							</NavLink>
						</li>
					</ul>
				</nav>
			</div>
		</aside>
	)
}