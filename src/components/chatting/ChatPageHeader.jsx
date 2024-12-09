import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';

import '@/styles/chatting/ChatPageHeader.css';
import ChatExitModal from './ChatExitModal';

const ChatPageHeader = ({ otherNickname, exitButtonHandler }) => {
  const [showExitModal, setShowExitModal] = useState(false);
  const navigate = useNavigate();

  const handleExitButtonClick = () => {
    setShowExitModal(true);
  };

  const handleCloseModal = () => {
    setShowExitModal(false);
  };

  const handleConfirmExit = async () => {
    // 실제 채팅방 나가기 로직
    await exitButtonHandler();
    setShowExitModal(false);
    handleGoBackFromChatRoom(-1);
  };

  const handleGoBackFromChatRoom = () => {
    navigate(-1);
  };

  return (
    <>
      <div className='chatpage-header'>
        <div className='d-flex align-items-center justify-content-between py-2 p-12'>
          <Button
            className='justify-content-start'
            variant='link'
            onClick={handleGoBackFromChatRoom}
          >
            <i className='bi bi-arrow-left'></i>
          </Button>
          <h6 className='mb-0 text-start w-100'>{otherNickname}</h6>
          <Button
            className='btn d-inline-flex align-items-center justify-content-end me-2'
            onClick={handleExitButtonClick}
          >
            <span className='me-2 text-nowrap'>나가기</span>
            <i className='bi bi-door-open'></i>
          </Button>
        </div>
      </div>
      <ChatExitModal
        showExitModal={showExitModal}
        handleCloseModal={handleCloseModal}
        otherNickname={otherNickname}
        handleConfirmExit={handleConfirmExit}
      />
    </>
  );
};
ChatPageHeader.propTypes = {
  otherNickname: PropTypes.string.isRequired,
  exitButtonHandler: PropTypes.func,
};

export default ChatPageHeader;
