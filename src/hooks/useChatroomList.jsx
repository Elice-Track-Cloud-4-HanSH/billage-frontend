import { useContext } from 'react';
import ChatroomListContext from '@/storage-provider/chatroom-list/ChatroomListContext';

const useChatroomList = () => {
  return useContext(ChatroomListContext);
};

export default useChatroomList;
