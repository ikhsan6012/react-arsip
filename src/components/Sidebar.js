import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import swal from 'sweetalert'

import logo from '../static/img/logo.png'

export default function Sidebar(props) {
	const openMenu = e => {
		e.currentTarget.classList.toggle('menu-open')
	}

	const notLogin = e => {
		e.preventDefault()
		const msg = e.target.getAttribute('msg') || e.target.parentNode.getAttribute('msg')
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
										: <a href="/" className="nav-link" style={{ cursor: 'pointer' }} onClick={ notLogin } msg="Menambah Berkas">
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
								<li className="nav-item">
									{ localStorage.getItem('token')
										? <NavLink exact to="/berkas/register" className="nav-link">
												<i className="nav-icon fa fa-circle-o"></i>
												<p>Register</p>
											</NavLink>
										: <a href="/" className="nav-link" style={{ cursor: 'pointer' }} onClick={ notLogin } msg="Melakukan Register">
												<i className="nav-icon fa fa-circle-o"></i>
												<p>Register</p>
											</a>
									}
								</li>
							</ul>
						</li>
						<li className="nav-item">
							{ localStorage.getItem('token')
								? <NavLink exact to="/monitorlb" className="nav-link">
										<i className="nav-icon fa fa-desktop"></i>
										<p>Monitor SPT LB</p>
									</NavLink>
								: <a href="/" className="nav-link" style={{ cursor: 'pointer' }} onClick={ notLogin } msg="Melanjutkan">
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