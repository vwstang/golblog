import React, { Component, Fragment } from "react";
import { userDBRef } from "../data/firebase";
import helper from "../helper";

import BlogCards from "./BlogCards";

class Home extends Component {
  state = {
    latestPosts: [],
    showType: [],
    caughtUp: false
  }

  getPosts = () => {
    const { latestPosts, showType } = this.state;
    let lastShownPostID;
    latestPosts.length !== 0 ?
      lastShownPostID = latestPosts[latestPosts.length - 1][0] :
      lastShownPostID = null;
    helper.getLatestPosts(lastShownPostID, showType).then(
      res => this.setState({ latestPosts: [...latestPosts].concat(res) }),
      () => this.setState({ caughtUp: true })
    );
  }

  setShowType = e => {
    const type = e.target.id;
    let updateFirst;
    switch (type) {
      case "discover":
        updateFirst = new Promise(resolve => resolve(this.setState({
          latestPosts: [],
          showType: [],
          caughtUp: false
        })));
        updateFirst.then(() => this.getPosts());
        break;
      case "following":
        updateFirst = new Promise(resolve => {
          userDBRef.child(`/${this.props.user.uid}/following`).once("value", snapFollowing => resolve(this.setState({
            latestPosts: [],
            showType: snapFollowing.val() || [],
            caughtUp: false
          })))
        });
        updateFirst.then(() => this.getPosts());
        break;
      case "own":
        updateFirst = new Promise(resolve => resolve(this.setState({
          latestPosts: [],
          showType: [this.props.user.uid],
          caughtUp: false
        })));
        updateFirst.then(() => this.getPosts());
        break;
      default:
        console.log("You're not supposed to be here...");
        break;
    }
  }

  componentDidMount = () => {
    this.getPosts();
  }

  renderWelcome = () => {
    return (
      <main className="welcome wrapper">
        <p>Hi there, thanks for stopping by!</p>
        <p>Welcome to Golblog, a <em>featherweight</em> blogging platform where you can create new blogs, edit its content, publish or unpublish specific blogs, view the blogs, as well as delete them.</p>
        <p>Check out the Blogs pages to view your blogs, and edit them using the edit button.</p>
        <p>Thanks and enjoy!</p>
        <br></br>
        <p>Please login with your Google account to continue</p>
      </main>
    )
  }

  renderHome = () => {
    return (
      <main className="welcome wrapper">
        <ul style={{ "display": "flex" }}>
          <li>
            <button
              id="discover"
              onClick={this.setShowType}
            >Show Discover</button>
          </li>
          <li>
            <button
              id="following"
              onClick={this.setShowType}
            >Show Following</button>
          </li>
          <li>
            <button
              id="own"
              onClick={this.setShowType}
            >Show Own</button>
          </li>
        </ul>
        <div className="card-container">
          <ul className="blog-cards">
            {
              this.state.latestPosts.map(post => {
                return (
                  <BlogCards
                    key={post[0]}
                    postID={post[0]}
                    postTitle={post[1].title}  
                  />
                )
              })
            }
          </ul>
        </div>
        {
          this.state.caughtUp ?
            <p>All caught up!</p> :
            <button style={{"marginTop":"1em"}} onClick={this.getPosts}>Show more</button>
        }
      </main>
    )
  }
  
  render() {
    return (
      <Fragment>
        {this.props.user ? this.renderHome() : this.renderWelcome()}
      </Fragment>
    );
  }
}

export default Home;
