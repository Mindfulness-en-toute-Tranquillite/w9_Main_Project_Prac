import React, { useRef, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useMutation } from '@tanstack/react-query';
import { apis } from '@shared/axios';
import { cookies } from '@shared/cookie';

export const MapMain = () => {
  //  지도 초기 위치 및 위도경도 state값
  const [center, setCenter] = useState({
    lat: 37.49676871972202,
    lng: 127.02474726969814,
  });
  //  검색 State
  const [searchAddress1, setSearchAddress1] = useState('');
  const [searchAddress2, setSearchAddress2] = useState('');
  const [searchAddress3, setSearchAddress3] = useState('');
  const [searchAddress4, setSearchAddress4] = useState('');
  //  중간 지점 마커 state
  const [midPoint, setMidPoint] = useState(null);
  //  마커 찍어 줄 state
  const [positions, setPositions] = useState([]);
  const [location, setLocation] = useState({
    x1: '',
    y1: '',
    x2: '',
    y2: '',
    x3: '',
    y3: '',
    x4: '',
    y4: '',
  });
  // //  ChangeInputHandler
  // const changeInputHandler = (e) => {
  //   const name = e.target.name;
  //   const values = positions;
  //   setLocation((pre) => ({
  //     ...pre,
  //     [`x${name}`]: values.lat,
  //     [`y${name}`]: values.lng,
  //   }));
  //   console.log('values->', values);
  // };

  const token = cookies.get('refresh_token');
  const { mutate, isLoading } = useMutation({
    mutationFn: async (location) => {
      console.log('location->', location[0].latlng);
      const data = await apis.post(
        '/find',
        {
          x: location[0]?.latlng?.lat,
          y: location[0]?.latlng?.lng,
          x2: location[1]?.latlng?.lat,
          y2: location[1]?.latlng?.lng,
          x3: location[2]?.latlng?.lat,
          y3: location[2]?.latlng?.lng,
          x4: location[3]?.latlng?.lat,
          y4: location[3]?.latlng?.lng,
        },
        {
          headers: {
            refresh_token: `${token}`,
          },
        },
      );
      return data;
    },
    // onError 콜백 함수 구현
    onError: (error) => {
      console.error(error);
      // 에러 처리
    },
    onSuccess: (data) => {
      const response = data.data.message;
      console.log('response', response);
      alert(response);
      const lat = data.data.data.lat;
      const lng = data.data.data.lng;
      const newMidPoint = {lat, lng};
      console.log("newMidPoint",newMidPoint);
      setMidPoint(newMidPoint);
    },
  });

  // 키워드 입력후 검색 클릭 시 원하는 키워드의 주소로 이동
  const SearchMap = (searchAddress) => {
    const ps = new kakao.maps.services.Places();
    const placesSearchCB = function (data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        const newSearch = data[0];
        // positions 배열을 복제하여 prevPositions로 사용
        const prevPositions = [...positions];
        // 검색 결과를 center에 추가.(검색결과위치로 좌표찍기)
        setCenter({ lat: newSearch.y, lng: newSearch.x });
        // 검색 결과를 positions에 추가.(마커를 찍어줌))
        setPositions((prevPositions) => [
          ...prevPositions,
          {
            title: newSearch.place_name,
            latlng: { lat: newSearch.y, lng: newSearch.x },
          },
        ]);
        console.log('newSearch->', newSearch);
        console.log('positions->', positions);
      }
      
    };
    ps.keywordSearch(`${searchAddress}`, placesSearchCB);
  };

  return (
    <div>
      <div>
        <Map center={center} style={{ width: '90vw', height: '560px' }}>
          {positions.map((position, index) => (
            <MapMarker
              key={index}
              position={position.latlng} // 마커를 표시할 위치
              image={{
                src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 마커이미지의 주소입니다
                size: {
                  width: 24,
                  height: 35,
                }, // 마커이미지의 크기입니다
              }}
              title={position.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            />
          ))}
          {midPoint && (
            <MapMarker
              position={midPoint}
              image={{
                src:
                  'MaannajanLogo.png',
                size: { width: 30, height: 38 },
              }}
              title="중간지점"
            />
          )}
        </Map>
      </div>
      
      <div>
        <div>
          A :{' '}
          <input
            name="1"
            type="text"
            value={searchAddress1}
            onChange={(e) => setSearchAddress1(e.target.value)}
          >
            {/* {positions[0].latlng} */}
          </input>
          <button onClick={() => SearchMap(searchAddress1)}>확인</button>
        </div>
        <div>
          B :{' '}
          <input
            name="2"
            type="text"
            value={searchAddress2}
            onChange={(e) => setSearchAddress2(e.target.value)}
          />
          <button onClick={() => SearchMap(searchAddress2)}>확인</button>
        </div>
        <div>
          C :{' '}
          <input
            name="3"
            type="text"
            value={searchAddress3}
            onChange={(e) => setSearchAddress3(e.target.value)}
          />
          <button onClick={() => SearchMap(searchAddress3)}>확인</button>
        </div>
        <div>
          D :{' '}
          <input
            name="4"
            type="text"
            value={searchAddress4}
            onChange={(e) => setSearchAddress4(e.target.value)}
          />
          <button onClick={() => SearchMap(searchAddress4)}>확인</button>
          <button
            onClick={() => {
              setSearchAddress4('');
            }}
          >
            cancel
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              mutate(positions);
            }}
          >
            중간위치찾기
          </button>
        </div>
      </div>
    </div>
  );
};
export default MapMain;