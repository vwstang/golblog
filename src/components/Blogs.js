import React, { Component } from "react";
import { Link } from "react-router-dom";
import { blogDBRef, userDBRef } from "../data/firebase";
import helper from "../helper";


const BlogCards = (props) => {
  return (
    <li className="blog-card">
      <Link to={`/post/${props.postID}`}>
        {props.postTitle}
      </Link>
    </li>
  )
}


class Blogs extends Component {
  state = {
    blogDB: {}
  }

  userBlogsDBRef = userDBRef.child(`/${this.props.user.uid}/posts`);

  componentDidMount = () => {
    // Listen only for changes to the user's list of posts rather than the whole blog node, because if many users make changes at the same time, there's no point refreshing everyone's pages
    this.userBlogsDBRef.on("value", userBlogsSnap => {
      const postList = Object.keys(userBlogsSnap.val() || {});
      helper.getUserPosts(postList).then(blogDB => this.setState({ blogDB }));
    });
  }

  componentWillUnmount() { this.userBlogsDBRef.off("value") }

  render() {
    return (
      <main className="wrapper">
        <Link to="/editblogs">Edit Blogs</Link>
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

export default Blogs;
