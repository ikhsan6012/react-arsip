import React, { Fragment, useState } from 'react'
import { login, logout } from '../functions/auth'

const Nav = () => {
	const [isHiddenLogin, setIsHiddenLogin] = useState(true)

	const showLogin = e => {
		e.preventDefault()
		setIsHiddenLogin(!isHiddenLogin)
    setTimeout(() => {
			const form = document.querySelectorAll('#formLogin .form-control')
      if(isHiddenLogin){
        form[0].focus()
      } else {
        form.forEach(input => input.value = '')
      }
    }, 100)
	}

	return(
		<nav className="main-header navbar navbar-expand bg-white navbar-light border-bottom">
			<ul className="navbar-nav ml-auto">
				{ localStorage.getItem('token') && localStorage.getItem('user') ? 
					<Fragment>
						<li className="nav-item align-middle mr-2 dropdown" title="Ganti Password">
							<div className="nav-link dropdown-toggle" style={{ cursor: 'pointer' }}>{ JSON.parse(localStorage.getItem('user')).nama }</div>
						</li>
						<li className="nav-item">
							<button className="btn btn-danger" onClick={ logout }>Logout</button>
						</li>
					</Fragment> :
					<form className="form-inline" id="formLogin">
						<li className="nav-item mr-2">
							<div className="input-group">
								<input type="text" className="form-control" placeholder="Username" hidden={ isHiddenLogin }/>
							</div>
						</li>
						<li className="nav-item mr-2">
							<div className="input-group">
								<input type="password" className="form-control" placeholder="Password" hidden={ isHiddenLogin }/>
							</div>
						</li>
						<li className="nav-item mr-2">
							<button type="reset" className="btn btn-secondary" hidden={ isHiddenLogin } onClick={ showLogin }>Batal</button>
						</li>
						<li className="nav-item">
							<button type="submit" className="btn btn-primary" onClick={ isHiddenLogin ? showLogin : login }>Login</button>
						</li>
					</form>
				}
			</ul>
		</nav>
	)
}
export default Nav