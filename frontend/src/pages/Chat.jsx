// frontend/src/components/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import Avatar from "react-avatar";

// ✅ Use environment variable instead of hardcoded localhost
const socket = io(process.env.REACT_APP_API_URL);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const currentUser = localStorage.getItem("username") || "Guest";
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const message = { text: newMessage, sender: currentUser };
      socket.emit("send_message", message);
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      setShowPicker(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  const toggleEmojiPicker = () => {
    setShowPicker((prev) => !prev);
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-purple-600 text-white shadow-md relative">
        <h1 className="text-xl font-bold">GossipHub</h1>
        <div className="flex gap-2 absolute right-4">
          <button
            onClick={toggleDarkMode}
            className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            Toggle Dark Mode
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-purple-600 font-medium px-4 py-1 rounded hover:bg-purple-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end space-x-2 ${
              msg.sender === currentUser
                ? "justify-end flex-row-reverse"
                : "justify-start"
            }`}
          >
            <Avatar name={msg.sender} size="30" round={true} />
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                msg.sender === currentUser
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800"
              }`}
            >
              <p className="text-sm font-semibold">{msg.sender}</p>
              <div className="text-sm">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showPicker && (
        <div className="absolute bottom-24 left-4 z-10">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      {/* Input */}
      <div className="flex items-center p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <button onClick={toggleEmojiPicker} className="mr-2 text-2xl">😊</button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
