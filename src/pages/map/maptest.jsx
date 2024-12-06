import React, { useState, useEffect } from 'react';
import { NaverMap, Polygon, NavermapsProvider } from 'react-naver-maps';
import axios from 'axios';

const MapWithPolygon = () => {
  const [polygonPath, setPolygonPath] = useState([]);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });

  const fetchPolygonData = async (emdCd) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/emd-area/${emdCd}`);
      const { geom } = response.data;

      // GeoJSON 데이터를 파싱하여 좌표 배열로 변환
      const coordinates = geom.coordinates[0].map(([lng, lat]) => ({ lat, lng }));
      setPolygonPath(coordinates);

      // 중심 좌표 설정
      setCenter(coordinates[0]);
    } catch (error) {
      console.error('Error fetching polygon data:', error);
    }
  };

  useEffect(() => {
    fetchPolygonData(11110103); // 예제 emdCd
  }, []);

  return (
    <NavermapsProvider ncpClientId='3mYut39LIparoZ8y8NtdKor8UVVgwSdjWVsxEXI1'>
      <NaverMap
        mapDivId='map'
        style={{ width: '100%', height: '500px' }}
        defaultCenter={center}
        defaultZoom={12}
      >
        {polygonPath.length > 0 && (
          <Polygon
            paths={[polygonPath]}
            fillColor='#00ff00'
            fillOpacity={0.3}
            strokeColor='#0000ff'
            strokeOpacity={0.8}
            strokeWeight={2}
          />
        )}
      </NaverMap>
    </NavermapsProvider>
  );
};

export default MapWithPolygon;
