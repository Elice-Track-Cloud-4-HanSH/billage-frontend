import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RentalForm = ({ purchasers }) => {
  const [selectedPurchaser, setSelectedPurchaser] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPurchaser) {
      alert('구매자를 선택해주세요.');
      return;
    }

    if (!startDate || !endDate) {
      alert('대여 시작일과 반납 예정일을 입력해주세요.');
      return;
    }

    const requestData = {
      purchaserId: selectedPurchaser,
      rentalStartDate: startDate,
      rentalEndDate: endDate,
    };

    try {
      const response = await axios.post('/api/rental-record', requestData);
      console.log(response);
      nav('/mysales');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || '대여 요청에 실패했습니다.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          {purchasers.map((purchaser) => (
            <div key={purchaser.id}>
              <input
                type='radio'
                id={`purchaser-${purchaser.id}`}
                name='purchaser'
                value={purchaser.id}
                onChange={() => setSelectedPurchaser(purchaser.id)}
                checked={selectedPurchaser === purchaser.id}
              />
              <label htmlFor={`purchaser-${purchaser.id}`}>{purchaser.nickname}</label>
            </div>
          ))}
        </div>
        <div>
          <label htmlFor='rental-start'>대여 시작일: </label>
          <input
            type='date'
            id='rental-start'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='rental-end'>반납 예정일: </label>
          <input
            type='date'
            id='rental-end'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button type='submit'>대여</button>
      </form>
    </div>
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
