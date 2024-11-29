import PropTypes from 'prop-types';

import '@/styles/chatting/ChatItem.css';

const ChatItem = ({ message, createdAt, isMine }) => {
  return (
    <div className={`message ${isMine ? 'my-message' : 'other-message'}`}>
      {!isMine && <span>{message}</span>}
      <div className='message-time'>{createdAt}</div>
      {isMine && <span>{message}</span>}
    </div>
  );
};
ChatItem.propTypes = {
  isMine: PropTypes.bool,
  message: PropTypes.string,
  createdAt: PropTypes.string,
};

export default ChatItem;
