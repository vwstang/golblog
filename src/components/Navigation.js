import React, { Component } from "react";

class Crumbs extends Component {
  render() {
    return (
      <ul className={this.props.menulevel}>
        {
          this.props.breadcrumbs.slice(1).map(crumb => {
            // console.log(crumb, typeof crumb);
            if (typeof crumb === "object") {
              return (
                <li key={crumb[0]} className="menu-item">
                  <a className="menu-link" href={`/${crumb[0]}`}>{crumb[0]}</a>
                  <Crumbs breadcrumbs={crumb} menulevel="sub-menu" />
                </li>
              )
            } else if (crumb === "home") {
              return (
                <li key={crumb[0]} className="menu-item">
                  <a className="menu-link" href="/">{crumb}</a>
                </li>
              )
            } else {
              return (
                <li key={crumb[0]} className="menu-item">
                  <a className="menu-link" href={`/${crumb}`}>{crumb}</a>
                </li>
              )
            }
          })
        }
      </ul>
    ) 
  }
}

class Nav extends Component {
  render() {
    return (
      <nav className="navigation wrapper">
        <Crumbs breadcrumbs={this.props.breadcrumbs} menulevel="top-menu" />
      </nav>
    )
  }
}

export default Nav;
