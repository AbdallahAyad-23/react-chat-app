import { useEffect, useState, useRef } from "react";
import Spinner from "../Spinner/Spinner";
import chatApi from "../../api/chat";
import socket from "../../utils/socket";
import styles from "./Conversation.module.css";

const Conversation = ({ user: { username, userId }, me }) => {
  const inputRef = useRef();
  const messagesRef = useRef();
  const [content, setContent] = useState("");
  const [convId, setConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const sendMessage = (e) => {
    e.preventDefault();
    setContent("");
    inputRef.current.focus();
    chatApi
      .post("/messages", { content, conversationId: convId })
      .then((res) => {
        setMessages((prevMessages) => [...prevMessages, res.data.message]);
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        socket.emit("chat message", res.data.message);
      });
  };
  useEffect(() => {
    !loading && setLoading(true);
    chatApi.post("/conversations", { member: userId }).then((res) => {
      setConvId(res.data.convId);
      if (!res.data.new) {
        chatApi.get(`/conversations/${res.data.convId}`).then((res) => {
          setLoading(false);
          setMessages(res.data.messages);
        });
      } else {
        setLoading(false);
      }
    });
  }, [userId]);
  useEffect(() => {
    if (convId) {
      socket.emit("join room", convId);
    }
    return () => {
      socket.off("join room");
    };
  }, [convId]);

  useEffect(() => {
    socket.on("private message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off("private message");
    };
  }, []);
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>{username}</h2>

      {loading ? (
        <div className={styles.spinner_container}>
          <Spinner />
        </div>
      ) : (
        <ul className={styles.messages} ref={messagesRef}>
          {messages.map((message) => (
            <li
              key={message._id}
              className={`${styles.message} ${
                message.sender === me ? styles.right : styles.left
              }`}
            >
              {message.content}
            </li>
          ))}
        </ul>
      )}
      <form className={styles.footer} onSubmit={sendMessage}>
        <textarea
          className={styles.input}
          value={content}
          ref={inputRef}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button className={styles.btn} type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Conversation;
