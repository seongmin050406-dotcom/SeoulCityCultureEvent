window.onload = () => getEvent();

const SERVICE_KEY = "5562556d6279736d31303371487a5343";
const API_URL =
  "https://corsproxy.io/?" +
  encodeURIComponent(
    `http://openapi.seoul.go.kr:8088/${SERVICE_KEY}/json/culturalEventInfo/1/1000/`
  );

const dataDiv = document.getElementById("dataDiv");
const watchButton = document.getElementById("what");
const gu = document.getElementById("gu");

let eventList = [];

async function getEvent() {
  dataDiv.innerHTML = "로딩 중...";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data.culturalEventInfo) {
      throw new Error("API 응답 오류");
    }

    eventList = data.culturalEventInfo.row;

    buildCategoryOptions(eventList);
    showEvents(eventList);

    watchButton.onclick = () => {
      const selected = gu.value;
      const filtered = selected
        ? eventList.filter(e => e.CODENAME === selected)
        : eventList;
      showEvents(filtered);
    };

  } catch (e) {
    console.error(e);
    dataDiv.innerHTML = "데이터 로드 실패";
  }
}

function buildCategoryOptions(list) {
  gu.innerHTML = `<option value="">전체</option>`;
  [...new Set(list.map(e => e.CODENAME))].forEach(c => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    gu.appendChild(o);
  });
}

function showEvents(list) {
  dataDiv.innerHTML = "";
  list.forEach(e => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h5>${e.TITLE}</h5>
      <p>${e.DATE}</p>
      <p>${e.PLACE}</p>
      <hr/>
    `;
    dataDiv.appendChild(div);
  });
}
