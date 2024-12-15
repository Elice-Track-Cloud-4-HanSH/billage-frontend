import React, { useState, useEffect } from 'react';
import { axiosCredential } from '@/utils/axiosCredential';
import Header from '../../components/common/Header';
import '@/styles/map/ActivityArea.css';

const ActivityArea = () => {
  const [sggNm, setSggNm] = useState(''); // 시군구명
  const [emdNm, setEmdNm] = useState(''); // 읍면동명
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [geoJson, setGeoJson] = useState(null); // 행정구역 GeoJSON 데이터
  const [neighborGeoJsons, setNeighborGeoJsons] = useState([]); // NeighborArea GeoJSON 데이터
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);

  useEffect(() => {
    if (geoJson) {
      const mapDiv = document.getElementById('map');
      const map = new naver.maps.Map(mapDiv, { zoom: 15 });

      // 행정구역 폴리곤 그리기
      const geoJsonData = geoJson.geomGeoJson;
      const polygonPaths = geoJsonData.coordinates[0][0].map(([lng, lat]) => {
        return new naver.maps.LatLng(lat, lng);
      });

      const polygon = new naver.maps.Polygon({
        map,
        paths: polygonPaths,
        fillColor: '#ff0000',
        fillOpacity: 0.4,
        strokeColor: '#ff0000',
        strokeWeight: 2,
      });

      // 지도 영역 맞추기
      const bounds = new naver.maps.LatLngBounds();
      polygonPaths.forEach((path) => bounds.extend(path));

      // NeighborArea 폴리곤 그리기
      neighborGeoJsons.forEach((neighborGeoJson) => {
        const neighborData = neighborGeoJson.geomGeoJson;
        const neighborPaths = neighborData.coordinates[0][0].map(([lng, lat]) => {
          return new naver.maps.LatLng(lat, lng);
        });

        new naver.maps.Polygon({
          map,
          paths: neighborPaths,
          fillColor: '#00ff00', // NeighborArea 폴리곤 색상
          fillOpacity: 0.3,
          strokeColor: '#00ff00',
          strokeWeight: 2,
        });

        // Neighbor 폴리곤도 영역에 포함
        neighborPaths.forEach((path) => bounds.extend(path));
      });

      // 지도 영역 업데이트
      setTimeout(() => {
        map.fitBounds(bounds);
      }, 100);
    }
  }, [geoJson, neighborGeoJsons]);

  const handleSearch = async () => {
    try {
      const response = await axiosCredential.get('/api/emd-area/search', {
        params: { sggNm, emdNm, page, size },
      });
      setSearchResults(response.data.content);
    } catch (error) {
      console.error('검색 실패:', error);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  const handleAreaSelect = async (area) => {
    setSelectedArea(area);
    try {
      // 행정구역 GeoJSON 가져오기
      const geoResponse = await axiosCredential.get(`/api/emd-area/${area.id}`);
      setGeoJson(geoResponse.data);

      // NeighborArea GeoJSON 가져오기
      const neighborResponse = await axiosCredential.get(`/api/neighbor-area/${area.id}`, {
        params: { depth: 1 }, // 항상 좁은 범위 사용
      });

      // 응답이 단일 객체일 경우 배열로 변환
      const neighborData = Array.isArray(neighborResponse.data)
        ? neighborResponse.data
        : [neighborResponse.data];
      setNeighborGeoJsons(neighborData);
    } catch (error) {
      console.error('GeoJSON 데이터 가져오기 실패:', error);
      alert('GeoJSON 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedArea) {
      alert('활동 지역을 선택해주세요.');
      return;
    }

    try {
      const token = ''; // 사용자 인증 토큰 필요 시 설정
      await axiosCredential.post(
        '/api/activity-area',
        { emdCd: selectedArea.id, depth: 1 }, // 항상 좁은 범위 사용
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
      if (error.response && error.response.status === 500) {
        alert('활동지역 설정은 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        window.location.href = '/signin'; // 로그인 페이지 경로로 리다이렉트
      } else {
        alert('활동 지역 설정 중 오류가 발생했습니다.');
      }
    }
  };

  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));

  useEffect(() => {
    if (sggNm || emdNm) {
      handleSearch();
    }
  }, [page]);

  return (
    <>
      <Header title='활동 지역 설정' />
      <div className='container'>
        <div className='searchContainer'>
          <input
            type='text'
            value={sggNm}
            onChange={(e) => setSggNm(e.target.value)}
            placeholder='시군구명을 입력하세요 (예: 종로구)'
            className='input'
          />
          <input
            type='text'
            value={emdNm}
            onChange={(e) => setEmdNm(e.target.value)}
            placeholder='읍면동명을 입력하세요 (예: 궁정)'
            className='input'
          />
          <button onClick={handleSearch} className='searchButton'>
            검색
          </button>
        </div>

        {searchResults.length > 0 && (
          <ul className='resultsList'>
            {searchResults.map((area) => (
              <li
                key={area.id}
                className='resultItem'
                style={{
                  backgroundColor: selectedArea?.id === area.id ? '#d3f9d8' : 'white',
                }}
                onClick={() => handleAreaSelect(area)}
              >
                {`${area.sidoNm} ${area.sggNm} ${area.emdNm}`}
              </li>
            ))}
          </ul>
        )}

        <div id='map' className='map'></div>

        {/* 페이지네이션 버튼 추가 */}
        <div className='paginationContainer'>
          <button className='paginationButton' onClick={handlePrevPage} disabled={page === 0}>
            이전
          </button>
          <span className='pageInfo'>페이지 {page + 1}</span>
          <button
            className='paginationButton'
            onClick={handleNextPage}
            disabled={searchResults.length < size}
          >
            다음
          </button>
        </div>

        <button onClick={handleSubmit} className='submitButton'>
          설정 완료
        </button>
      </div>
    </>
  );
};

export default ActivityArea;
