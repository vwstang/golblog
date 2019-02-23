import React, { Component } from "react";
import firebase from "../data/firebase";


class Post extends Component {
  state = {
    currTitle: "",
    currContent: []
  };

  dbRef = firebase.database().ref(`blogs/${this.props.match.params.postID}`);

  componentDidMount() {
    this.dbRef.on("value", snapshot => {
      const blogDB = snapshot.val();
      this.setState({
        currTitle: blogDB.title,
        currContent: blogDB.content
      });
    });
  }

  componentWillUnmount() {
    this.dbRef.off("value");
  }

  render() {
    return (
      <main className="post wrapper">
        {
          this.state.currContent.map((paragraph, i) => {
            return (
              <p
                key={`${this.props.match.params.postID}-${i}`}
                className="post-text"
              >{paragraph}</p>
            )
          })
        }
      </main>
    )
  }
}

export default Post;
