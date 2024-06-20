const pages = document.querySelectorAll(".page");
const videos = document.querySelectorAll(".video");
let currentPageIndex = 0;
let isScrolling = false;

const remoteButtonsContainer = document.getElementById("remoteButtons");
const firstPageButton = document.getElementById("firstPageButton");
const lastPageButton = document.getElementById("lastPageButton");

let pageTimers = {
  page7: [],
  page8: [],
};

let pageChangeTimers = [];

function updateRemoteButtons() {
  remoteButtonsContainer.innerHTML = "";

  const totalPages = pages.length;
  const maxButtons = 5;
  const halfMaxButtons = Math.floor(maxButtons / 2);

  let startPage = Math.max(0, currentPageIndex - halfMaxButtons);
  let endPage = Math.min(totalPages - 1, currentPageIndex + halfMaxButtons);

  if (currentPageIndex <= halfMaxButtons) {
    endPage = Math.min(maxButtons - 1, totalPages - 1);
  } else if (currentPageIndex >= totalPages - halfMaxButtons - 1) {
    startPage = Math.max(totalPages - maxButtons, 0);
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement("div");
    button.className = "button";
    // button.textContent = i + 1;
    button.addEventListener("click", () => {
      scrollToPage(i);
    });
    remoteButtonsContainer.appendChild(button);
  }
}

function scrollToPage(index, smooth = true) {
  if (index < 0 || index >= pages.length) return;
  const nextPage = pages[index];
  window.scrollTo({ top: nextPage.offsetTop, behavior: smooth ? "smooth" : "auto" });
  currentPageIndex = index;

  playVideo(index);
  // 우산쓴 오리 이미지 지우기
  removeRandomRainImage();
  // 걸어가는 모션의 이미지 지우기
  removeRandomWalkingImage();

  // 오리발바닥 커서 이미지 숨기기
  document.getElementById("page6Cursor").style.display = "none";
  // 각 page별로 적용될 내용
  if (index == 5) {
    // page6
    showGameIntro(nextPage, 7000, 3000);
    // 오리발바닥 커서 이미지 표시하기
    document.getElementById("page6Cursor").style.display = "block";
  } else if (index == 6) {
    // page7
    showGameIntro(nextPage, 5000, 3000);
    // 우산쓴 오리 이미지 개수
    const imgCnt = 50;
    for (let i = 0; i < imgCnt; i++) {
      const timerId = setTimeout(addRandomRainImage, i * 1000);
      pageTimers["page7"].push(timerId);
    }
  } else if (index == 7) {
    // page8
    showGameIntro(nextPage, 5000, 3000);
    // 걸어가는 오리 이미지 개수
    const ducks = [
      { bottom: 10, duration: 10 },
      { bottom: 10, duration: 12 },
      { bottom: 10, duration: 14 },
      { bottom: 10, duration: 16 },
      { bottom: 10, duration: 18 },
    ];

    ducks.forEach((duck, index) => {
      const timerId = setTimeout(
        () => addWalkingDuck(duck.bottom, duck.duration),
        index * 1000
      );
      pageTimers["page8"].push(timerId);
    });
  } else if (index == 8) {
    showGameIntro(nextPage, 5000, 3000);
    setupPage9();
  } else if (index == 9) {
    showGameIntro(nextPage, 5000, 3000);
  } else if (index == 10) {
    showGameIntro(nextPage, 5000, 0);
  }

  updateRemoteButtons();
}

function playVideo(index) {
  videos.forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });

  if (index >= 0 && index < videos.length) {
    videos[index].play();
  }
}

window.addEventListener("wheel", (event) => {
  if (isScrolling) return;
  isScrolling = true;

  const delta = Math.sign(event.deltaY);
  let nextPageIndex = currentPageIndex + delta;
  scrollToPage(nextPageIndex);

  setTimeout(() => {
    isScrolling = false;
  }, 800);
});

firstPageButton.addEventListener("click", () => {
  scrollToPage(0);
});

lastPageButton.addEventListener("click", () => {
  scrollToPage(pages.length - 1);
});

// pageObj: 화면전환이 필요한 대상 page div
// introMilSec: 화면전환시 몇 초 후에 전환할것인지 밀리세컨
// descriptionMilSec: 화면전환시 몇 초 후에 설명을 전환할것인지 밀리세컨
function showGameIntro(pageObj, introMilSec, descriptionMilSec) {
  const gameIntro = pageObj.querySelector(".game-intro");
  const gameContent = pageObj.querySelector(".game-content");
  const gameDescriptionOverlay = pageObj.querySelector(".game-description-overlay");

  gameIntro.style.display = "block";
  gameContent.style.display = "none";
  if (gameDescriptionOverlay) {
    gameDescriptionOverlay.style.display = "none";
  }

  pageChangeTimers.forEach((timerId) => clearTimeout(timerId));
  pageChangeTimers = []; // 배열 초기화

  let timerId1 = setTimeout(() => {
    gameIntro.style.display = "none";
    gameContent.style.display = "block";
    
    let isVideo = gameContent.querySelector('.video');
    if (isVideo) {
      isVideo.play();
    }

    if (gameDescriptionOverlay) {
      gameDescriptionOverlay.style.display = "flex";

      let timerId2 = setTimeout(() => {
        gameDescriptionOverlay.style.display = "none";
      }, descriptionMilSec); // 게임 설명 오버레이가 사라지는 시간
      pageChangeTimers.push(timerId2);
    }
  }, introMilSec); // 게임 콘텐츠와 설명 오버레이가 등장하는 시간

  pageChangeTimers.push(timerId1);
}

updateRemoteButtons();

document.addEventListener("DOMContentLoaded", function () {
  scrollToPage(0);

  pages[5].addEventListener("mousemove", function (e) {
    const cursor = document.getElementById("page6Cursor");
    cursor.style.left = e.pageX + "px";
    cursor.style.top = e.pageY + "px";
  });

  // 마우스 이동 이벤트 리스너
  pages[6].addEventListener("mousemove", function (e) {
    // 우산쓴 오리 이미지들을 선택합니다.
    const rainImages = document.querySelectorAll(".rain");
    // // 각도, 좌우 움직을 위한 세팅 값을 가져옵니다
    const containerWidth = pages[6].offsetWidth;
    const mouseX = e.clientX;
    const moveAmount = (mouseX / containerWidth) * 1000 - 500; // -50%에서 50% 사이의 값
    const offset = (mouseX / containerWidth - 0.5) * 2;

    rainImages.forEach((img, index) => {
      const speed = (index + 1) * 0.1;
      const rotation = offset * speed * 20;
      img.style.transform = `translateX(${moveAmount}px) rotate(${rotation}deg)`;
    });
  });
});
