pages[4].addEventListener("click", function (e) {
  const gifUrl = "./image/wave.gif"; // 여기에 실제 GIF URL을 넣으세요.
  const gif = document.createElement("img");
  gif.src = gifUrl;
  gif.width = "10rem";
  gif.height = "10rem";
  gif.classList.add("gif");
  gif.style.left = `${e.clientX}px`;
  gif.style.top = `${e.clientY}px`;
  pages[4].appendChild(gif);

  // 애니메이션이 끝난 후 GIF 이미지를 제거
  gif.addEventListener("animationend", function () {
    gif.remove();
  });
});

// 우산을 쓴 오리 이미지를 생성하는 함수
function addRandomRainImage() {
  const rainContainer = document.getElementById("rainContainer");
  const img = document.createElement("img");
  img.src = "./image/umbrella_duck.gif";
  img.className = "rain";

  // 랜덤 크기 설정
  const randomSize = Math.random() * (20 - 10) + 10; // 10rem에서 20rem 사이의 크기
  img.style.width = randomSize + "rem";
  img.style.height = randomSize + "rem";

  // 랜덤 위치 설정
  const containerWidth = document.getElementById("page6").clientWidth;
  const containerHeight = document.getElementById("page6").clientHeight;
  const randomLeft = Math.floor(Math.random() * containerWidth);
  const randomTop = Math.floor(Math.random() * containerHeight) / 2;
  img.style.left = randomLeft + "px";
  img.style.top = "0px"; // 필요에 따라 조정 가능

  const duration = Math.random() * (10 - 5) + 5; // 5초에서 10초 사이의 지속 시간
  img.style.animation = `rain-fall ${duration}s linear infinite`;

  rainContainer.appendChild(img);
}

// 우산 쓴 오리 이미지를 지우는 함수
function removeRandomRainImage() {
  const rainContainer = document.getElementById("rainContainer");
  rainContainer.innerHTML = "";

  pageTimers["page6"].forEach((timerId) => clearTimeout(timerId));
  pageTimers["page6"] = []; // 배열 초기화
}

let isDragging = false; // 드래그 상태를 추적하기 위한 변수

// 오리가 걸어가는 모션의 이미지 생성
function addWalkingDuck(bottomPercentage, duration) {
  const moveContainer = document.getElementById("moveContainer");
  const img = document.createElement("img");
  img.src = "./image/walk_duck.gif"; // 오리 이미지 경로 설정
  img.className = "walking-duck";

  // 크기 설정
  img.style.width = "15rem";
  img.style.height = "15rem";

  img.style.bottom = bottomPercentage + "vh"; // 상대적 높이 설정
  img.style.animationDuration = duration + "s"; // 애니메이션 지속 시간 설정
  img.style.position = 'absolute'; // position 설정 추가

  let isDragging = false; // 드래그 상태를 추적하기 위한 변수
  let offsetX, offsetY; // 마우스 클릭 위치와 이미지 위치 간의 오프셋

  img.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  // 오리 클릭 이벤트 리스너 추가
  img.addEventListener("mousedown", (event) => {
    img.src = "./image/caught_duck.gif"; // 잡힌 오리 이미지 경로 설정
    img.style.animationPlayState = "paused"; // 애니메이션 일시 정지
    isDragging = true; // 드래그 시작
    offsetX = event.clientX - img.getBoundingClientRect().left;
    offsetY = event.clientY - img.getBoundingClientRect().top;
    img.style.cursor = "grabbing"; // 커서 변경

    // 오리 드래그 이동
    img.addEventListener("mousemove", onMouseMove);
    // 오리 드래그 종료
    img.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(event) {
    if (isDragging) {
      img.style.left = event.clientX - offsetX + "px";
      img.style.top = event.clientY - offsetY + "px";
    }
  }

  function onMouseUp() {
    if (isDragging) {
      img.src = "./image/walk_duck.gif"; // 다시 걷는 오리 이미지 경로 설정
      img.style.animationPlayState = "running"; // 애니메이션 재개
      isDragging = false; // 드래그 종료
      img.style.cursor = "grab"; // 커서 변경

      img.style.left = "";
      img.style.top = "";
      // 이벤트 리스너 제거
      img.removeEventListener("mousemove", onMouseMove);
      img.removeEventListener("mouseup", onMouseUp);
    }
  }

  moveContainer.appendChild(img);
}

// 걸어가는 모션의 이미지를 지우는 함수
function removeRandomWalkingImage() {
  const moveContainer = document.getElementById("moveContainer");
  moveContainer.innerHTML = "";

  pageTimers["page7"].forEach((timerId) => clearTimeout(timerId));
  pageTimers["page7"] = []; // 배열 초기화
}
