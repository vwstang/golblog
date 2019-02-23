import React, { Component } from "react";
import firebase from "../data/firebase";
import swal from "sweetalert";

// Components
import Header from "./Header";
import Footer from "./Footer";

let db = firebase.database();

class Editor extends Component {
  constructor() {
    super();
    this.state = {
      currTitle: "",
      currDraft: []
    };
  }

  updateDraft = e => {
    switch (e.target.id) {
      case "currTitle":
        this.setState({
          [e.target.id]: e.target.value
        })
        break;
      case "currDraft":
        this.setState({
          [e.target.id]: e.target.value.split("\n")
        })
        break;
      default:
        console.log("This code should not be run.");
        break;
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    db.ref(`/blogs/${this.props.match.params.postID}/title`).set(this.state.currTitle);
    db.ref(`/blogs/${this.props.match.params.postID}/draft`).set(this.state.currDraft);

    swal({
      icon: "success",
      text: "Draft saved",
      button: "Thanks!"
    });
  }

  componentDidMount() {
    db.ref("/blogs").on("value", snapshot => {
      const blogDB = snapshot.val();
      if (blogDB[this.props.match.params.postID].title === "") {
        blogDB[this.props.match.params.postID].title = "New Blog Post";
      }
      this.setState({
        currTitle: blogDB[this.props.match.params.postID].title,
        currDraft: blogDB[this.props.match.params.postID].draft
      })
    });
    // Add auto save timer
  }

  componentWillUnmount() {
    // Auto save timer to close
  }

  render() {
    return (
      <div className="page">
        <Header title={this.state.currTitle} breadcrumbs={["top", "home", "blogs"]} />
        <main className="editor wrapper">
          <form onSubmit={this.handleSubmit} action="">
            <label
              className="draft-title draft-title--label"
              htmlFor="draftTitle"
            >Blog Title</label>
            <input
              id="currTitle"
              className="draft-title"
              type="text"
              value={this.state.currTitle}
              onChange={this.updateDraft}
            />
            <textarea
              id="currDraft"
              className="draft-editor"
              placeholder="What was I up to..."
              value={this.state.currDraft.join("\n")}
              onChange={this.updateDraft}
            ></textarea>
            <button
              className="btn btn-save"
              type="submit"
            >Save Draft</button>
          </form>
        </main>
        <Footer />
      </div>
    )
  }
}

export default Editor;
