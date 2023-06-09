import axios from 'axios';
import React, { useRef, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useMutation } from 'react-query';


export const Try1 = () => {
    //  지도 초기 위치 및 위도경도 state값
    const [center, setCenter] = useState({
        lat: 37.49676871972202,
        lng: 127.02474726969814,
    });
    //  검색 State
    const [searchAddress1, setSearchAddress1] = useState('');
    // const [searchAddress2, setSearchAddress2] = useState('');
    // const [searchAddress3, setSearchAddress3] = useState('');
    // const [searchAddress4, setSearchAddress4] = useState('');
    //  검색 Button Handler 1
    const searchAddressButtonHandler1 = (e) => {
        setSearchAddress1(e.target.value);
    };
    //  마커 찍어 줄 state
    const [positions, setPositions] = useState([]);
    const [location, setLocation] = useState({
        x1 : 0,
        y1 : 0,
        x2 : 0,
        y2 : 0,
        x3 : 0,
        y3 : 0,
        x4 : 0,
        y4 : 0,
    }) 
    //  지도 정보 얻어오기
    const mapRef = useRef();
    const [info, setInfo] = useState();   
    //  ChangeInputHandler
    const changeInputHandler = (event) => {
        const { value, name } = event.target;
            setLocation((prevLocation) => ({
                ...prevLocation,
                [name]: JSON.parse(value),
            }));

    //       else {
    //     setLocation((pre) => {
    //         return {...pre, [name]: value} ;
    //     });
    // }
    };
    const { mutate, isLoading } = useMutation({
        mutationFn: async (locationToSend) => {
            console.log("locationToSend->", locationToSend)
         axios.post("http://3.34.179.86/api/find", locationToSend);
        
        },
        // onError 콜백 함수 구현
        onError: (error) => {
        console.error(error);
        // 에러 처리
        },
        onSuccess: () => {
        alert('닉네임 변경이 완료됐습니다.');
        router.push('/mypage');
        },
        });
        
    //  중간위치찾기 Button Handler (서버요청)
    // const submitButtonHandler = (event) => {
    //     event.preventDefault();
    //     const locationToSend = {
    //         x1: positions[0]?.latlng?.Lat(),
    //         y1: positions[0]?.latlng?.Lng(),
    //         x2: positions[1]?.latlng?.Lat(),
    //         y2: positions[1]?.latlng?.Lng(),
    //         x3: positions[2]?.latlng?.Lat(),
    //         y3: positions[2]?.latlng?.Lng(),
    //         x4: positions[3]?.latlng?.Lat(),
    //         y4: positions[3]?.latlng?.Lng(),
    //     };
    // }
    //     axios.post("http://3.34.179.86/api/find", locationToSend)
    //         .then((response) => {
    //             console.log(response.data);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // };
    
    // 키워드 입력후 검색 클릭 시 원하는 키워드의 주소로 이동
    const SearchMap = (searchAddress) => {
        const ps = new kakao.maps.services.Places()
        const placesSearchCB = function(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
            const newSearch = data[0]
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
        console.log("positions->", positions)
    };
        ps.keywordSearch(`${searchAddress}`, placesSearchCB); 
    }
    
    return (
    <div>
        <div>
            <Map 
            center={center} 
            style={{ width: "90vw", height: "560px" }}>
            {positions.map((position, index) => (
                <MapMarker
                    key={index}
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
        </div>

        <div>
            <input
            name='search1'
            value={searchAddress1}
            onChange={searchAddressButtonHandler1}
            />
            <button onClick={() => SearchMap(searchAddress1)}>검색</button>
        </div>
        <div>
            <div>
                A : <input
                name='1' 
                type="text"
                value={JSON.stringify(positions[0]?.latlng)}
                onChange={changeInputHandler}
                />
                {/* {positions[0].latlng} */}
                
                <button
                onClick={SearchMap}
                >확인</button>
            </div>
            <div>
                B : <input 
                name='2' 
                type="text" 
                value={JSON.stringify(positions[1]?.latlng)}
                onChange={changeInputHandler}
                />
                <button
                // onClick={}
                >확인</button>
            </div>
            <div>
                C : <input 
                name='3' 
                type="text"
                value={JSON.stringify(positions[2]?.latlng)}
                onChange={changeInputHandler}
                />
                <button
                // onClick={}
                >확인</button>
            </div>
            <div>
                D : <input 
                name='4' 
                type="text"
                value={JSON.stringify(positions[3]?.latlng)}
                onChange={changeInputHandler}
                />
                <button
                // onClick={}
                >확인</button>
            </div>
            <div>
                <button onSubmit={() => mutate(location)}>중간위치찾기</button>
            </div>
        </div>
    </div>
    )
}
export default Try1
