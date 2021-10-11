import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import styles from "./Users.module.css";

const Users = ({ setSelectedUser, userId }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    socket.on("users", (u) => {
      console.log("users", u);
      setUsers(u);
    });
    socket.on("user join", (user) => {
      setUsers((prevUsers) => [...prevUsers, user]);
    });
    return () => {
      socket.off("users");
      socket.off("user join");
    };
  }, []);

  return (
    <div className={styles.container}>
      <ul className={styles.users}>
        {users.filter((u) => u.userId !== userId).length ? (
          users
            .filter((u) => u.userId !== userId)
            .map((user) => (
              <li
                className={styles.user}
                key={user.userId}
                onClick={() => setSelectedUser(user)}
              >
                {user.username}
              </li>
            ))
        ) : (
          <li className={styles.user}>Waiting for users to connect.</li>
        )}
      </ul>
    </div>
  );
};

export default Users;
