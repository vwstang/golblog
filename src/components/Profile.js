import React, { Component } from "react";
import { Link } from "react-router-dom";

import { userDBRef } from "../data/firebase";
import helper from "../helper";

import FollowButton from "./FollowButton";
import BlogCards from "./BlogCards";


class Profile extends Component {
  state = { ownPage: false, blogDB: {} };

  updateBlogDB = username => {
    // Listen only for changes to the user's list of posts rather than the whole blog node, because if many users make changes at the same time, there's no point refreshing everyone's pages
    helper.getUID(username).then(uid => {
      const ownPage = this.props.user.uid === uid;
      userDBRef.child(`/${uid}/posts`).once("value", userBlogsSnap => {
        const postList = Object.keys(userBlogsSnap.val() || {});
        helper.getUserPosts(postList).then(blogDB => this.setState({ ownPage, blogDB }));
      });
    });
  }

  componentWillReceiveProps = newProps => this.updateBlogDB(newProps.match.params.user);

  componentDidMount = () => this.updateBlogDB(this.props.match.params.user);

  render() {
    return (
      <main className="profile wrapper">
        <h2 className="profile__title">{this.props.match.params.user}</h2>
        {
          this.state.ownPage ?
            <Link to="/editblogs">Edit Blogs</Link> :
            <FollowButton userID={this.props.user.uid} profile={this.props.match.params.user} />
        }
        <div className="card-container">
          <ul className="blog-cards">
            {
              Object.entries(this.state.blogDB)
                .filter(post => {
                  return post[1].published === true
                })
                .map(post => {
                return (
                  <BlogCards
                    key={post[0]}
                    postID={post[0]}
                    postTitle={post[1].title}
                    postBG={post[1].background}
                  />
                )
              })
            }
          </ul>
        </div>
      </main>
    )
  }
}

export default Profile;
