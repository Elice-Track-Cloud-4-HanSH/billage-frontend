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

  const loadMoreMessageRef = useRef(null);
  const endOfMessageRef = useRef(null);
  const isFirstLoad = useRef(true);

  const { chatroomId } = useParams();

  const location = useLocation(); // 현재 위치 정보 가져오기
  const queryParams = queryString.parse(location.search); // 쿼리 파라미터 파싱
  console.log(location.search, queryParams);
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
        console.log('STOMP 연결 성공');
        setIsConnected(true);

        stompClient.subscribe(`/sub/chat/${chatroomId}`, (message) => {
          console.log('메세지 송신: ' + message.body);
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
  }, [chatroomId]);

  useEffect(() => {
    setIsLoading(true);
    axios({
      baseURL: `/api/chatroom/${chatroomId}`,
      method: 'GET',
      params: {
        page: page,
      },
      headers: {
        token: myId,
      },
    })
      .then((data) => {
        setChats((prev) => [...data.data.reverse(), ...prev]);
        if (data.data.length < 50) {
          setIsLastPage(true);
        }
        if (isFirstLoad.current) {
          setTimeout(() => {
            scrollToBottom();
            isFirstLoad.current = false;
          }, 0); // 최소 지연 시간으로 DOM 업데이트를 기다림
        }
        console.log(data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [chatroomId, page]);

  useEffect(() => {
    if (!loadMoreMessageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleIncreasePage();
        }
      },
      { threshold: 0.1 } // 불러와지지 않는다면 threshold 값을 수정해보자
    );

    observer.observe(loadMoreMessageRef.current);

    return () => observer.disconnect(); // 컴포넌트 언마운트 시 해제
  }, []);

  const scrollToBottom = () => {
    endOfMessageRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  const handleIncreasePage = () => {
    if (!isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSendMessage = (message) => {
    if (client && isConnected) {
      client.publish({
        destination: `/pub/chat/${chatroomId}`,
        body: {
          message: message,
        },
      });
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
            {!isLastPage && <div ref={loadMoreMessageRef} style={{ height: '1px' }} />}
            {chats.map((message, key) => {
              const isMine = message.sender.id == myId;
              console.log(message);
              return (
                <ChatItem
                  message={message.message}
                  createdAt={formatDate(message.createdAt)}
                  isMine={isMine}
                  key={key}
                />
              );
            })}
            <div ref={endOfMessageRef} style={{ height: '1px' }} />
          </div>
        </Col>
      </Row>

      {/* <button onClick={scrollToBottom} className='scroll-to-bottom-btn'>
        <i className='bi bi-arrow-down'></i>
      </button> */}
      <ChatPageFooter messageSendHandler={handleSendMessage} />
    </Container>
  );
};

export default ChatPage;
