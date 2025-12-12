window.onload = () => {
  loadCategories();
  document.getElementById("what").addEventListener("click", searchEvents);
};

// CORS 프록시 없이 직접 호출
const SERVICE_KEY = "794a54587279736d36357062427047";
const API_URL = `http://openapi.seoul.go.kr:8088/${SERVICE_KEY}/json/culturalEventInfo/1/1000/`;

let allEvents = [];

// 페이지 로드 시 데이터 가져오기 및 카테고리 로드
async function loadCategories() {
  const dataDiv = document.getElementById("dataDiv");
  dataDiv.innerHTML = "데이터 로딩 중...";
  
  try {
    const res = await fetch(API_URL);
    
    if (!res.ok) {
      dataDiv.innerHTML = `API 오류: ${res.status} - ${res.statusText}<br>API 키를 확인해주세요.`;
      console.error("HTTP 에러:", res.status);
      return;
    }
    
    const data = await res.json();
    console.log("API 전체 응답:", data);
    
    // API 응답 구조 확인
    if (!data.culturalEventInfo) {
      dataDiv.innerHTML = "API 응답 형식 오류";
      console.log("응답 구조:", Object.keys(data));
      return;
    }
    
    if (data.culturalEventInfo.RESULT) {
      const result = data.culturalEventInfo.RESULT;
      dataDiv.innerHTML = `API 에러: ${result.CODE} - ${result.MESSAGE}`;
      console.error("API 에러:", result);
      return;
    }
    
    if (!data.culturalEventInfo.row) {
      dataDiv.innerHTML = "데이터가 없습니다.";
      return;
    }
    
    allEvents = data.culturalEventInfo.row;
    console.log("로드된 이벤트 수:", allEvents.length);
    
    // 공연 분야(CODENAME) 추출 및 select에 추가
    const categories = [...new Set(allEvents.map(event => event.CODENAME).filter(Boolean))];
    const selectEl = document.getElementById("gu");
    
    // 기존 옵션 제거 (첫 번째 "공연 분야" 옵션 제외)
    while (selectEl.options.length > 1) {
      selectEl.remove(1);
    }
    
    categories.sort().forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      selectEl.appendChild(option);
    });
    
    dataDiv.innerHTML = `<p class="text-center w-100">총 ${allEvents.length}건의 행사가 있습니다.<br>공연 분야를 선택하고 검색 버튼을 눌러주세요.</p>`;
    
  } catch (e) {
    console.error("네트워크 에러:", e);
    dataDiv.innerHTML = `네트워크 오류: ${e.message}<br><br>
      <small>해결 방법:<br>
      1. 브라우저 설정에서 '안전하지 않은 콘텐츠' 허용<br>
      2. 또는 HTTPS 사이트에서 실행<br>
      3. 로컬 서버(localhost) 사용</small>`;
  }
}

// 검색 버튼 클릭 시
function searchEvents() {
  const selectedCategory = document.getElementById("gu").value;
  const dataDiv = document.getElementById("dataDiv");
  
  if (!selectedCategory) {
    dataDiv.innerHTML = `<p class="text-center w-100 text-danger">공연 분야를 선택해주세요.</p>`;
    return;
  }
  
  const filtered = allEvents.filter(event => event.CODENAME === selectedCategory);
  
  if (filtered.length === 0) {
    dataDiv.innerHTML = `<p class="text-center w-100">해당 분야의 행사가 없습니다.</p>`;
    return;
  }
  
  // 결과 카드 형식으로 표시
  let html = '';
  filtered.forEach(event => {
    const imgUrl = event.MAIN_IMG || 'https://via.placeholder.com/260x350?text=No+Image';
    const title = event.TITLE || '제목 없음';
    const place = event.PLACE || '장소 미정';
    const date = event.DATE || '기간 미정';
    const codename = event.CODENAME || '';
    
    html += `
      <div class="card event-card">
        <img src="${imgUrl}" 
             class="card-img-top event-poster" 
             alt="${title}"
             onerror="this.src='https://via.placeholder.com/260x350?text=No+Image'">
        <div class="card-body">
          <h6 class="card-title">${title}</h6>
          <p class="card-text small">
            <strong>장소:</strong> ${place}<br>
            <strong>기간:</strong> ${date}<br>
            <strong>분야:</strong> ${codename}
          </p>
          ${event.ORG_LINK ? `<a href="${event.ORG_LINK}" target="_blank" class="btn btn-sm btn-primary">상세보기</a>` : ''}
        </div>
      </div>
    `;
  });
  
  dataDiv.innerHTML = html;
}
