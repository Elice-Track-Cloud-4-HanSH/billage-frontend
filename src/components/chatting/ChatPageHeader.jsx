import PropTypes from 'prop-types';
import { Button, Col, Row } from 'react-bootstrap';

import '@/styles/chatting/ChatPageHeader.css';

const ChatItemHeader = ({ otherNickname }) => {
  return (
    <Row className='header py-1'>
      <Col xs={2}>
        <Button variant='link'>
          <i className='bi bi-arrow-left'></i>
        </Button>
      </Col>
      <Col xs={8} className='d-flex align-items-center text-start ps-0'>
        <div className='w-100'>
          <h6 className='mb-0'>{otherNickname}</h6>
        </div>
      </Col>
      <Col xs={2} className='text-end'>
        <Button variant='link'>
          <i className='bi bi-door-open'></i>
        </Button>
      </Col>
    </Row>
  );
};
ChatItemHeader.propTypes = {
  otherNickname: PropTypes.string.isRequired,
};

export default ChatItemHeader;
