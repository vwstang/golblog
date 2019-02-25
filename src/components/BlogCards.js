import React from "react";
import { Link } from "react-router-dom";

const BlogCards = (props) => {
  return (
    <li style={{"backgroundImage":`url(${props.postBG})`}} className="blogCard">
      <Link className="blogCard__link" to={`/post/${props.postID}`}>
        <span className="blogCard__title">{props.postTitle}</span>
      </Link>
    </li>
  )
}

export default BlogCards;
