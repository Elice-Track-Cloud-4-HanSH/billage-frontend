import PropTypes from 'prop-types';
import ChatroomTypeButtons from './ChatroomTypeButtons';
const ChatroomListHeader = ({ changeChatTypeHandler }) => {
  return (
    <header className='chatroom-list-header'>
      <div className='d-flex justify-content-start p-2'>
        <p className='m-0 p-0 display-6'>채팅</p>
      </div>
      <ChatroomTypeButtons handleTypeChange={changeChatTypeHandler} />
    </header>
  );
};
ChatroomListHeader.propTypes = {
  changeChatTypeHandler: PropTypes.func.isRequired,
};
export default ChatroomListHeader;
