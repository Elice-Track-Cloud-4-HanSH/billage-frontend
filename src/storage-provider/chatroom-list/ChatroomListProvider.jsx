import ChatroomListContext from './ChatroomListContext';
import { useState } from 'react';

const ChatroomListProvider = ({ children }) => {
  const params = new URLSearchParams(window.location.search);
  const cType = params.get('type') || 'ALL';
  const [chatType, setChatType] = useState(cType);
  const [page, setPage] = useState(0);
  const [chatroomList, setChatroomList] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ChatroomListContext.Provider
      value={{
        chatType,
        setChatType,
        page,
        setPage,
        chatroomList,
        setChatroomList,
        isLast,
        setIsLast,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ChatroomListContext.Provider>
  );
};

export default ChatroomListProvider;
