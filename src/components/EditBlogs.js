import React, { Component } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { blogDBRef, userDBRef } from "../data/firebase";
import helper from "../helper";

library.add(faPrint, faEdit, faTrashAlt);


class BlogList extends Component {
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
                {post[1].content.join(" ").slice(0, 100)}
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
                <Link to={`/editor/${post[0]}`} className="btn blog-list__item__link">
                  <FontAwesomeIcon icon="edit" />
                </Link>
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
  state = { blogDB: {} };

  currUserDBRef = userDBRef.child(`/${this.props.user.uid}`);

  createNew = () => {
    // Deconstruction for easier access
    const { uid } = this.props.user;

    // Default post values
    const initPost = {
      author: uid,
      background: "https://images.unsplash.com/photo-1500444974567-9f77135bd688?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1616&q=80",
      title: "New Blog Post",
      content: ["Lorem ipsum"],
      published: false
    }

    // Blog post ID represented by concatenation of current unix time and user iD
    const newID = `${Date.now()}${uid}`;
    blogDBRef.child(newID).set(initPost);

    let postList;
    this.currUserDBRef.child("/posts").once("value", snapshot => {
      postList = { ...snapshot.val(), [newID]: false };
      this.currUserDBRef.child("/posts").set(postList);
    });

    // Inform user of successful blog post creation
    swal({
      text: "New blog post was created.",
      icon: "success"
    });
  }

  performAction = e => {
    const action = e.target.getAttribute("data-action");
    const postID = e.target.id;
    const post = this.state.blogDB[postID];

    switch (action) {
      case "publish":
        const dbPostPublished = blogDBRef.child(`${postID}/published`);
        const confirmMsg = post.published ? "unpublish" : "publish";
        swal({
          text: `Are you sure you would like to ${confirmMsg} the post "${post.title}"?`,
          buttons: [true, `${confirmMsg}`],
          icon: "warning"
        }).then(res => {
          if (res) {
            if (post.published) {
              dbPostPublished.set(false);
              this.currUserDBRef.child(`/posts/${postID}`).set(false);
            } else {
              dbPostPublished.set(true);
              this.currUserDBRef.child(`/posts/${postID}`).set(true);
            }
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
            this.currUserDBRef.child("/posts").once("value", snapshot => {
              const newPostList = { ...snapshot.val() };
              delete newPostList[postID];
              this.currUserDBRef.child("/posts").set(newPostList);
            });
            blogDBRef.child(`${postID}`).remove();
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
    this.currUserDBRef.child("/posts").on("value", snapshot => {
      const postList = Object.keys(snapshot.val() || {});
      helper.getUserPosts(postList).then(blogDB => this.setState({ blogDB }));
      // blogDBRef.once("value", blogSnap => {
      //   const tempBlogDB = { ...blogSnap.val() };
      //   let userBlogDB = {};
      //   postList.forEach(post => userBlogDB[post] = tempBlogDB[post]);
      //   this.setState({ blogDB: userBlogDB });
      // })
    });
  }

  componentWillUnmount() {
    this.currUserDBRef.child("/posts").off("value");
  }

  render() {
    return (
      <BlogList
        blogDB={this.state.blogDB}
        performAction={this.performAction}
        createNew={this.createNew}
      />
    )
  }
}

export default EditBlogs;
