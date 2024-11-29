import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/chatting/ChatroomList.css';
import ChatroomItem from '@/components/chatting/ChatroomItem.jsx';
import ChatroomTypeButtons from '@/components/chatting/ChatroomTypeButtons';

const ChatroomList = () => {
  const [chatroomList, setChatroomList] = useState([]);
  const [chatType, setChatType] = useState('ALL');
  const [page, setPage] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const myToken = 1;

  const observerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          pageHandler(); // 페이지 증가
        }
      },
      { threshold: 0.1 } // 불러와지지 않는다면 threshold 값을 수정해보자
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect(); // 컴포넌트 언마운트 시 해제
  }, [isLoading]);

  useEffect(() => {
    loadMoreChatroom(chatType, page);
  }, [chatType, page]);

  // page는 증가만 존재한다. 이전꺼로 가려면 스크롤하여 위로 올라가면 된다.
  const pageHandler = () => {
    if (!isLoading && !isLast) setPage((prev) => prev + 1);
  };

  const changeChatTypeHandler = (data) => {
    setChatType(data);
    setPage(0);
    setChatroomList([]);
    setIsLast(false);
  };

  const loadMoreChatroom = (chatType, page) => {
    setIsLoading(true);
    axios({
      method: 'GET',
      url: '/api/chatroom',
      params: {
        type: chatType,
        page: page,
      },
      headers: {
        token: myToken,
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.length === 0) setIsLast(true);
        setChatroomList((prev) => [...prev, ...data]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setCurrentTime(Date.now());
  };

  const navigateToChatroom = (chatroomId) => {
    navigate(`/chat/${chatroomId}`);
  };

  return (
    <div className='chatroom-list-container'>
      <ChatroomTypeButtons handleTypeChange={changeChatTypeHandler} />
      <div className='chatroom-list'>
        {chatroomList.map((chatroom) => (
          <ChatroomItem
            key={chatroom.chatroomId}
            chatroom={chatroom}
            currentTime={currentTime}
            myId={myToken}
            onClick={() => navigateToChatroom(chatroom.chatroomId)}
          />
        ))}
        <div ref={observerRef} style={{ height: '1px' }} />
        {isLast && <p> 마지막 채팅입니다 </p>}
      </div>
    </div>
  );
};

export default ChatroomList;
