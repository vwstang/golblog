import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { auth, provider } from "../data/firebase";

import Header from "./Header";
import Home from "./Home";
import Blogs from "./Blogs";
import Post from "./Post";
import EditBlogs from "./EditBlogs";
import Editor from "./EZEditor";
import NotFound from "./NotFound";

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
  }
  
  updateUser = user => this.setState({ user });

  login = () => auth.signInWithPopup(provider).then(res => this.updateUser(res.user));
  
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
        <div>
          <Header user={user} login={this.login} logout={this.logout} />
          <Switch>
            <Route exact path="/" render={props => <Home {...props} user={user} />} />
            <PrivateRoute path="/blogs" user={user} component={Blogs} />
            <PrivateRoute path="/post/:postID" user={user} component={Post} />
            <PrivateRoute path="/editblogs" user={user} component={EditBlogs} />
            <PrivateRoute path="/editor/:postID" user={user} component={Editor} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;