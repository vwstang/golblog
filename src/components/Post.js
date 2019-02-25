import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { blogDBRef } from "../data/firebase";
import helper from "../helper";

const defaultBG = "https://images.unsplash.com/photo-1500444974567-9f77135bd688?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1616&q=80";

class Post extends Component {
  state = {
    postAuthor: "",
    postTitle: "",
    postBG: "",
    postContent: []
  };

  componentDidMount() {
    blogDBRef.child(`/${this.props.match.params.postID}`).once("value")
      .then(snapshot => {
        const post = snapshot.val();
        helper.getUsername(post.author).then(username => this.setState({
          postAuthor: username,
          postBG: post.background || defaultBG,
          postTitle: post.title,
          postContent: post.content
        }));
      });
  }

  render() {
    const { postAuthor, postTitle, postContent } = this.state;
    const { postID } = this.props.match.params;
    return (
      <Fragment>
        <aside
          style={{ "backgroundImage": `url(${this.state.postBG}` }}
          className="banner">
        </aside>
        <main className="post wrapper">
          <h2 className="post__title">{postTitle}</h2>
          <h4 className="post__details"><span className="post__details__postedBy">Posted by:</span> <Link to={`/profile/${postAuthor}`}>{postAuthor}</Link></h4>
          {
            postContent.map((paragraph, i) => {
              return (
                paragraph === "" ?
                  <br key={`${postID}-${i}`}></br> :
                  <p
                    key={`${postID}-${i}`}
                    className="post-text"
                  >{paragraph}</p>
              )
            })
          }
        </main>
      </Fragment>
    )
  }
}

export default Post;
