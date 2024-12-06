import ChatroomTypeButtons from './ChatroomTypeButtons';

const ChatroomListHeader = () => {
  return (
    <header className='chatroom-list-header'>
      <div className='d-flex justify-content-start p-2'>
        <p className='m-0 p-0 display-6'>채팅</p>
      </div>
      <ChatroomTypeButtons />
    </header>
  );
};
export default ChatroomListHeader;
