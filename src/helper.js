import { userDBRef, blogDBRef } from "./data/firebase";

export default {
  getAllUsernames: () => {
    userDBRef.once("value", snapshot => {
      const allUsers = Object.values(snapshot.val() || {});
      let allUsernames = [];
      allUsers.forEach(user => allUsernames.push(user.username));
      return allUsernames;
    });
  },
  getUserPosts: postList => {
    return new Promise((resolve, reject) => {
      blogDBRef.once("value", snapBlogNode => {
        const blogDB = { ...snapBlogNode.val() };
        let userBlogDB = {};
        postList.forEach(post => userBlogDB[post] = blogDB[post]);
        resolve(userBlogDB);
      });
    });
  }
};
