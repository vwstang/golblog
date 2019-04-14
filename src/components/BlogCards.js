import React from "react";
import { Link } from "react-router-dom";

const BlogCards = (props) => {
  const { postID, postBG, postTitle } = props;
  let title = "";

  postTitle.length > 120 ?
    title = `${postTitle.slice(0, 117)}...` :
    title = postTitle;

  return (
    <li style={{"backgroundImage":`url(${postBG})`}} className="blogCard">
      <Link className="blogCard__link" to={`/post/${postID}`}>
        <span className="blogCard__title">{title}</span>
      </Link>
    </li>
  )
}

export default BlogCards;
