import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const ChatExitModal = ({ showExitModal, handleCloseModal, otherNickname, handleConfirmExit }) => {
  return (
    <Modal show={showExitModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>채팅방 나가기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        정말로 {otherNickname}와의 채팅방을 나가시겠습니까?
        <br />
        대화 내용은 삭제됩니다.
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseModal}>
          취소
        </Button>
        <Button variant='danger' onClick={handleConfirmExit}>
          나가기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
ChatExitModal.propTypes = {
  showExitModal: PropTypes.bool.isRequired,
  otherNickname: PropTypes.string.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleConfirmExit: PropTypes.func.isRequired,
};

export default ChatExitModal;
