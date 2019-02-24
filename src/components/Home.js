import React, { Component } from "react";

class Home extends Component {
  render() {
    return (
      <main className="welcome wrapper">
        {
          this.props.user ?
            <div>
              <p>Hi there, thanks for stopping by!</p>
              <p>Welcome to YiBuRo Blog, a <em>featherweight</em> blogging platform where you can create new blogs, edit its content, publish or unpublish specific blogs, view the blogs, as well as delete them.</p>
              <p>Check out the Blogs pages to view your blogs, and edit them using the edit button.</p>
              <p>Thanks and enjoy!</p>
            </div> :
            <div>
              <p>Hi there, thanks for stopping by!</p>
              <p>Welcome to Golblog, a <em>featherweight</em> blogging platform where you can create new blogs, edit its content, publish or unpublish specific blogs, view the blogs, as well as delete them.</p>
              <p>Check out the Blogs pages to view your blogs, and edit them using the edit button.</p>
              <p>Thanks and enjoy!</p>
              <br></br>
              <p>Please login with your Google account to continue</p>
            </div>
        }
      </main>
    );
  }
}

export default Home;
