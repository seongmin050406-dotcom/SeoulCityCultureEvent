window.onload = () => {
  loadCategories();
  document.getElementById("what").addEventListener("click", searchEvents);
};

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
      dataDiv.innerHTML = `API 오류: ${res.status} ${res.statusText}`;
      return;
    }
    
    const data = await res.json();
    console.log("API 응답:", data);
    
    if (!data.culturalEventInfo || !data.culturalEventInfo.row) {
      dataDiv.innerHTML = "데이터가 없습니다. API 응답을 확인하세요.";
      console.log("전체 응답 구조:", data);
      return;
    }
    
    allEvents = data.culturalEventInfo.row;
    
    // 공연 분야(CODENAME) 추출 및 select에 추가
    const categories = [...new Set(allEvents.map(event => event.CODENAME))];
    const selectEl = document.getElementById("gu");
    
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      selectEl.appendChild(option);
    });
    
    dataDiv.innerHTML = `<p class="text-center w-100">총 ${allEvents.length}건의 행사가 있습니다.<br>공연 분야를 선택하고 검색 버튼을 눌러주세요.</p>`;
    
  } catch (e) {
    console.error("에러 상세:", e);
    dataDiv.innerHTML = `네트워크 오류: ${e.message}`;
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
    html += `
      <div class="card event-card">
        <img src="${event.MAIN_IMG || 'https://via.placeholder.com/260x350?text=No+Image'}" 
             class="card-img-top event-poster" 
             alt="${event.TITLE}">
        <div class="card-body">
          <h6 class="card-title">${event.TITLE}</h6>
          <p class="card-text small">
            <strong>장소:</strong> ${event.PLACE}<br>
            <strong>기간:</strong> ${event.DATE}<br>
            <strong>분야:</strong> ${event.CODENAME}
          </p>
          ${event.ORG_LINK ? `<a href="${event.ORG_LINK}" target="_blank" class="btn btn-sm btn-primary">상세보기</a>` : ''}
        </div>
      </div>
    `;
  });
  
  dataDiv.innerHTML = html;
}
