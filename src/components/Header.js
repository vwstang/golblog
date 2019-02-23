import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <header className="hero-banner">
        <nav style={{"display":"flex","flexdirection":"row","justifyContent":"space-between"}}>
          <ul className="top-menu">
            <li className="menu-item">
              <Link to="/" className="menu-link">Home</Link>
            </li>
            <li className="menu-item">
              <Link to="/blogs" className="menu-link">Blogs</Link>
            </li>
          </ul>
          <ul className="top-menu">
            {
              this.props.user ?
                <li className="menu-item">
                  <button className="btn-auth" onClick={this.props.logout}>Logout</button>
                </li> :
                <li className="menu-item">
                  <button className="btn-auth" onClick={this.props.login}>Login</button>
                </li>
            }
          </ul>
        </nav>
      </header>
    )
  }
}

export default Header;