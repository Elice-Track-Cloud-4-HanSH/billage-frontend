import PropTypes from 'prop-types';

import '@/styles/chatting/ChatItem.css';

const ChatItem = ({ message, createdAt, isMine, isRead }) => {
  return (
    <div className={`message ${isMine ? 'my-message' : 'other-message'}`}>
      <div className='message-time'>{createdAt}</div>
      <span>
        {message}
        {isRead ? '읽음' : ''}
      </span>
    </div>
  );
};
ChatItem.propTypes = {
  isMine: PropTypes.bool,
  message: PropTypes.string,
  createdAt: PropTypes.string,
  isRead: PropTypes.bool,
};

export default ChatItem;
