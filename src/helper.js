import { userDBRef } from "./data/firebase";

export default {
  getAllUsernames: () => {
    userDBRef.once("value", snapshot => {
      const allUsers = Object.values(snapshot.val() || {});
      let allUsernames = [];
      allUsers.forEach(user => allUsernames.push(user.username));
      return allUsernames;
    });
  }
};
