import PropTypes from 'prop-types';
import ButtonSection from './ButtonSection';

const Record = ({ record }) => {
  return (
    <div>
      <div>
        <div>
          <img src={record.productImageUrl} alt='상품 이미지' />
        </div>
        <div>
          <h5>{record.title}</h5>
          <p>
            {record.startDate} ~ {record.returnDate ? record.returnDate : record.expectedReturnDate}
          </p>
        </div>
        <div>
          <div>
            <img src={record.userImageUrl} alt='거래자 이미지' />
          </div>
          <p>{record.nickname}</p>
        </div>
      </div>
      <ButtonSection record={record} />
    </div>
  );
};

Record.propTypes = {
  record: PropTypes.shape({
    rentalRecordId: PropTypes.number,
    startDate: PropTypes.string,
    expectedReturnDate: PropTypes.string,
    returnDate: PropTypes.string,
    productId: PropTypes.number.isRequired,
    productImageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    userImageUrl: PropTypes.string,
    nickname: PropTypes.string,
  }).isRequired,
};

export default Record;
