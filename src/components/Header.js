import React, { Component } from "react";
import { Link } from "react-router-dom";
import { auth, userDBRef } from "../data/firebase";

class Header extends Component {
  state = { username: "" };

  componentDidMount = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        userDBRef.once("value", snapshot => {
          const username = snapshot.val()[this.props.user.uid].username;
          this.setState({ username });
        });
      }
    })
  }
  
  render() {
    return (
      <header className="hero-banner">
        <nav className="navigation wrapper">
          <ul className="top-menu">
            <li className="menu-item">
              <Link to="/" className="menu-link">Home</Link>
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
        {/* <div className={`banner-image banner-image--${this.props.banner}`}>
          <div className="title-container wrapper">
            <h1 className="title">{this.props.title}</h1>
          </div>
        </div> */}
      </header>
    )
  }
}

export default Header;