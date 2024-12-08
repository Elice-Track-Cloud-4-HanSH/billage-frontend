import { PropTypes } from 'prop-types';

const ChatIcon = ({ unreadCount }) => {
  return (
    <div style={{ position: 'absolute', top: '0px', right: '0px' }}>
      {/* 채팅 아이콘 */}
      <i
        className='bi bi-chat-dots-fill'
        style={{
          position: 'absolute',
          fontSize: '24px',
          color: '#007bff',
          right: '13px',
          top: '6px',
        }}
      ></i>

      {/* 읽지 않은 메시지 배지 */}
      {unreadCount > 0 && (
        <span
          className='badge bg-danger'
          style={{
            position: 'absolute',
            borderRadius: '50%',
            fontSize: '12px',
            color: 'white',
            top: '5px',
            right: '2px',
          }}
        >
          {unreadCount}
        </span>
      )}
    </div>
  );
};
ChatIcon.propTypes = {
  unreadCount: PropTypes.number,
};

export default ChatIcon;
