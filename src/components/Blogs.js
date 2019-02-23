import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../data/firebase";
// Components
import Footer from "./Footer";

const dbRefBlogs = firebase.database().ref("/blogs");


class BlogCards extends Component {
  render() {
    return (
      <li className="blog-card">
        <a href={`/post/${this.props.postID}`}>
          {this.props.postTitle}
        </a>
      </li>
    )
  }
}


class Blogs extends Component {
  state = {
    blogDB: {}
  }

  navTo = e => {
    window.location.href = e.target.getAttribute("data-href");
  }

  componentDidMount() {
    dbRefBlogs.on("value", snapshot => {
      this.setState({
        blogDB: snapshot.val() || {}
      });
    });
  }

  render() {
    return (
      <div className="page">
        <main className="wrapper">
          <Link to="/editblogs">Edit Blogs</Link>
          {/* <button
            id="btn-new"
            type="button"
            className="btn"
            data-href="/editblogs"
            onClick={this.navTo}
          >Edit Blogs</button> */}
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
        <Footer />
      </div>
    )
  }
}

export default Blogs;
