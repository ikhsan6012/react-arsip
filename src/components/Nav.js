import React from 'react'

export default function Nav(props) {
	return(
		<nav className="main-header navbar navbar-expand bg-white navbar-light border-bottom">
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					{ localStorage.getItem('token')
						? <button className="btn btn-danger" onClick={ props.logout }>Logout</button>
						: <form className="form-inline" id="formLogin">
								<li className="nav-item mr-2">
									<div className="input-group">
										<input type="text" className="form-control" placeholder="Username" hidden={ props.isHiddenLogin }/>
									</div>
								</li>
								<li className="nav-item mr-2">
									<div className="input-group">
										<input type="password" className="form-control" placeholder="Password" hidden={ props.isHiddenLogin }/>
									</div>
								</li>
								<li className="nav-item mr-2">
									<button type="reset" className="btn btn-secondary" hidden={ props.isHiddenLogin } onClick={ props.showLogin }>Batal</button>
								</li>
								<li className="nav-item">
									<button type="submit" className="btn btn-primary" onClick={ props.isHiddenLogin ? props.showLogin : props.login }>Login</button>
								</li>
							</form>
					}
				</li>
			</ul>
		</nav>
	)
}