import { apis } from '@/shared/axios';
import axios from 'axios';
import React, { useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

export const GetInfo3Person = () => {
    //  지도 초기 위치 및 위도경도 state값
    const [center, setCenter] = useState({
        lat: 37.49676871972202,
        lng: 127.02474726969814,
    });
    //  지도 부드럽게 움직이기
    const [isPanto, setIsPanto] = useState(true);
    //  검색(1,2) useState
    const [searchAddress1, setSearchAddress1] = useState('');
    const [searchAddress2, setSearchAddress2] = useState('');
    const [searchAddress3, setSearchAddress3] = useState('');
    //  마커 찍어 줄 state
    const [positions, setPositions] = useState([]);
    //  검색 Button Handler 1
    const searchAddressButtonHandler1 = (e) => {
        setSearchAddress1(e.target.value);
    };
    //  검색 Button Handler 2
    const searchAddressButtonHandler2 = (e) => {
        setSearchAddress2(e.target.value);
    };
    //  검색 Button Handler 3
    const searchAddressButtonHandler3 = (e) => {
        setSearchAddress3(e.target.value);
    };
    //  위도, 경도 값을 저장할 state 변수
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    //  키워드 검색 로직
    const handleSearchMap = (searchAddress) => {
        const ps = new kakao.maps.services.Places();
        const placesSearchCB = function (data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                const newSearch = data[0];
                // 검색 결과의 위도, 경도 값을 state 변수에 저장
                setLatitude(newSearch.y);
                setLongitude(newSearch.x);

                  // 서버로 위도, 경도 값 전송
                axios.post("http://3.34.179.86/api/find", 
                { latitude: newSearch.y, longitude: newSearch.x })
                    .then((response) => {
                        console.log(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                // positions 배열을 복제하여 prevPositions로 사용
                const prevPositions = [...positions]; 
                // 검색 결과를 center에 추가.(검색결과위치로 좌표찍기)
                setCenter({ lat: newSearch.y, lng: newSearch.x });
                // 검색 결과를 positions에 추가.(마커를 찍어줌))
                setPositions((prevPositions) => [
                    ...prevPositions,          
                    { 
                    title: newSearch.place_name, 
                    latlng: { lat: newSearch.y, lng: newSearch.x } 
                    },
                ]);
            }
        };
        ps.keywordSearch(`${searchAddress}`, placesSearchCB);
    };

return (
    <>
        <Map
            center={center}
            isPanto={isPanto}
            style={{
                width: '100%',
                height: '650px',
            }}
            level={3}
        >
            {positions.map((position, index) => (
                <MapMarker
                    key={`${position.title}-${position.latlng}`}
                    position={position.latlng} // 마커를 표시할 위치
                    image={{
                        src: 
                            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 마커이미지의 주소입니다
                        size: {
                            width: 24,
                            height: 35,
                        }, // 마커이미지의 크기입니다
                    }}
                    title={position.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                />
            ))}
        </Map>
    <div>
        A : &nbsp;
        <input onChange={searchAddressButtonHandler1} value={searchAddress1} />
        <button onClick={() => handleSearchMap(searchAddress1)}>검색</button>
        <button>확인</button>
    </div>

    <div>
        B : &nbsp;
        <input onChange={searchAddressButtonHandler2} value={searchAddress2} />
        <button onClick={() => handleSearchMap(searchAddress2)}>검색</button>
    </div>

    <div>
        C : &nbsp;
        <input onChange={searchAddressButtonHandler3} value={searchAddress3} />
        <button onClick={() => handleSearchMap(searchAddress3)}>검색</button>
    </div>
    </>
    )
}
export default GetInfo3Person



// // 서버에서 받아온 위치 정보를 저장할 상태값 추가
// const [serverPositions, setServerPositions] = useState([]);

// // 서버에서 위치 정보를 받아와 지도에 마커를 찍는 함수
// const getServerPositions = () => {
//   apis.get("/api/location")
//     .then((response) => {
//       // 서버에서 받아온 위치 정보를 state에 저장
//       setServerPositions(response.data);

//       // 받아온 위치 정보를 이용하여 지도에 마커를 찍음
//       const markers = response.data.map((serverPosition) => {
//         const marker = new kakao.maps.Marker({
//           map: map,
//           position: new kakao.maps.LatLng(serverPosition.latitude, serverPosition.longitude),
//         });
//         return marker;
//       });
//       setMarkers((prevMarkers) => [...prevMarkers, ...markers]);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// // 컴포넌트가 마운트될 때 서버에서 위치 정보를 받아와 마커를 찍음
// useEffect(() => {
//   getServerPositions();
// }, []);
