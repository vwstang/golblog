import React, { Component } from "react";
import { Link } from "react-router-dom";
import { userDBRef } from "../data/firebase";
import helper from "../helper";
import logo from "../assets/logo.png";

class Header extends Component {
  state = { username: "" };

  componentWillReceiveProps = newProps => {
    if (newProps.user) {
      helper.getUsername(newProps.user.uid).then(
        username => this.setState({ username }),
        uid => this.setState({ username: uid }) // This is to account for the scenario where it is the user's very first time logging in, but because state change at App level is faster than setting a new user node in firebase, the Header component renders the profile link before the firebase node exists, thus resulting in a blank page leading to the NotFound component .
      );
    }
  }
  
  render() {
    return (
      <header className="hero-banner">
        <nav className="navigation wrapper">
          <ul className="top-menu">
            <li className="menu-item">
              <Link to="/" className="menu-link">
                <img className="menu-link" src={logo} alt=""/>
              </Link>
            </li>
            {
              this.props.user ?    
                <li className="menu-item">
                  <Link to={`/profile/${this.state.username}`} className="menu-link">Profile</Link>
                </li> :
                null
            }
          </ul>
          <ul className="top-menu">
            {
              this.props.user ?
                <li className="menu-item">
                  <button
                    className="btn-auth"
                    onClick={this.props.logout}
                  >
                    <img className="userPhoto" src={this.props.user.photoURL} alt="" />Logout
                  </button>
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
