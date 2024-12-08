import React, { useState, useEffect } from "react";

const LocationPicker = ({ onLocationSelect, onCancel }) => {
    const [latitude, setLatitude] = useState(null); // 초기값 null
    const [longitude, setLongitude] = useState(null); // 초기값 null
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude: currentLat, longitude: currentLng } = position.coords;
                    setLatitude(currentLat);
                    setLongitude(currentLng);
                    initializeMap(currentLat, currentLng);
                },
                (error) => {
                    console.error("위치 정보를 가져오는 중 오류 발생:", error);
                    initializeMap(37.5665, 126.9780); // 기본값 서울
                }
            );
        } else {
            initializeMap(37.5665, 126.9780); // 기본값 서울
        }
    }, []);

    const initializeMap = (lat, lng) => {
        const mapDiv = document.getElementById("map");
        const mapInstance = new naver.maps.Map(mapDiv, {
            center: new naver.maps.LatLng(lat, lng),
            zoom: 15,
        });
        setMap(mapInstance);

        const markerInstance = new naver.maps.Marker({
            position: new naver.maps.LatLng(lat, lng),
            map: mapInstance,
        });
        setMarker(markerInstance);

        naver.maps.Event.addListener(mapInstance, "click", function (e) {
            const clickedLat = e.coord.lat(); // 메서드 호출로 변경
            const clickedLng = e.coord.lng(); // 메서드 호출로 변경

            markerInstance.setPosition(e.coord);
            setLatitude(clickedLat);
            setLongitude(clickedLng);

            console.log("클릭한 위치:", { latitude: clickedLat, longitude: clickedLng }); // 클릭 위치 로그
        });
    };

    const handleConfirm = () => {
        if (latitude !== null && longitude !== null) {
            console.log("선택 완료된 위치:", { latitude, longitude }); // 선택 완료 위치 로그
            onLocationSelect({ latitude, longitude });
        } else {
            console.error("잘못된 위치 데이터:", { latitude, longitude });
            alert("유효한 위치를 선택해주세요.");
        }
    };

    return (
        <div style={styles.container}>
            <div id="map" style={styles.map}></div>
            <div style={styles.buttons}>
                <button onClick={handleConfirm} style={styles.confirmButton}>
                    선택 완료
                </button>
                <button onClick={onCancel} style={styles.cancelButton}>
                    취소
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
    },
    map: {
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        border: "1px solid #ddd",
    },
    buttons: {
        display: "flex",
        gap: "1rem",
    },
    confirmButton: {
        padding: "0.5rem 1rem",
        backgroundColor: "#6c63ff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    cancelButton: {
        padding: "0.5rem 1rem",
        backgroundColor: "#F16366",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default LocationPicker;
