import React, { Component } from "react";
import { Link } from "react-router-dom";

const BlogCards = (props) => {
  return (
    <li className="blog-card">
      <Link to={`/post/${props.postID}`}>
        {props.postTitle}
      </Link>
    </li>
  )
}

export default BlogCards;
