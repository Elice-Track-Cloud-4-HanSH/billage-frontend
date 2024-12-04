import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/chatting/ChatroomList.css';
import ChatroomItem from '@/components/chatting/ChatroomItem.jsx';
import ChatroomListHeader from '../components/chatting/ChatroomListHeader';
import { axiosCredential } from '../utils/axiosCredential';
import Loading from '@/components/common/Loading';

const ChatroomList = () => {
  const [chatroomList, setChatroomList] = useState([]);
  const [chatType, setChatType] = useState('ALL');
  const [page, setPage] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const observerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreChatroom(); // 페이지 증가
        }
      },
      { threshold: 0.1 } // 불러와지지 않는다면 threshold 값을 수정해보자
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect(); // 컴포넌트 언마운트 시 해제
  }, [chatType, page]);

  const changeChatTypeHandler = (data) => {
    setChatType(data);
    setPage(0);
    setChatroomList([]);
    setIsLast(false);
  };

  const loadMoreChatroom = () => {
    if (isLast) return;
    setIsLoading(true);
    axiosCredential
      .get('/api/chatroom', {
        params: {
          type: chatType,
          page: page,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.length < 20) setIsLast(true);
        setPage((prev) => prev + 1);
        setChatroomList((prev) => [...prev, ...data]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        switch (err.status) {
          case 500:
            setErrMsg('로그인을 먼저 해주세요!');
            console.log('로그인을 먼저 해주세요!');
            break;
        }
        setIsLoading(false);
      });
    setCurrentTime(Date.now());
  };

  const navigateToChatroom = ({ opponentName, sellerId, buyerId, productId }) => {
    navigate(`/chat`, {
      state: { opponentName, sellerId, buyerId, productId },
    });
  };

  return (
    <div className='chatroom-list-container d-flex flex-column h-100'>
      <ChatroomListHeader changeChatTypeHandler={changeChatTypeHandler} />
      {/* <ChatroomTypeButtons handleTypeChange={changeChatTypeHandler} /> */}
      {errMsg && (
        <div className='d-flex justify-content-center align-items-center flex-grow-1 '>
          {errMsg}
        </div>
      )}
      {!errMsg && (
        <div className='chatroom-list flex-grow-1'>
          {chatroomList.map((chatroom) => {
            return (
              <ChatroomItem
                key={chatroom.chatroomId}
                chatroom={chatroom}
                currentTime={currentTime}
                onClick={() =>
                  navigateToChatroom({
                    opponentName: chatroom.opponent.nickname,
                    sellerId: chatroom.seller.id,
                    buyerId: chatroom.buyer.id,
                    productId: chatroom.product.id,
                  })
                }
              />
            );
          })}

          <Loading isLoading={isLoading} />
          {!isLoading && <div ref={observerRef} style={{ height: '1px' }} />}
          {isLast && <p> 마지막 채팅입니다 </p>}
        </div>
      )}
    </div>
  );
};

export default ChatroomList;
