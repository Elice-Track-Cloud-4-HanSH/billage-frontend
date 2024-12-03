import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { timeDiffFormat } from '@/utils';

const ChatroomItem = ({ chatroom, currentTime, onClick }) => {
  const [chatText, setChatText] = useState(chatroom.lastChat.message);

  useEffect(() => {
    adjustChatText();

    window.addEventListener('resize', adjustChatText);
    return () => {
      window.removeEventListener('resize', adjustChatText);
    };
  });

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

  return (
    <div
      className='card border-0 border-bottom p-1 cursor-pointer shadow-sm hover-shadow'
      onClick={onClick}
    >
      <div className='card-body d-flex align-items-center justify-content-between p-3 w-100'>
        <div className='d-flex align-items-center w-100'>
          <div className='rounded-circle bg-secondary me-3' style={{ width: 40, height: 40 }}></div>
          <div className='flex-grow-1'>
            <div className='text-start'>
              <h6 className='card-title mb-1'>{chatroom.product.name}</h6>
              <p className='card-text mb-1'>{chatroom.opponent.nickname}</p>
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
