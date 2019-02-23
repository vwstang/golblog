import React, { Component } from "react";
import firebase from "../data/firebase";

// Components
import Header from "./Header";
import Footer from "./Footer";

let db = firebase.database();

class Post extends Component {
  constructor() {
    super();
    this.state = {
      currTitle: "",
      currDraft: []
    };
  }

  componentDidMount() {
    db.ref(`blogs/${this.props.match.params.postID}`).on("value", snapshot => {
      const blogDB = snapshot.val();
      this.setState({
        currTitle: blogDB.title,
        currDraft: blogDB.draft
      });
    });
  }

  render() {
    return (
      <div className="page">
        <Header title={this.state.currTitle} breadcrumbs={["top", "home", "blogs"]} />
        <main className="post wrapper">
          {
            this.state.currDraft.map((paragraph, i) => {
              return (
                <p
                  key={`${this.props.match.params.postID}-${i}`}
                  className="post-text"
                >{paragraph}</p>
              )
            })
          }
        </main>
        <Footer />
      </div>
    )
  }
}

export default Post;
