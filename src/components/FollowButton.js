import React, { Component, Fragment } from "react";
import { userDBRef } from "../data/firebase";

import helper from "../helper";

class FollowButton extends Component {
  state = { followed: false };

  userFollowDBRef = userDBRef.child(`/${this.props.userID}/following`);

  handleClick = () => {
    const { followed } = this.state;
    helper.getUID(this.props.profile).then(uid => {
      this.userFollowDBRef.once("value", snapshot => {
        let newFollowList = [...(snapshot.val() || [])];
        if (followed) {
          this.userFollowDBRef.set(newFollowList.filter(followID => followID !== uid));
          this.setState({ followed: false });
        } else {
          this.userFollowDBRef.set(newFollowList.concat(uid));
          this.setState({ followed: true });
        }
      });
    });
  }

  componentDidMount = () => helper.getUID(this.props.profile).then(uid => {
    this.userFollowDBRef.once("value", snapshot => {
      this.setState({ followed: (snapshot.val() || []).includes(uid) });
    });
  });

  render() {
    return (
      <Fragment>
        {
          this.state.followed ?
            <button className="btn-follow" onClick={this.handleClick}>Unfollow</button> :
            <button className="btn-follow" onClick={this.handleClick}>Follow</button>
        }
      </Fragment>
    )
  }
}

export default FollowButton;
