import { useState, useEffect } from "react";
import "./App.css";
import chatApi from "./api/chat";
import socket from "./utils/socket";
import AuthForm from "./components/AuthForm/AuthForm";
import Chat from "./components/Chat/Chat";
import jwt_decode from "jwt-decode";

function App() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setToken(token);
      chatApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      socket.auth = {
        username: username,
        userId: jwt_decode(token).userId,
      };
      socket.connect();
    }
  }, []);
  return (
    <div className="App">
      {token ? (
        <Chat userId={jwt_decode(token).userId} />
      ) : (
        <AuthForm setToken={setToken} />
      )}
    </div>
  );
}

export default App;
