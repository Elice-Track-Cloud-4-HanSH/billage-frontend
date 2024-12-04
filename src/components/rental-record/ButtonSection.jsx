import { useNavigate } from 'react-router-dom';
import { useTab } from '../../hooks/userTab';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useState } from 'react';

const ButtonSection = ({ record }) => {
  const { activeTab, setActiveTab } = useTab();
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const renderActions = (tab) => {
    if (tab === 'products/on-sale') {
      return (
        <div className='d-flex justify-content-around gap-5'>
          <button
            className='btn btn-primary w-50 mx-3'
            onClick={() => nav(`/set-to-rented/${record.productId}`)}
          >
            대여 중으로 변경
          </button>
          <button className='btn btn-warning w-50 mx-3' onClick={() => nav()}>
            수정
          </button>
          <button className='btn btn-danger w-50 mx-3' onClick={() => setShowModal(true)}>
            삭제
          </button>
        </div>
      );
    } else if (tab === 'rental-record?type=대여중/판매') {
      return (
        <div className='d-flex justify-content-around gap-5'>
          <button
            className='btn btn-primary w-50 mx-5 px-3'
            onClick={() => handleReturnComplete(record.rentalRecordId)}
          >
            반납 완료
          </button>
          <button className='btn btn-primary w-50 mx-5 px-3' onClick={() => nav()}>
            상대방에게 채팅 보내기
          </button>
        </div>
      );
    } else if (tab === 'rental-record?type=대여내역/판매') {
      return (
        <div className='d-flex justify-content-around'>
          <button
            className='btn btn-primary w-40'
            onClick={() => nav(`/user-review/${record.rentalRecordId}`)}
          >
            사용자 후기 작성
          </button>
        </div>
      );
    } else if (tab === 'rental-record?type=대여중/구매') {
      return (
        <div className='d-flex justify-content-around'>
          <button className='btn btn-primary w-40' onClick={() => nav()}>
            사용자에게 채팅 보내기
          </button>
        </div>
      );
    } else if (tab === 'rental-record?type=대여내역/구매') {
      return (
        <div className='d-flex justify-content-around gap-5'>
          <button
            className='btn btn-primary w-50 mx-5 px-3'
            onClick={() => nav(`/product-review/${record.rentalRecordId}`)}
          >
            상품 후기 작성
          </button>
          <button
            className='btn btn-primary w-50 mx-5 px-3'
            onClick={() => nav(`/user-review/${record.rentalRecordId}`)}
          >
            사용자 후기 작성
          </button>
        </div>
      );
    }
    return null;
  };

  const handleReturnComplete = async (id) => {
    try {
      const response = await axios.patch(`/api/rental-record/${id}`);
      setActiveTab('rental-record?type=대여내역/판매');
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
      <>{renderActions(activeTab)}</>

      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <p>정말 삭제하시겠습니까?</p>
            <div>
              <button onClick={handleDelete(record.productId)}>예</button>
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
