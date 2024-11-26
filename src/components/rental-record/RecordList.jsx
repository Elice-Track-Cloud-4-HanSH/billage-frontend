import PropTypes from 'prop-types';
import Record from './Record';

const RecordList = ({ records, activeTab }) => {
  const renderActions = (tab) => {
    if (tab === 'products-on-sale') {
      return (
        <>
          <button>대여 중으로 변경</button>
          <button>수정</button>
          <button>삭제</button>
        </>
      );
    } else if (tab === 'rental-record?type=대여중/판매') {
      return (
        <>
          <button>반납 완료</button>
          <button>상대방에게 채팅 보내기</button>
        </>
      );
    } else if (tab === 'rental-record?type=대여내역/판매') {
      return (
        <>
          <button>사용자 후기 작성</button>
        </>
      );
    } else if (tab === 'rental-record?type=대여중/구매') {
      return (
        <>
          <button>
            <button>사용자에게 채팅 보내기</button>
          </button>
        </>
      );
    } else if (tab === 'rental-record?type=대여내역/구매') {
      return (
        <>
          <button>상품 후기 작성</button>
          <button>사용자 후기 작성</button>
        </>
      );
    }
    return null;
  };

  return (
    <div>
      {records.length > 0 ? (
        records.map((record, index) => (
          <div key={index} className='mb-3'>
            <Record record={record} actions={renderActions(activeTab)} />
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
