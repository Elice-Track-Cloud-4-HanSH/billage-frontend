import { useState, useEffect, useRef } from 'react';
import '@/styles/chatting/ChatPage.css';
import ChatPageFooter from '@/components/chatting/ChatPageFooter';
import ChatPageHeader from '@/components/chatting/ChatPageHeader';
import ChatItem from '@/components/chatting/ChatItem';
import { Client } from '@stomp/stompjs';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Container, Button } from 'react-bootstrap';
import queryString from 'query-string'; // query-string 라이브러리 사용

// 사용 예시
const ChatPage = () => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [page, setPage] = useState(0);
  const [chats, setChats] = useState([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isNewMessageAvailable, setIsNewMessageAvailable] = useState(false);
  const [isScrollToDownBtnAvailable, setIsScrollToDownBtnAvailable] = useState(false);

  const loadMoreMessageRef = useRef(null);
  const endOfMessageRef = useRef(null);
  const messageContainerRef = useRef(null);

  const { chatroomId } = useParams();

  const location = useLocation(); // 현재 위치 정보 가져오기
  const queryParams = queryString.parse(location.search); // 쿼리 파라미터 파싱
  const myId = queryParams.token;

  // SockJS 연결 후 STOMP 프로토콜 사용
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/connect'),
      debug: (str) => console.log(str),
      connectHeaders: {
        Authorization: myId,
      },
      onConnect: () => {
        setIsConnected(true);

        stompClient.subscribe(`/sub/chat/${chatroomId}`, (message) => {
          const stompMessage = JSON.parse(message.body);

          setChats((prev) => [stompMessage, ...prev]);
          if (stompMessage.sender.id == myId) {
            scrollToBottom();
          } else {
            lockCurrentPosition('WS');
            setIsNewMessageAvailable(true);

            stompClient.publish({
              destination: `/ack/chat/chatting/${stompMessage.chatId}`,
            });
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    if (!loadMoreMessageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchChatData();
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreMessageRef.current);

    return () => observer.disconnect(); // 컴포넌트 언마운트 시 해제
  }, [page]);

  useEffect(() => {
    if (!endOfMessageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsNewMessageAvailable(false);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(endOfMessageRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = messageContainerRef.current;
    const handleScroll = () => {
      if (messageContainerRef.current) {
        if (container.scrollTop < 0.8) setIsScrollToDownBtnAvailable(true);
        else setIsScrollToDownBtnAvailable(false);
      }
    };
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  });

  const lockCurrentPosition = (getPrevFlag) => {
    if (!['DB', 'WS'].includes(getPrevFlag)) return;
    const container = messageContainerRef.current;
    const prevScrollHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;

    setTimeout(() => {
      const afterScrollHeight = container.scrollHeight;
      const diff = afterScrollHeight - prevScrollHeight;

      if (prevScrollTop > 0.8) {
        setIsNewMessageAvailable(false);
      } else {
        container.scrollTop = prevScrollTop + (getPrevFlag === 'DB' ? diff : -diff);
      }
    }, 0);
  };

  const fetchChatData = () => {
    if (!isLastPage) {
      axios({
        baseURL: `/api/chatroom/${chatroomId}`,
        method: 'GET',
        params: {
          page: page,
          lastLoadChatId: page === 0 ? Number.MAX_SAFE_INTEGER : chats[0].chatId,
        },
        headers: {
          token: myId,
        },
      })
        .then((data) => {
          if (!data.data.length) {
            return;
          }
          setPage((prev) => prev + 1);
          setChats((prev) => [...prev, ...data.data]);
          return data;
        })
        .then((data) => {
          if (data.data.length < 50) {
            setIsLastPage(true);
          }
          if (page === 0) {
            scrollToBottom();
          } else {
            lockCurrentPosition('DB');
          }
        })
        .catch(() => {
          setIsLastPage(true);
        });
    }
  };

  const scrollToBottom = () => {
    setIsNewMessageAvailable(false);
    setTimeout(() => {
      endOfMessageRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 0);
  };

  const handleSendMessage = (message) => {
    if (client && isConnected) {
      try {
        client.publish({
          destination: `/pub/chat/${chatroomId}`,
          body: JSON.stringify({
            message: message,
          }),
        });
      } catch (error) {
        console.error('Fail to send message: ', error);
      }
    }
  };

  const formatDate = (timedata) => {
    const now = new Date();
    const messageDate = new Date(timedata);

    // 오늘 날짜인지 확인
    const isToday =
      now.getDate() === messageDate.getDate() &&
      now.getMonth() === messageDate.getMonth() &&
      now.getFullYear() === messageDate.getFullYear();

    // 오늘이라면 시:분, 아니면 월-일
    if (isToday) {
      const hours = messageDate.getHours().toString().padStart(2, '0');
      const minutes = messageDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else {
      const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
      const day = messageDate.getDate().toString().padStart(2, '0');
      return `${month}-${day}`;
    }
  };

  return (
    <Container>
      <ChatPageHeader otherNickname='test' exitButtonHandler={() => console.log('clicked!')} />

      <div ref={messageContainerRef} className='messages-container flex-grow-1'>
        <div ref={endOfMessageRef} className='chat-bottom' style={{ height: '1px' }} />

        {chats.map((message, key) => {
          const isMine = message.sender.id == myId;
          return (
            <ChatItem
              message={message.message}
              createdAt={formatDate(message.createdAt)}
              isMine={isMine}
              key={key}
            />
          );
        })}
        {isLastPage && <p>첫 채팅입니다</p>}
      </div>

      {!isLastPage && (
        <div
          ref={loadMoreMessageRef}
          className='load-more-chats'
          style={{ height: '1px', margin: '1px' }}
        />
      )}

      {isNewMessageAvailable && (
        <Button className='new-message-btn' onClick={scrollToBottom}>
          {'새 메시지'}
          <i className='bi bi-arrow-down'></i>
        </Button>
      )}
      {isScrollToDownBtnAvailable && !isNewMessageAvailable && (
        <Button className='scroll-to-bottom-btn p-0' onClick={scrollToBottom}>
          <i className='bi bi-arrow-down'></i>
        </Button>
      )}
      <ChatPageFooter messageSendHandler={handleSendMessage} />
    </Container>
  );
};

export default ChatPage;
