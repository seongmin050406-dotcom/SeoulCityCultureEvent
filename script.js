window.onload = () => getEvent();

const SERVICE_KEY = "5562556d6279736d31303371487a5343";
const API_URL =
  `https://openapi.seoul.go.kr:8088/${SERVICE_KEY}/json/culturalEventInfo/1/1000/`;

async function getEvent() {
  const dataDiv = document.getElementById("dataDiv");
  dataDiv.innerHTML = "로딩 중...";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    console.log(data); // ★ 이거 중요

    if (!data.culturalEventInfo) {
      dataDiv.innerHTML = "API 응답 오류";
      return;
    }

    dataDiv.innerHTML =
      "데이터 로드 성공: " + data.culturalEventInfo.row.length + "건";

  } catch (e) {
    console.error(e);
    dataDiv.innerHTML = "네트워크 오류";
  }
}
