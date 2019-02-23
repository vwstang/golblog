import React, { Component } from "react";
import firebase from "../data/firebase";
import swal from "sweetalert";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
// Components
import Header from "./Header";
import Footer from "./Footer";

// Font Awesome
library.add(faPrint, faEdit, faTrashAlt);

const dbRefBlogs = firebase.database().ref("/blogs");

class BlogList extends Component {
  openEditor = e => window.location.href = `/editor/${e.target.id}`;

  drawList = () => {
    if (this.props.blogDB) {
      return (
        Object.entries(this.props.blogDB).map(post => {
          return (
            <li key={post[0]} className="blog-list__item">
              <span className="blog-list__item__info">
                {post[1].title}
              </span>
              <span className="blog-list__item__info blog-list__item__info--snippet">
                {post[1].draft.join(" ").slice(0, 100)}
              </span>
              <span className="blog-list__item__info">
                {post[1].published ? "Published" : "Draft"}
              </span>
              <span className="blog-list__item__info blog-list__item__info--button">
                <button
                  id={post[0]}
                  data-action="publish"
                  className="btn blog-list__item__link"
                  onClick={this.props.performAction}
                >
                  <FontAwesomeIcon icon="print" />
                </button>
              </span>
              <span className="blog-list__item__info blog-list__item__info--button">
                <button
                  id={post[0]}
                  className="btn blog-list__item__link"
                  onClick={this.openEditor}
                >
                  <FontAwesomeIcon icon="edit" />
                </button>
              </span>
              <span className="blog-list__item__info blog-list__item__info--button">
                <button
                  id={post[0]}
                  data-action="delete"
                  className="btn blog-list__item__link"
                  onClick={this.props.performAction}
                >
                  <FontAwesomeIcon icon="trash-alt" />
                </button>
              </span>
            </li>
          )
        })
      )
    }
  }

  render() {
    return (
      <main className="wrapper">
        <button
          id="btn-new"
          type="button"
          className="btn"
          onClick={this.props.createNew}
        >New Post</button>
        <ul className="list-header">
          <li className="list-header__item">Title</li>
          <li className="list-header__item list-header__item--snippet">Snippet</li>
          <li className="list-header__item">Status</li>
          <li className="list-header__item list-header__item--button">Publish</li>
          <li className="list-header__item list-header__item--button">Edit</li>
          <li className="list-header__item list-header__item--button">Delete</li>
        </ul>
        <ul className="blog-list">
          { this.drawList() }
        </ul>
      </main>
    )
  }
}

class EditBlogs extends Component {
  constructor() {
    super();
    this.state = {
      blogDB: {}
    }
  }

  createNew = () => {
    let postIDMax = 0;
    const initPost = {
      title: "New Blog Post",
      published: false,
      draft: [""]
    }

    dbRefBlogs.once("value").then(snapshot => {
      const snapValue = snapshot.val();
      if (snapValue) {
        const postsList = Object.keys(snapshot.val());
        postIDMax = Math.max(...postsList.map(postID => {
          return parseInt(postID.slice(4));
        }));
        dbRefBlogs.child(`post${postIDMax + 1}`).set(initPost);
      } else {
        dbRefBlogs.child("post1").set(initPost);
      }
      swal({
        text: "New blog post was created.",
        icon: "success"
      })
    });
  }

  performAction = e => {
    const action = e.target.getAttribute("data-action");
    const postID = e.target.id;
    const post = this.state.blogDB[postID];
    switch (action) {
      case "publish":
        const dbPostPublished = dbRefBlogs.child(`${postID}/published`);
        const confirmMsg = post.published ? "unpublish" : "publish";

        swal({
          text: `Are you sure you would like to ${confirmMsg} the post "${post.title}"?`,
          buttons: [true, `${confirmMsg}`],
          icon: "warning"
        }).then(res => {
          if (res) {
            post.published ? dbPostPublished.set(false) : dbPostPublished.set(true);
            swal({
              text: `"${post.title}" was ${confirmMsg}ed successfully.`,
              icon: "success"
            });
          } else {
            swal({
              text: `"${post.title}" was not ${confirmMsg}ed.`,
              icon: "info"
            });
          }
        });
        break;
      case "delete":
        swal({
          text: `Are you sure you would like to delete the post "${post.title}"? (This action cannot be undone)`,
          buttons: [true, "Delete"],
          icon: "warning"
        }).then(res => {
          if (res) {
            dbRefBlogs.child(`${postID}`).remove();
            swal({
              text: `"${post.title}" was deleted.`,
              icon: "success"
            })
          } else {
            swal({
              text: `"${post.title}" was not deleted.`,
              icon: "info"
            })
          }
        });
        break;
      default:
        alert("How did you get to here???");
        break;  
    }
  }
  
  componentDidMount() {
    dbRefBlogs.on("value", snapshot => {
      this.setState({
        blogDB: snapshot.val()
      })
    });
  }

  render() {
    return (
      <div className="page">
        <BlogList
          blogDB={this.state.blogDB}
          performAction={this.performAction}
          createNew={this.createNew}
        />
        <Footer />
      </div>
    )
  }
}

export default EditBlogs;
