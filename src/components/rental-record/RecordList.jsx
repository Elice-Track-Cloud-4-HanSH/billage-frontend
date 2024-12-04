import PropTypes from 'prop-types';
import Record from './Record';
import { Card, Alert } from 'react-bootstrap';

const RecordList = ({ records }) => {
  return (
    <div className="container">
      {records.length > 0 ? (
        records.map((record, index) => (
          <Card
            key={index}
            className="mb-4 pb-3 border-0 border-bottom"
          >
            <Card.Body className="p-0">
              <Record record={record} />
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info" className="mt-4">
          대여기록이 없습니다.
        </Alert>
      )}
    </div>
  );
};

RecordList.propTypes = {
  records: PropTypes.array.isRequired,
};

export default RecordList;
