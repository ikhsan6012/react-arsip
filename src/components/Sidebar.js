import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import swal from 'sweetalert'

import logo from '../static/img/logo.png'

const Sidebar = () => {
	const openMenu = e => {
		e.currentTarget.classList.toggle('menu-open')
	}
	
	const notLogin = e => {
		e.preventDefault()
		const id = e.target.id || e.target.parentNode.id
		let msg
		if(id === 'tambah') msg = 'Menambah Berkas'
		if(id === 'monitorlb') msg = 'Untuk Melanjutkan'
		swal('Anda Belum Login!', `Silahkan Login Untuk ${msg}...`, 'error')
			.then(() => {
				const login = document.querySelector('#formLogin button[type=submit]')
				const input = document.querySelector('#formLogin .form-control')
				if(input.hidden) return login.click()
				return input.focus()
			})
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
						<li className="nav-item has-treeview" onMouseEnter={ openMenu } onMouseLeave={ openMenu }>
							<NavLink to="/berkas" id="berkas" className="nav-link">
								<i className="nav-icon fa fa-archive"></i>
								<p>Berkas
									<i className="right fa fa-angle-left"></i>
								</p>
							</NavLink>
							<ul id="collapseBerkas" className="nav nav-treeview">
								<li className="nav-item">
									{ localStorage.getItem('token') ? 
										<NavLink to="/berkas/tambah" className="nav-link">
											<i className="nav-icon fa fa-circle-o"></i>
											<p>Tambah</p>
										</NavLink> : 
										<a href="/" id="tambah" className="nav-link" style={{ cursor: 'pointer' }} onClick={ notLogin }>
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
								{ (localStorage.getItem('token') && localStorage.getItem('status').match(/0|2/)) &&
									<li className="nav-item">
										<NavLink exact to="/berkas/monitor-rekam" className="nav-link">
											<i className="nav-icon fa fa-circle-o"></i>
											<p>Monitoring Perekaman</p>
										</NavLink>
									</li> }
							</ul>
						</li>
						<li className="nav-item">
							{ localStorage.getItem('token') ? 
								<NavLink exact to="/monitor-peminjaman" className="nav-link">
									<i className="nav-icon fa fa-exchange"></i>
									<p>Monitor Peminjaman</p>
								</NavLink> : 
								<a href="/" id="monitor-peminjaman" className="nav-link" style={{ cursor: 'pointer' }} onClick={ notLogin }>
									<i className="nav-icon fa fa-exchange"></i>
									<p>Monitor Peminjaman</p>
								</a>
							}
						</li>
						<li className="nav-item">
							{ localStorage.getItem('token') ? 
								<NavLink exact to="/monitorlb" className="nav-link">
									<i className="nav-icon fa fa-desktop"></i>
									<p>Monitor SPT LB</p>
								</NavLink> : 
								<a href="/" id="monitorlb" className="nav-link" style={{ cursor: 'pointer' }} onClick={ notLogin }>
									<i className="nav-icon fa fa-desktop"></i>
									<p>Monitor SPT LB</p>
								</a>
							}
						</li>
					</ul>
				</nav>
			</div>
		</aside>
	)
}
export default Sidebar