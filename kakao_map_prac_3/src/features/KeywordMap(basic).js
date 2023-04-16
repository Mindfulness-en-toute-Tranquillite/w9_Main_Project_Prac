import React, { useEffect, useState } from 'react';
import { Map } from 'react-kakao-maps-sdk';

const MapContainer = ({ searchPlace }) => {
    useEffect(() => {

    const { kakao } = window;
    const map = new kakao.maps.Map(document.getElementById('myMap'), 
    {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
    });
    const ps = new kakao.maps.services.Places();
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    // 마커를 담을 배열입니다
    let markers = [];

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    // ps.keywordSearch(searchPlace, placesSearchCB);
    // console.log("ps->",searchPlace)

    // kakao 제공
    searchPlaces();
    // 내가 적용한 것
    const searchForm = document.getElementById("submit_btn");
            searchForm?.addEventListener("click", function (e) {
            e.preventDefault();
            searchPlaces();
    });

    function searchPlaces() {
        const keyword = document.getElementById("keyword")?.value;
      
        if (!keyword?.replace(/^\s+|\s+$/g, "")) {
    alert("키워드를 입력해주세요!");
      
        return false;
    }
      
    ps.keywordSearch(keyword, placesSearchCB);
    }
    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
                    // 검색 목록과 마커를 표출합니다
        displayPlaces(data);
        // 페이지 목록 보여주는 displayPagination() 추가
        displayPagination(pagination);
        // setPlaces(data)

        const bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
            displayMarker(data[i]);
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds)
        // 정상적으로 검색이 완료됐으면
        }   else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
            // return;
        } else if (status === kakao.maps.services.Status.ERROR) {
            alert('검색 결과 중 오류가 발생했습니다.');
            // return;
        }
    }
    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places) {

        const listEl = document.getElementById('placesList');
        const menuEl = document.getElementById('menu_wrap');
        const fragment = document.createDocumentFragment();
        const bounds = new kakao.maps.LatLngBounds();
        // listStr = '';

        // 검색 결과 목록에 추가된 항목들을 제거
        listEl && removeAllChildNods(listEl);

        // 지도에 표시되고 있는 마커를 제거합니다
        removeMarker();
        for ( let i=0; i<places.length; i++ ) {

            // 마커를 생성하고 지도에 표시합니다
            const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
            const marker = addMarker(placePosition, i);
            const itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
            // LatLngBounds 객체에 좌표를 추가합니다
            bounds.extend(placePosition);

            // 마커와 검색결과 항목에 mouseover 했을때
            // 해당 장소에 인포윈도우에 장소명을 표시합니다
            // mouseout 했을 때는 인포윈도우를 닫습니다
            (function(marker, title) {
                kakao.maps.event.addListener(
                    marker, 
                    'mouseover', 
                    function() {
                    displayInfowindow(marker, title);
                    }
                );

                kakao.maps.event.addListener(
                    marker, 
                    'mouseout', 
                    function() {
                    infowindow.close();
                    }
                );

                itemEl.onmouseover =  function () {
                    displayInfowindow(marker, title);
                };

                itemEl.onmouseout =  function () {
                    infowindow.close();
                };
                itemEl.addEventListener("click", function (e) {
                    displayInfowindow(marker, title);
                    props.setAddress(places[i]);
                    map.panTo(placePosition);
                });
            })(marker, places[i].place_name);

            fragment.appendChild(itemEl);
        }
        // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
        if (listEl) {
            listEl.appendChild(fragment);
            menuEl.scrollTop = 0;
            }
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
    }
    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index, places) {
        const el = document.createElement('li');
        let itemStr =
        '<span class="markerbg marker_' + (index + 1) +'"></span>' + '<div class="info">' + "<h5>" + places.place_name + "</h5>";
                if (places.road_address_name) {
                    itemStr +=
                      "    <span>" +
                      places.road_address_name +
                      "</span>" +
                      '   <span class="jibun gray">' +
                      `<img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png">
                      </img>` +
                      places.address_name +
                      "</span>";
                  } else {
                    itemStr += "<span>" + places.address_name + "</span>";
                  }
        
                  itemStr +=
                    '  <span class="tel">' + places.phone + "</span>" + "</div>";
        
                  el.innerHTML = itemStr;
                  el.className = "item";
        
                  return el;
                }

    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
    function addMarker(position, idx, title) {
        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
            imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
            imgOptions =  {
                spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
                spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
            },
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                marker = new kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage 
            });

        marker.setMap(map); // 지도 위에 마커를 표출합니다
        markers.push(marker);  // 배열에 생성된 마커를 추가합니다

        return marker;
    }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
        for ( let i = 0; i < markers.length; i++ ) {
            markers[i].setMap(null);
        }   
        markers = [];
    }

    // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
    // 인포윈도우에 장소명을 표시합니다
    function displayInfowindow(marker, title) {
        const content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

        infowindow.setContent(content);
        infowindow.open(map, marker);
    }

    // 검색결과 목록의 자식 Element를 제거하는 함수입니다
    function removeAllChildNods(el) {
        if (el && el.hasChildNodes()) {
            while (el.childNodes) {
                el.removeChild(el.lastChild);
            }
        }
    }
    
    // 검색결과 목록 하단에 페이지 번호 표시
    function displayPagination(pagination) {
        const paginationEl = document.getElementById('pagination');
        const fragment = document.createDocumentFragment();
        // 기존에 추가된 페이지 번호 삭제
        while (paginationEl?.hasChildNodes()) {
            paginationEl.removeChild(paginationEl.lastChild)
        }
  
        for (let i = 1; i <= pagination.last; i++) {
            const el = document.createElement('a')
            el.href = '#'
            el.innerHTML = i
  
            if (i === pagination.current) {
            el.className = 'on';
            } else {
            el.onclick = (function (i) {
                return function () {
                pagination.gotoPage(i)
                }
            })(i)
            }
  
            fragment.appendChild(el)
        }
        paginationEl.appendChild(fragment)
    }
      
    function displayMarker(place) {
        let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x)
        });
  
        kakao.maps.event.addListener(marker, 'click', function(mouseEvent) {
            props.setAddress(place);
            infowindow.setContent(`<span>${place.place_name}</span>`);
            infowindow.open(map, marker);
            const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);
            map.panTo(moveLatLon);
        });
    }
}, []);
    return null;
    };
    const MapContainerWrapper2 = () => {
        const [inputText, setInputText] = useState("");
        const [place, setPlace] = useState("");
  
        const onChange = (e) => {
        setInputText(e.target.value);
        };
    
        const handleSubmit = (e) => {
        e.preventDefault();
        setPlace(inputText);
        setInputText("");
        };
        // 검색결과 배열에 담아줌
        const [Places, setPlaces] = useState([])
    
    return (
        <>
            <section className='map_wrap'>
                <Map
                    center={{
                        lat: 37.566826,
                        lng: 126.9786567
                    }}
                    level={3}
                    id='myMap'
                    style={{
                        width: "100%",
                        height: "350px"
                    }}>
                <MapContainer searchPlace={place} />
                </Map>
                <div id="menuDiv">
                    <form className="inputForm" onSubmit={handleSubmit}>
                        <input
                            placeholder="Search Place..."
                            onChange={onChange}
                            id="keyword"
                            value={inputText} />
                        <button id="submit_btn" type="submit">검색</button>
                    </form>
                    <ul id="placesList">
                        {Places.map((item, i) => (
                        <div key={i} style={{ marginTop: '20px' }}>
                            <span>{i + 1}</span>
                            <div>
                            <h5>{item.place_name}</h5>
                            {item.road_address_name ? (
                                <div>
                                <span>{item.road_address_name}</span>
                                <span>{item.address_name}</span>
                                </div>
                            ) : (
                                <span>{item.address_name}</span>
                            )}
                            <span>{item.phone}</span>
                            </div>
                        </div>
                        ))}
                        <div id="pagination"></div>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default MapContainerWrapper2;