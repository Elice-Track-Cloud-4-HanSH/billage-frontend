import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../components/common/Header';

const ActivityArea = () => {
  const [sggNm, setSggNm] = useState(''); // 시군구명
  const [emdNm, setEmdNm] = useState(''); // 읍면동명
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/emd-area/search', {
        params: { sggNm, emdNm, page, size },
      });
      setSearchResults(response.data.content); // 백엔드에서 반환된 데이터 사용
    } catch (error) {
      console.error('검색 실패:', error);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
  };

  const handleSubmit = async () => {
    if (!selectedArea) {
      alert('활동 지역을 선택해주세요.');
      return;
    }

    try {
      const token = ''; // 사용자 인증 토큰 필요 시 설정
      await axios.post(
        'http://localhost:8080/api/activity-area',
        { emdCd: selectedArea.id },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('활동 지역이 설정되었습니다.');
    } catch (error) {
      console.error('활동 지역 설정 실패:', error);
      alert('활동 지역 설정 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Header title='활동 지역 설정' />
      <div style={styles.container}>
        <div style={styles.searchContainer}>
          <input
            type='text'
            value={sggNm}
            onChange={(e) => setSggNm(e.target.value)}
            placeholder='시군구명을 입력하세요 (예: 종로구)'
            style={styles.input}
          />
          <input
            type='text'
            value={emdNm}
            onChange={(e) => setEmdNm(e.target.value)}
            placeholder='읍면동명을 입력하세요 (예: 궁정)'
            style={styles.input}
          />
          <button onClick={handleSearch} style={styles.searchButton}>
            검색
          </button>
        </div>

        {searchResults.length > 0 && (
          <ul style={styles.resultsList}>
            {searchResults.map((area) => (
              <li
                key={area.id}
                style={{
                  ...styles.resultItem,
                  backgroundColor: selectedArea?.id === area.id ? '#d3f9d8' : 'white',
                }}
                onClick={() => handleAreaSelect(area)}
              >
                {`${area.sidoNm} ${area.sggNm} ${area.emdNm}`}
              </li>
            ))}
          </ul>
        )}

        <button onClick={handleSubmit} style={styles.submitButton}>
          설정 완료
        </button>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  searchButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  resultsList: {
    listStyle: 'none',
    padding: 0,
  },
  resultItem: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '0.75rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ActivityArea;
