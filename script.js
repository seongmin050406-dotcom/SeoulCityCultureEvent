window.onload = function () {
  getEvent();
};

const SERVICE_KEY = "5562556d6279736d31303371487a5343";

/*
  ✔ GitHub Pages 대응용 URL
  - https 사용
  - CORS 프록시(allorigins) 사용
*/
const API_URL = `https://thingproxy.freeboard.io/fetch/https://openapi.seoul.go.kr:8088/${SERVICE_KEY}/json/culturalEventInfo/1/1000/`;

const dataDiv = document.getElementById("dataDiv");
const watchButton = document.getElementById("what");
const gu = document.getElementById("gu");

async function getEvent() {
  dataDiv.innerHTML = "";

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const eventList = data.culturalEventInfo.row;

    buildCategoryOptions(eventList);
    showEvents(eventList);

    watchButton.onclick = () => {
      const selected = gu.value;
      const filtered = selected
        ? eventList.filter(e => e.CODENAME === selected)
        : eventList;
      showEvents(filtered);
    };

  } catch (err) {
    console.error(err);
    dataDiv.innerHTML = "데이터 로드 실패";
  }
}

function buildCategoryOptions(list) {
  gu.innerHTML = `<option value="">전체</option>`;

  const categories = [...new Set(list.map(e => e.CODENAME))];

  categories.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    gu.appendChild(opt);
  });
}

function showEvents(list) {
  dataDiv.innerHTML = "";

  if (list.length === 0) {
    dataDiv.innerHTML = "조회 결과가 없습니다.";
    return;
  }

  list.forEach(event => {
    const card = document.createElement("div");
    card.className = "card event-card";

    // 이미지
    if (event.MAIN_IMG) {
      const img = document.createElement("img");
      img.src = event.MAIN_IMG;
      img.className = "event-poster";
      img.alt = event.TITLE;
      card.appendChild(img);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    body.innerHTML = `
      <h6>${event.TITLE}</h6>
      <p>${event.DATE}</p>
      <p>${event.PLACE}</p>
      <a class="btn btn-primary mt-2"
         href="${event.ORG_LINK}"
         target="_blank"
         rel="noopener noreferrer">
         홈페이지 바로가기
      </a>
    `;

    card.appendChild(body);
    dataDiv.appendChild(card);
  });
}

