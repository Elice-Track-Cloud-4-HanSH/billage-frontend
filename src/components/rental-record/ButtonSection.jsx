import { useNavigate } from 'react-router-dom';
import { useTab } from './TabContext';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useState } from 'react';

const ButtonSection = ({ record }) => {
  const { activeTab } = useTab();
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const renderActions = (tab) => {
    if (tab === 'products/on-sale') {
      return (
        <>
          <button onClick={() => nav('/chabge-to-rental')}>대여 중으로 변경</button>
          <button onClick={() => nav()}>수정</button>
          <button onClick={() => setShowModal(true)}>삭제</button>
        </>
      );
    } else if (tab === 'rental-record?type=대여중/판매') {
      return (
        <>
          <button onClick={() => handleReturnComplete(record.id)}>반납 완료</button>
          <button onClick={() => nav()}>상대방에게 채팅 보내기</button>
        </>
      );
    } else if (tab === 'rental-record?type=대여내역/판매') {
      return (
        <>
          <button onClick={() => nav(`/user-review/${record.id}`)}>사용자 후기 작성</button>
        </>
      );
    } else if (tab === 'rental-record?type=대여중/구매') {
      return (
        <>
          <button>
            <button onClick={() => nav()}>사용자에게 채팅 보내기</button>
          </button>
        </>
      );
    } else if (tab === 'rental-record?type=대여내역/구매') {
      return (
        <>
          <button onClick={() => nav(`/product-review/${record.id}`)}>상품 후기 작성</button>
          <button onClick={() => nav(`/user-review/${record.id}`)}>사용자 후기 작성</button>
        </>
      );
    }
    return null;
  };

  const handleReturnComplete = async (id) => {
    try {
      const response = await axios.patch(`/api/rental-record/${id}`);
      console.log('응답 성골: ' + response.status);
    } catch (error) {
      console.error('요청을 처리하는 데 실패했습니다.', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/products/${id}`);
      console.log('응답 성골: ' + response.status);
    } catch (error) {
      console.error('요청을 처리하는 데 실패했습니다.', error);
    }
  };

  return (
    <>
      <div>{renderActions(activeTab)}</div>

      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <p>정말 삭제하시겠습니까?</p>
            <div>
              <button onClick={handleDelete(record.product.id)}>예</button>
              <button onClick={() => setShowModal(false)}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ButtonSection.propTypes = {
  record: PropTypes.object.isRequired,
};

export default ButtonSection;
