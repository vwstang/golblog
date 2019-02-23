import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../data/firebase";

const blogsDBRef = firebase.database().ref("/blogs");


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

  componentDidMount() {
    blogsDBRef.on("value", snapshot => {
      this.setState({
        blogDB: snapshot.val() || {}
      });
    });
  }

  componentWillUnmount() { blogsDBRef.off("value") }

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
