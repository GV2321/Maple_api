document.getElementById('characterNameInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
      // Enter 키를 눌렀을 때의 동작
      callApi();
  }
});

const API_KEY = "test_7b313a47a964f9c8327f1a38719513991c6c0a1413a493b5b08a99c25f14cfa3b1f7bc16310b71b97d5ac7108cd5fcf9";
const resultElement = document.getElementById('result');
const dateInput = document.getElementById('dateInput');

function formatNumber(number) {
  const billion = Math.floor(number / 100000000);
  const million = Math.floor((number % 100000000) / 10000);
  const remainder = number % 10000;

  let result = '';

  if (billion > 0) {
      result += billion + '억 ';
  }

  if (million > 0) {
      result += million + '만 ';
  }

  if (remainder > 0) {
      result += remainder;
  }

  return result.trim();
}

function callApi() {

  let statData; // 클릭 이벤트 핸들러에서 사용할 변수
  let charData; // 클릭 이벤트 핸들러에서 사용할 변수
  let infoPopup; // infoPopup을 전역 변수로 선언
  let isPopupOpen = false; // 팝업 창의 상태를 나타내는 변수

  
  
  
  resultElement.innerHTML = '';

  // 사용자로부터 입력 받은 캐릭터 이름
  const characterName = document.getElementById('characterNameInput').value;

  // 사용자로부터 선택 받은 날짜
  const selectedDate = document.getElementById('dateInput').value;

  // 오늘 날짜
  const today = new Date();

  // 하루 전 날짜
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // 날짜 입력 필드에 하루 전 날짜 설정
  dateInput.valueAsDate = yesterday;

  // 만약 사용자가 날짜를 선택하지 않았다면 자동으로 하루 전 날짜로 설정
  const apiDate = selectedDate || yesterday.toISOString().split('T')[0];

  // API 요청 URL
  const urlString = "https://open.api.nexon.com/maplestory/v1/id?character_name=" + characterName;
  

  resultElement.addEventListener('mouseout', function (event) {
    const targetElement = event.target;

    if (targetElement.tagName === 'IMG') {
        console.log("마우스 아웃 이벤트 발생 - 이미지에서 마우스 벗어남");

        // infoPopup을 숨기거나 제거하는 작업 수행
        if (infoPopup && isPopupOpen) {
            // infoPopup을 숨기거나 삭제
            infoPopup.style.display = 'none'; // 숨기기
            isPopupOpen = false;
            // 또는
            // infoPopup.remove(); // 제거
        } else {
            console.error("infoPopup을 찾을 수 없습니다.");
        }
    }
});
  
  
  resultElement.addEventListener('mouseover', function (event) {
    const clickedElement = event.target;

    if (clickedElement.tagName === 'IMG') {
      console.log("마우스 오버 이벤트 발생 - 이미지에 마우스 올림");
      // 클릭 시에 특정 정보를 표시하는 창을 생성하고 표시
      

      // 클릭 이벤트 핸들러 내에서 statData와 charData를 사용할 수 있음
      console.log("Stat API 응답 데이터:", statData);
      console.log("Character API 응답 데이터:", charData);

      if (!infoPopup) {
        

      infoPopup = document.createElement('div');
      infoPopup.id = 'infoPopup';
      infoPopup.style.position = 'absolute';
      infoPopup.style.top = '0';
      infoPopup.style.left = '0';
      infoPopup.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      infoPopup.style.padding = '10px';
      document.body.appendChild(infoPopup)
      }

      if (statData.final_stat && Array.isArray(statData.final_stat)) {
        const statList = document.createElement('ul');
        statData.final_stat.forEach(statGroup => {
            // 여기서 조건을 설정하여 필터링할 수 있습니다.

            if (statGroup.stat_name === '최소 스탯공격력') {

              const statValue = '스탯공격력 : ' + formatNumber(statGroup.stat_value);

              // 텍스트 노드를 생성하고 문자열을 설정
              const textNode = document.createTextNode(statValue);

              // 텍스트 노드를 직접 body에 추가
              statList.appendChild(textNode);
            }

            if (statGroup.stat_name === '최대 스탯공격력') {

              // statGroup 내의 객체를 순회하면서 속성을 가져와서 리스트 아이템으로 추가
              const statValue = ' ~ ' + formatNumber(statGroup.stat_value);

              // 텍스트 노드를 생성하고 문자열을 설정
              const textNode = document.createTextNode(statValue);

              // 텍스트 노드를 직접 body에 추가
              statList.appendChild(textNode);
            }

            if (statGroup.stat_name === '데미지' ||
                statGroup.stat_name === '보스 몬스터 데미지' ||
                statGroup.stat_name === '일반 몬스터 데미지' ||
                statGroup.stat_name === '최종 데미지' ||
                statGroup.stat_name === '방어율 무시' ||
                statGroup.stat_name === '크리티컬 확률' ||
                statGroup.stat_name === '크리티컬 데미지' ||
                statGroup.stat_name === '아이템 드롭률' ||
                statGroup.stat_name === '메소 획득량' ||
                statGroup.stat_name === '상태이상 추가 데미지') {

                // statGroup 내의 객체를 순회하면서 속성을 가져와서 리스트 아이템으로 추가
                const statValue = formatNumber(statGroup.stat_value);
                const statItem = document.createElement('li');
                statItem.textContent = `${statGroup.stat_name} : ${statValue}%`;
                statList.appendChild(statItem);
            }
            
        }
        
        );

        // 결과에 추가
        if (infoPopup) {
          infoPopup.innerHTML = '';
            infoPopup.appendChild(statList);
        } else {
            console.error("infoPopup을 찾을 수 없습니다.");
        }
    } else {
        console.error("Stat API 응답 데이터의 형식이 올바르지 않습니다.");
    }




      // ... (이하 생략)
      infoPopup.style.display = 'block';
      isPopupOpen = true;
    }
    
   
  });
  resultElement.addEventListener('mousemove', function (event) {
    // 마우스 포인터의 현재 위치
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // 팝업 창을 마우스 포인터 위치로 이동
    if (infoPopup && isPopupOpen) {
        infoPopup.style.left = mouseX + 'px';
        infoPopup.style.top = mouseY + 'px';
    }
});

  

  

  fetch(urlString, { headers: { "x-nxopen-api-key": API_KEY } })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          // 받은 데이터를 사용하여 원하는 동작 수행
          console.log("Character ID:", data.ocid);

          if (data && data.ocid !== undefined) {
              // 추출한 데이터를 사용하여 새로운 API 요청 만들기
              const charApiUrl = `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${data.ocid}&date=${apiDate}`;
              const statApiUrl = `https://open.api.nexon.com/maplestory/v1/character/stat?ocid=${data.ocid}&date=${apiDate}`;

              // 새로운 API 요청 보내기
              return Promise.all([
                  fetch(charApiUrl, { headers: { "x-nxopen-api-key": API_KEY } }),
                  fetch(statApiUrl, { headers: { "x-nxopen-api-key": API_KEY } })
              ])
                  .then(([charResponse, statResponse]) => {
                      if (charResponse.ok && statResponse.ok) {
                          return Promise.all([
                              charResponse.json(),
                              statResponse.json()
                          ]);
                      } else {
                          console.error("API 응답이 올바르지 않습니다.");
                          throw new Error("API 응답이 올바르지 않습니다.");
                      }
                  })
                  .then(([charDataResult, statDataResult]) => {
                    charData = charDataResult;
                    statData = statDataResult;
                      console.log("Character API 응답 데이터:", charData);
                      console.log("Stat API 응답 데이터:", statData);

                      // 결과를 화면에 추가

                      if (charData.character_image) {
                          // 이미지가 있는 경우 이미지 출력
                          const imageContainer = document.createElement('div');
                          const imageElement = document.createElement('img');
                          imageElement.src = charData.character_image;
                          imageElement.style.width = '150px';
                          imageElement.style.height = '150px';
                          imageContainer.appendChild(imageElement);                                         
                          resultElement.appendChild(imageContainer);
                          
                            
                        
                          console.log("imageElement:", imageElement);
                          console.log("imageContainer:", imageContainer);
                          

                      } else {
                          console.error("이미지 링크가 없습니다.");
                      }
                      
                      resultElement.innerHTML += `
                          <p>기준날짜 : ${apiDate.split('T')[0].replace(/^"(.*)"$/, '$1')}</p>
                          <p>캐릭터 이름 : ${JSON.stringify(charData.character_name, null, 2).replace(/^"(.*)"$/, '$1')}</p>
                          <p>월드 : ${JSON.stringify(charData.world_name, null, 2).replace(/^"(.*)"$/, '$1')}</p>
                          <p>직업 : ${JSON.stringify(charData.character_class, null, 2).replace(/^"(.*)"$/, '$1')} (${JSON.stringify(charData.character_class_level, null, 2).replace(/^"(.*)"$/, '$1')}차)</p>
                          <p>레벨 : ${JSON.stringify(charData.character_level, null, 2).replace(/^"(.*)"$/, '$1')} (${JSON.stringify(charData.character_exp_rate, null, 2).replace(/^"(.*)"$/, '$1')}%)</p>
                          <p>길드 : ${JSON.stringify(charData.character_guild_name, null, 2).replace(/^"(.*)"$/, '$1')}</p>`;

                      })
                  .catch(error => {
                      console.error("API 요청 중 에러:", error.message);
                  });

              //fetch(charApiUrl, {headers: {"x-nxopen-api-key": API_KEY}})
          } else {
              console.error("API 응답 데이터 구조가 예상과 다릅니다.");
          }
      })
      .catch(error => console.error(error));   
}