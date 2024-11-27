import PropTypes from 'prop-types';
import Record from './Record';

const RecordList = ({ records }) => {
  return (
    <div>
      {records.length > 0 ? (
        records.map((record, index) => (
          <div key={index} className='mb-3'>
            <Record record={record} />
          </div>
        ))
      ) : (
        <p>대여기록이 없습니다.</p>
      )}
    </div>
  );
};

RecordList.propTypes = {
  records: PropTypes.array.isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default RecordList;
