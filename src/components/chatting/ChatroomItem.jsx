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
          <div className='me-3 position-relative'>
            <div
              className='d-flex align-items-center justify-content-center'
              style={{ width: '100px', height: '100px' }}
            >
              <img
                className='img-thumbnail'
                src={
                  chatroom.product.thumbnail ||
                  `${import.meta.env.VITE_AXIOS_BASE_URL}/images/default-product.png`
                }
              />
            </div>
            <img
              className='position-absolute  bottom-0 start-0 rounded-circle border border-2 border-white'
              style={{ width: '50px', height: '50px' }}
              src={
                chatroom.opponent.profileImage ||
                `${import.meta.env.VITE_AXIOS_BASE_URL}/images/default_profile.png`
              }
              alt='Profile'
            />
          </div>
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
      thumbnail: PropTypes.string,
    }),
    opponent: PropTypes.shape({
      id: PropTypes.number,
      nickname: PropTypes.string,
      profileImage: PropTypes.string,
    }),
    unreadCount: PropTypes.number,
  }),
  currentTime: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ChatroomItem;
