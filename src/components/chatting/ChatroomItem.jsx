import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const ChatroomItem = ({ chatroom, currentTime, myId }) => {
  const [chatText, setChatText] = useState(chatroom.lastChat.message);

  useEffect(() => {
    adjustChatText();

    window.addEventListener('resize', adjustChatText);
    return () => {
      window.removeEventListener('resize', adjustChatText);
    };
  });

  const timeDiffFormat = (lastSentTime) => {
    const lastSentTimeToDate = new Date(lastSentTime);
    const diffMs = currentTime - lastSentTimeToDate;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 31) {
      return `${diffDays}일 전`;
    } else {
      return `${diffMonths}달 전`;
    }
  };

  function adjustChatText() {
    const width = window.innerWidth;
    const lastMessage = chatroom.lastChat.message;

    const steps = [
      { size: 375, maxLength: 10 },
      { size: 450, maxLength: 20 },
      { size: 540, maxLength: 30 },
      { size: 690, maxLength: 40 },
      { size: Infinity, maxLength: 50 }, // STEP_4 이후는 50까지
    ];

    const { maxLength } = steps.find((step) => {
      return width <= step.size;
    });

    const adjustedMessage =
      lastMessage.length > maxLength ? lastMessage.slice(0, maxLength) + '...' : lastMessage;
    setChatText(adjustedMessage);
  }

  const checkOpponent = (seller, buyer) => {
    return seller.id === myId ? buyer.nickname : seller.nickname;
  };

  return (
    <div className='card border-0 border-bottom p-1'>
      <div className='card-body d-flex align-items-center justify-content-between p-3 w-100'>
        <div className='d-flex align-items-center w-100'>
          <div className='rounded-circle bg-secondary me-3' style={{ width: 40, height: 40 }}></div>
          <div className='flex-grow-1'>
            <div className='text-start'>
              <h6 className='card-title mb-1'>{chatroom.product.productName}</h6>
              <p className='card-text mb-1'>{checkOpponent(chatroom.seller, chatroom.buyer)}</p>
            </div>
            <div className='d-flex align-items-center justify-content-between'>
              <p className='card-text mb-1 me-3 chat-content'>{chatText}</p>
              <small className='text-muted'>{timeDiffFormat(chatroom.lastChat.lastSentTime)}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
ChatroomItem.propTypes = {
  chatroom: PropTypes.shape({
    chatroomId: PropTypes.number.isRequired,
    buyer: PropTypes.shape({
      id: PropTypes.number.isRequired,
      nickname: PropTypes.string.isRequired,
    }),
    seller: PropTypes.shape({
      id: PropTypes.number.isRequired,
      nickname: PropTypes.string.isRequired,
    }),
    lastChat: PropTypes.shape({
      lastSentTime: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    }),
    product: PropTypes.shape({
      id: PropTypes.number,
      productName: PropTypes.string.isRequired,
    }),
  }),
  currentTime: PropTypes.number.isRequired,
  myId: PropTypes.number,
};

export default ChatroomItem;
