import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { timeDiffFormat } from '@/utils';
import ChatIcon from './ChatIcon';
import { throttle } from 'lodash';

const ChatroomItem = ({ chatroom, currentTime, onClick }) => {
  const [chatText, setChatText] = useState(chatroom.lastChat.message);
  const [productName, setProductName] = useState(chatroom.product.name);
  const [opponentName, setOpponentName] = useState(chatroom.opponent.nickname);

  useEffect(() => {
    const throttledAdjustChatText = throttle(adjustChatText, 300);
    adjustChatText();

    window.addEventListener('resize', throttledAdjustChatText);
    return () => {
      window.removeEventListener('resize', throttledAdjustChatText);
    };
  });

  function adjustChatText() {
    const width = window.innerWidth;
    const lastMessage = chatroom.lastChat.message;
    const pName = chatroom.product.name;
    const opName = chatroom.opponent.nickname;

    const steps = [
      { size: 375, maxLength: 5 },
      { size: 470, maxLength: 10 },
      { size: 560, maxLength: 15 },
      { size: 660, maxLength: 20 },
      { size: 830, maxLength: 25 }, // STEP_4 이후는 50까지
      { size: Infinity, maxLength: 30 },
    ];

    const { maxLength } = steps.find((step) => width <= step.size);

    adjustText(lastMessage, maxLength, setChatText);
    adjustText(pName, maxLength, setProductName);
    adjustText(opName, maxLength, setOpponentName);
  }

  const getStringOffet = (str) => {
    const spaceCount = (str.match(/\s/g) || []).length;
    return Math.floor(spaceCount / 2);
  };

  const toCleanText = (str) => {
    return str.replace(/\s+/g, ' ').trim();
  };

  const adjustText = (str, maxLength, setter) => {
    let cleanedText = toCleanText(str);
    let offset = getStringOffet(cleanedText);
    let adjustedText =
      cleanedText.slice(0, maxLength + offset) + (cleanedText.length > maxLength ? '...' : '');
    setter(adjustedText);
  };

  return (
    <div
      className='card border-0 border-bottom p-1 cursor-pointer shadow-sm hover-shadow'
      onClick={onClick}
    >
      <div className='card-body d-flex align-items-center justify-content-between p-3 w-100'>
        <ChatIcon unreadCount={chatroom.unreadCount} />
        <div className='d-flex align-items-center w-100'>
          <div className='rounded-circle bg-secondary me-3' style={{ width: 40, height: 40 }}></div>
          <div className='flex-grow-1'>
            <div className='text-start'>
              <div className='d-flex align-items-center justify-content-between'>
                <h6 className='card-title mb-1'>{productName}</h6>
              </div>
              <p className='card-text mb-1'>{opponentName}</p>
            </div>
            <div className='d-flex align-items-center justify-content-between'>
              <p className='card-text mb-1 me-3 chat-content'>{chatText}</p>
              <small className='text-muted'>
                {timeDiffFormat(chatroom.lastChat.lastSentTime, currentTime)}
              </small>
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
      name: PropTypes.string.isRequired,
    }),
    opponent: PropTypes.shape({
      id: PropTypes.number,
      nickname: PropTypes.string,
    }),
    unreadCount: PropTypes.number,
  }),
  currentTime: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ChatroomItem;
