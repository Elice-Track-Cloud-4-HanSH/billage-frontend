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
      <Row className='header py-1'>
        <Col xs={2}>
          <Button variant='link' onClick={handleGoBackFromChatRoom}>
            <i className='bi bi-arrow-left'></i>
          </Button>
        </Col>
        <Col xs={8} className='d-flex align-items-center text-start ps-0'>
          <div className='w-100'>
            <h6 className='mb-0'>{otherNickname}</h6>
          </div>
        </Col>
        <Col xs={2} className='text-end'>
          <Button onClick={handleExitButtonClick}>
            나가기
            <i className='bi bi-door-open'></i>
          </Button>
        </Col>
      </Row>
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
