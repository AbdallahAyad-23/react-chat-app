import React, { useState } from "react";
import Users from "../Users/Users";
import Conversation from "../Conversation/Conversation";
import styles from "./Chat.module.css";
const Chat = ({ userId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div className={styles.container}>
      <Users userId={userId} setSelectedUser={setSelectedUser} />
      {selectedUser && <Conversation me={userId} user={selectedUser} />}
    </div>
  );
};

export default Chat;
