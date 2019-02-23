import React, { Component } from "react";
import { Link } from "react-router-dom";
import { blogDBRef, userDBRef } from "../data/firebase";


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

  componentDidMount() {
    // Listen only for changes to the user's list of posts rather than the whole blog node, because if many users make changes at the same time, there's no point refreshing everyone's pages
    this.userBlogsDBRef.once("value", snapshot => {
      const postList = Object.keys(snapshot.val() || {});
    });
    // blogDBRef.on("value", snapshot => {
    //   this.setState({
    //     blogDB: snapshot.val() || {}
    //   });
    // });
  }

  // componentWillUnmount() { this.userBlogsDBRef.off("value") }

  render() {
    return (
      <main className="wrapper">
        {
          console.log(this.props.match.params.user)
        }
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
