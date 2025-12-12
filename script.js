window.onload = () => getEvent();
const SERVICE_KEY = "5562556d6279736d31303371487a5343"; // 실제 키 확인 필요
const API_URL = `http://openapi.seoul.go.kr:8088/${SERVICE_KEY}/json/culturalEventInfo/1/1000/`;

async function getEvent() {
  const dataDiv = document.getElementById("dataDiv");
  dataDiv.innerHTML = "로딩 중...";
  try {
    const res = await fetch(API_URL);
    
    // 응답 상태 확인
    if (!res.ok) {
      dataDiv.innerHTML = `API 오류: ${res.status} ${res.statusText}`;
      return;
    }
    
    const data = await res.json();
    console.log(data); // 전체 응답 확인
    
    // API 응답 구조 확인
    if (!data.culturalEventInfo || !data.culturalEventInfo.row) {
      dataDiv.innerHTML = "데이터가 없습니다. API 키를 확인하세요.";
      console.log("API 응답:", data); // 실제 응답 구조 확인
      return;
    }
    
    dataDiv.innerHTML = "데이터 로드 성공: " + data.culturalEventInfo.row.length + "건";
    
  } catch (e) {
    console.error("에러 상세:", e);
    dataDiv.innerHTML = "네트워크 오류: " + e.message;
  }
}
