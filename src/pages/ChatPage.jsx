import { useState, useEffect, useRef } from 'react';
import '@/styles/chatting/ChatPage.css';
import ChatPageFooter from '@/components/chatting/ChatPageFooter';
import ChatPageHeader from '@/components/chatting/ChatPageHeader';
import ChatItem from '@/components/chatting/ChatItem';
import { Client } from '@stomp/stompjs';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Col, Container, Row } from 'react-bootstrap';
import queryString from 'query-string'; // query-string 라이브러리 사용
import { timeDiffFormat } from '@/utils';

// 사용 예시
const ChatPage = () => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [page, setPage] = useState(0);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const loadMoreMessageRef = useRef(null);
  const endOfMessageRef = useRef(null);
  const isFirstRenderRef = useRef(true);

  const { chatroomId } = useParams();

  const location = useLocation(); // 현재 위치 정보 가져오기
  const queryParams = queryString.parse(location.search); // 쿼리 파라미터 파싱
  const myId = queryParams.token;

  useEffect(() => {
    if (!isFirstLoad) {
      setCanLoadMore(true);
    }
  }, [isFirstLoad]);

  // SockJS 연결 후 STOMP 프로토콜 사용
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/connect'),
      debug: (str) => console.log(str),
      connectHeaders: {
        Authorization: myId,
      },
      onConnect: () => {
        console.log('STOMP 연결 성공');
        setIsConnected(true);

        stompClient.subscribe(`/sub/chat/${chatroomId}`, (message) => {
          const stompMessage = JSON.parse(message.body);
          setChats((prev) => [...prev, stompMessage]);
          if (stompMessage.sender.id == myId) {
            scrollToBottom();
          }
          if (stompMessage.sender.id != myId) {
            // ACK 보내기
            stompClient.publish({
              destination: `/ack/chat/chatting/${stompMessage.chatId}`,
            });
          }
        });
      },
      onDisconnect: () => {
        console.log('STOMP 연결 종료');
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
    setIsLoading(true);
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
          console.log(chats[0]);
          setChats((prev) => [...data.data.reverse(), ...prev]);
          if (data.data.length < 50) {
            setIsLastPage(true);
          }
          if (page === 0) {
            setTimeout(() => {
              scrollToBottom();
              isFirstRenderRef.current = false;
            }, 0);
          }
        })
        .catch(() => {
          setIsLastPage(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [page]);

  useEffect(() => {
    if (!loadMoreMessageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFirstRenderRef.current && !isLoading && !isLastPage) {
          handleIncreasePage();
        }
      },
      {
        root: document.querySelector('.messages-container'),
        threshold: 0.1,
      } // 불러와지지 않는다면 threshold 값을 수정해보자
    );

    if (!isFirstRenderRef.current) {
      observer.observe(loadMoreMessageRef.current);
    }

    return () => observer.disconnect(); // 컴포넌트 언마운트 시 해제
  }, [isLoading, isLastPage]);

  const scrollToBottom = () => {
    setTimeout(() => {
      endOfMessageRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 0);
  };

  const handleIncreasePage = () => {
    if (!isLoading && !isLastPage) {
      setPage((prev) => prev + 1);
    }
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
      <ChatPageHeader otherNickname='test' />

      <Row className='chat-body flex-grow-1'>
        <Col>
          <div className='messages-container'>
            {isLastPage && <p>첫 채팅입니다</p>}
            {!isLastPage && (
              <div
                ref={loadMoreMessageRef}
                className='load-more-chats'
                style={{ height: isFirstLoad ? '0px' : '10px' }}
              />
            )}
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
            <div ref={endOfMessageRef} className='chat-bottom' style={{ height: '1px' }} />
          </div>
        </Col>
      </Row>

      <ChatPageFooter messageSendHandler={handleSendMessage} />
    </Container>
  );
};

export default ChatPage;
