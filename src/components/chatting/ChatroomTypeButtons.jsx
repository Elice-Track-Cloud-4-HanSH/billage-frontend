import { useRef } from 'react';
import '@/styles/chatting/ChatroomTypeButtons.css';
import useChatroomList from './../../hooks/useChatroomList';

const ChatroomTypeButtons = () => {
  const scrollContainerRef = useRef(null);

  const { chatType, setChatType, setChatroomList, setIsLast, setPage } = useChatroomList();

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const scrollLeft = scrollContainerRef.current.scrollLeft;

    const handleMouseMove = (e) => {
      const distance = startX - e.clientX;
      scrollContainerRef.current.scrollLeft = scrollLeft + distance;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleWheel = (e) => {
    // e.preventDefault(); // 기본 수직 스크롤을 방지
    scrollContainerRef.current.scrollLeft += e.deltaY; // 휠 이동에 따라 가로 스크롤 이동
  };

  const handleButtonClick = (event) => {
    const button = event.target;
    if (button.dataset.value === chatType) return;
    const cType = button.dataset.value;
    history.replaceState(null, '', `/chats?type=${cType}`);
    setChatroomList([]);
    setChatType(cType);
    setPage(0);
    setIsLast(false);
  };

  return (
    <div className='mb-3'>
      <div
        ref={scrollContainerRef}
        className='d-flex justify-content-start w-100 overflow-x-auto chatroom-type-btns'
        style={{ whiteSpace: 'nowrap', scrollBehavior: 'smooth', flexWrap: 'nowrap' }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <button
          className={`btn ${chatType === 'ALL' ? 'btn-primary' : 'btn-secondary'} mx-2`}
          data-value='ALL'
          onClick={handleButtonClick}
        >
          전체
        </button>
        <button
          className={`btn ${chatType === 'LENT' ? 'btn-primary' : 'btn-secondary'} mx-2`}
          data-value='LENT'
          onClick={handleButtonClick}
        >
          빌려준 물건
        </button>
        <button
          className={`btn ${chatType === 'RENT' ? 'btn-primary' : 'btn-secondary'}  mx-2`}
          data-value='RENT'
          onClick={handleButtonClick}
        >
          빌린 물건
        </button>
      </div>
    </div>
  );
};

export default ChatroomTypeButtons;
