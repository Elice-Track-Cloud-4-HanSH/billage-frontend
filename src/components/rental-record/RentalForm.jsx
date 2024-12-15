import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RentalForm = ({ purchasers }) => {
  const [selectedPurchaser, setSelectedPurchaser] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPurchaser) {
      alert('구매자를 선택해주세요.');
      return;
    }

    if (!startDate || !expectedReturnDate) {
      alert('대여 시작일과 반납 예정일을 입력해주세요.');
      return;
    }

    const requestData = {
      id: selectedPurchaser,
      startDate: startDate,
      expectedReturnDate: expectedReturnDate,
    };

    try {
      const response = await axios.post('/api/rental-record', requestData);
      console.log(response);
      nav('/mysales', { replace: true });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || '대여 요청에 실패했습니다.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='container p-4 d-flex flex-column align-items-center gap-5'
    >
      <div className='mb-3 w-100'>
        {purchasers.map((purchaser) => (
          <div key={purchaser.id} className='d-flex justify-content-center mb-3 gap-3'>
            <input
              type='radio'
              id={`purchaser-${purchaser.id}`}
              name='purchaser'
              value={purchaser.id}
              onChange={() => setSelectedPurchaser(purchaser.id)}
              checked={selectedPurchaser === purchaser.id}
              className='me-2'
            />
            <img
              src={purchaser.imageUrl}
              alt='Purchaser'
              className='rounded-circle me-2'
              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
            />
            <label htmlFor={`purchaser-${purchaser.id}`} style={{ fontSize: '18px' }}>
              {purchaser.nickname}
            </label>
          </div>
        ))}
      </div>
      <div className='mb-3 w-100'>
        <label htmlFor='start' style={{ fontSize: '18px' }}>
          대여 시작일
        </label>
        <input
          type='date'
          id='startDate'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className='form-control'
        />
      </div>
      <div className='mb-3 w-100'>
        <label htmlFor='expectedReturnDate' style={{ fontSize: '18px' }}>
          반납 예정일
        </label>
        <input
          type='date'
          id='expectedReturnDate'
          value={expectedReturnDate}
          onChange={(e) => setExpectedReturnDate(e.target.value)}
          className='form-control'
        />
      </div>
      <div className='text-end w-100'>
        <button
          type='submit'
          className='btn btn-lg'
          style={{ backgroundColor: '#6366F1', color: 'white' }}
        >
          변경하기
        </button>
      </div>
    </form>
  );
};

RentalForm.propTypes = {
  purchasers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      imageUrl: PropTypes.string,
      nickname: PropTypes.string.isRequired,
    })
  ),
};

RentalForm.defaultProps = {
  purchasers: [], // 기본값 설정
};

export default RentalForm;
