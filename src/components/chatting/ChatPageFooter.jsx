import PropTypes from 'prop-types';
import { useState } from 'react';
import { InputGroup } from 'react-bootstrap';

import { Button, Row, Form } from 'react-bootstrap';

import '@/styles/chatting/ChatPageFooter.css';

const ChatItemFooter = ({ messageSendHandler }) => {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    messageSendHandler(message);
    console.log('Sending message: ', message);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log(message);
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Row className='footer py-2'>
      <div className='d-flex'>
        <Form.Control
          type='text'
          placeholder='메시지를 입력하세요'
          className='me-2'
          onKeyDown={handleKeyDown}
          onChange={handleMessageChange}
        />
        <Button variant='primary' className='ms-2' onClick={handleSendMessage}>
          <i className='bi bi-arrow-right'></i>
        </Button>
      </div>
    </Row>
  );
};
ChatItemFooter.propTypes = {
  messageSendHandler: PropTypes.func.isRequired,
};

export default ChatItemFooter;
