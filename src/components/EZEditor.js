import React, { Component } from "react";
import { blogDBRef } from "../data/firebase";
import swal from "sweetalert";

// let db = firebase.database();

class Editor extends Component {
  state = {
    currTitle: "",
    currContent: [],
    chgsUnsaved: false
  };

  currPostRef = blogDBRef.child(`/${this.props.match.params.postID}`);

  updateDraft = e => {
    switch (e.target.id) {
      case "currTitle":
        this.setState({
          [e.target.id]: e.target.value,
          chgsUnsaved: true
        })
        break;
      case "currContent":
        this.setState({
          [e.target.id]: e.target.value.split("\n"),
          chgsUnsaved: true
        })
        break;
      default:
        console.log("This code should not be run.");
        break;
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    this.currPostRef.child("/title").set(this.state.currTitle);
    this.currPostRef.child("/content").set(this.state.currContent);

    swal({
      icon: "success",
      text: "Draft saved",
      button: "Thanks!"
    });

    this.setState({ chgsUnsaved: false });
  }

  componentDidMount = () => {
    this.currPostRef.on("value", snapshot => {
      const currPost = snapshot.val();
      this.setState({
        currTitle: currPost.title,
        currContent: currPost.content
      });
    });
  }

  componentDidUpdate = () => {
    
  }

  componentWillUnmount = () => {
    this.currPostRef.off("value");
  }

  render() {
    return (
      <main className="editor wrapper">
        <form onSubmit={this.handleSubmit}>
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
            id="currContent"
            className="draft-editor"
            placeholder="What was I up to..."
            value={this.state.currContent.join("\n")}
            onChange={this.updateDraft}
          ></textarea>
          <button
            className="btn btn-save"
            type="submit"
          >Save Draft</button>
        </form>
      </main>
    )
  }
}

export default Editor;
