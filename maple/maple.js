
        document.getElementById('characterNameInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        // Enter 키를 눌렀을 때의 동작
        callApi();
    }
});
      const API_KEY = "test_7b313a47a964f9c8327f1a38719513991c6c0a1413a493b5b08a99c25f14cfa3b1f7bc16310b71b97d5ac7108cd5fcf9";
      const resultElement = document.getElementById('result');
      const dateInput = document.getElementById('dateInput');
  
      function callApi() {
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
  
            // 예시: 웹 페이지에 결과를 표시
            // document.write(`Character ID: ${data.ocid}`);
  
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
                .then(([charData, statData]) => {
                    console.log("Character API 응답 데이터:", charData);
                    console.log("Stat API 응답 데이터:", statData);
  
                    // 결과를 화면에 추가
                    
                    
  
                    if (charData.character_image) {
                        // 이미지가 있는 경우 이미지 출력
                        const imageElement = document.createElement('img');
                        imageElement.src = charData.character_image;
                        resultElement.appendChild(imageElement);
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

                // Stat API 응답 데이터를 리스트로 출력
                if (statData.final_stat && Array.isArray(statData.final_stat)) {
                    const statList = document.createElement('ul');
                    statData.final_stat.forEach(statGroup => {
                        // 여기서 조건을 설정하여 필터링할 수 있습니다.
                        if (statGroup.stat_name === '최소 스탯공격력') {
                            // statGroup 내의 객체를 순회하면서 속성을 가져와서 리스트 아이템으로 추가
                            const statValue = '스탯공격력 : '+ statGroup.stat_value;

                            // 텍스트 노드를 생성하고 문자열을 설정
                            const textNode = document.createTextNode(statValue);

                            // 텍스트 노드를 직접 body에 추가
                            resultElement.appendChild(textNode);
                        }
                        if (statGroup.stat_name === '최대 스탯공격력') {
                            // statGroup 내의 객체를 순회하면서 속성을 가져와서 리스트 아이템으로 추가
                            const statValue = ' ~ '+ statGroup.stat_value;

                            // 텍스트 노드를 생성하고 문자열을 설정
                            const textNode = document.createTextNode(statValue);

                            // 텍스트 노드를 직접 body에 추가
                            resultElement.appendChild(textNode);
                        }
                    });

                    // 결과에 추가
                    //if (resultElement) {
                    //    resultElement.appendChild(statList);
                    //} else {
                    //    console.error("HTML 문서에서 'result' id를 가진 요소를 찾을 수 없습니다.");
                    //}
                } else {

                console.error("Stat API 응답 데이터의 형식이 올바르지 않습니다.");
            }
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
