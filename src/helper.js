import { userDBRef, blogDBRef } from "./data/firebase";

const helper = {};

helper.getAllUsernames = () => {
  userDBRef.once("value", snapshot => {
    const allUsers = Object.values(snapshot.val() || {});
    let allUsernames = [];
    allUsers.forEach(user => allUsernames.push(user.username));
    return allUsernames;
  });
};

helper.getUserPosts = postList => {
  return new Promise((resolve, reject) => {
    blogDBRef.once("value", snapBlogNode => {
      const blogDB = { ...snapBlogNode.val() };
      let userBlogDB = {};
      postList.forEach(post => userBlogDB[post] = blogDB[post]);
      resolve(userBlogDB);
    });
  });
};

helper.sortPosts = postList => postList.sort((a, b) => {
  if (a[0] > b[0]) {
    return -1;
  } else {
    return 1;
  }
});

helper.getLatestPosts = (lastShownPostID, showType) => {
  return new Promise((resolve, reject) => {
    console.log(showType, showType.length);
    blogDBRef.once("value", snapBlogNode => {
      let unsortedBlogDB = Object.entries({ ...snapBlogNode.val() }).filter(post => {
        if (showType.length === 0) {
          if (post[1].published) return true;
          return false;
        } else {
          if (post[1].published && showType.includes(post[1].author)) return true;
          return false;
        }
      });
      
      const blogDB = helper.sortPosts(unsortedBlogDB);
      
      let startIndex;
      lastShownPostID ? startIndex = blogDB.map(post => post[0]).indexOf(lastShownPostID) + 1 : startIndex = 0;
      if (startIndex === blogDB.length) {
        reject();
      }
      resolve(blogDB.slice(startIndex, startIndex + 3));
    })
  })
}

export default helper;
