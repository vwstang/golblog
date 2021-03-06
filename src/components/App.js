import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { auth, provider, userDBRef } from "../data/firebase";

import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Profile from "./Profile";
import Post from "./Post";
import EditBlogs from "./EditBlogs";
import Editor from "./EZEditor";
import NotFound from "./NotFound";

/*** Protected Route ***/
// Must be authenticated in order to access the rest of the app
const PrivateRoute = ({ component: Component, user, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      if (user) {
        return (
          <Component {...props} user={user}/>
        )  
      } else {
        console.log("You must be logged in to view this page.");
        return (
          <Redirect to="/" />
        )
      }
    }} />
  )
}

class App extends Component {
  state = {
    user: null
  };
  
  updateUser = user => this.setState({ user });

  login = e => {
    switch (e.target.id) {
      case "guestLogin":
        const guestUser = {
          uid: "guestUser007",
          photoURL: "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png"
        }
        this.updateUser(guestUser);
        console.log("You are now logged in as Guest");
        userDBRef.once("value", snapshot => {
          if (!snapshot.hasChild(guestUser.uid)) {
            userDBRef.child(guestUser.uid).set({ username: guestUser.uid });
          }
        });
        break;
      case "googleLogin":
        auth.signInWithPopup(provider).then(res => {
          this.updateUser(res.user);
          console.log("You are now logged in");
          userDBRef.once("value", snapshot => {
            if (!snapshot.hasChild(res.user.uid)) {
              userDBRef.child(res.user.uid).set({ username: res.user.uid });
            }
          });
        });
        break;
      default:
        console.log("This code should never run");
        break;
    }
  };
  
  logout = () => auth.signOut().then(() => {
    this.updateUser(null);
    console.log("You have successfully logged out");
    return <Redirect to="/" />;
  });

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    })
  }

  render() {
    const { user } = this.state;
    return (
      <Router>
        <div className={`page ${this.state.user ? "" : "welcomeBG"}`}>
          <Header user={user} login={this.login} logout={this.logout} />
          <Switch>
            <Route exact path="/" render={props => <Home {...props} user={user} />} />
            <PrivateRoute path="/profile/:user" user={user} component={Profile} />
            <PrivateRoute path="/post/:postID" user={user} component={Post} />
            <PrivateRoute path="/editblogs" user={user} component={EditBlogs} />
            <PrivateRoute path="/editor/:postID" user={user} component={Editor} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App;
