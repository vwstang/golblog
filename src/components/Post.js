import React, { Component } from "react";
import { Link } from "react-router-dom";
import { blogDBRef } from "../data/firebase";
import helper from "../helper";


class Post extends Component {
  state = {
    postAuthor: "",
    postTitle: "",
    postContent: []
  };

  // currPostDBRef = blogDBRef.child(`/${this.props.match.params.postID}`);

  componentDidMount() {

    blogDBRef.child(`/${this.props.match.params.postID}`).once("value")
      .then(snapshot => {
        const post = snapshot.val();
        helper.getUsername(post.author).then(username => this.setState({
          postAuthor: username,
          postTitle: post.title,
          postContent: post.content
        }));
      });
  }

  render() {
    const { postAuthor, postTitle, postContent } = this.state;
    const { postID } = this.props.match.params;
    return (
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
    )
  }
}

export default Post;
