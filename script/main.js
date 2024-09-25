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
let duckSoundTimer = null;

function playRandomDuckSound(mode) {
  let sounds = ["./audio/오리소리1.mp3", "./audio/오리소리2.wav", "./audio/오리소리3.wav"];
  if (mode == 'move') {
    sounds = ["./audio/오리바둥바둥소리1.wav", "./audio/오리바둥바둥소리2.wav"];
  }

  const randomIndex = Math.floor(Math.random() * sounds.length);
  const audio = new Audio(sounds[randomIndex]);
  audio.play();
}

function startSound(interval = 5000) {
  if (duckSoundTimer) {
    clearInterval(duckSoundTimer); // 기존 타이머가 있다면 제거
  }
  duckSoundTimer = setInterval(() => playRandomDuckSound(), interval);
}

function stopSound() {
  if (duckSoundTimer) {
    clearInterval(duckSoundTimer);
    duckSoundTimer = null;
  }
}

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
  let videoDuration = 0;
  window.scrollTo({ top: nextPage.offsetTop, behavior: smooth ? "smooth" : "auto" });
  currentPageIndex = index;

  playVideo(index);
  // 우산쓴 오리 이미지 지우기
  removeRandomRainImage();
  // 빗방울 제거
  removeRainDrops();
  // 걸어가는 모션의 이미지 지우기
  removeRandomWalkingImage();
  // 페이지 이동 시 기존 타이머 제거
  stopSound();

  // 오리발바닥 커서 이미지 숨기기
  document.getElementById("page6Cursor").style.display = "none";
  // 각 page별로 적용될 내용
  if (index == 5) {
    // page6
    showGameIntro(nextPage, 8000, 7000);
    // 오리발바닥 커서 이미지 표시하기
    document.getElementById("page6Cursor").style.display = "block";
  } else if (index == 6) {
    videoDuration = 7000;
    // page7
    showGameIntro(nextPage, videoDuration, 3000);
    
    const numberOfDrops = 70; // 생성할 빗방울의 개수
    const rainDiv = document.getElementsByClassName('rain');
    for (let i = 0; i < rainDiv?.length; i++) {
      rainDiv[i].remove();
    }
    
    // 빗방울을 numberOfDrops 개수만큼 생성
    for (let i = 0; i < numberOfDrops; i++) {
      createRainDrop();
    }

    // 우산쓴 오리 이미지 개수
    const imgCnt = 20;
    for (let i = 0; i < imgCnt; i++) {
      const timerId = setTimeout(addRandomRainImage, i * 1000);
      pageTimers["page7"].push(timerId);
    }
    // 영상 재생이 끝난 후에 오리 소리 재생 시작
    setTimeout(() => {
      startSound(2000);
    }, videoDuration);
  } else if (index == 7) {
    videoDuration = 8000;
    // page8
    showGameIntro(nextPage, videoDuration, 3000);
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

    // 영상 재생이 끝난 후에 오리 소리 재생 시작
    setTimeout(() => {
      startSound(2000);
    }, videoDuration);
  } else if (index == 8) {
    showGameIntro(nextPage, 7000, 3000);
    setupPage9();
  } else if (index == 9) {
    videoDuration = 8000;
    showGameIntro(nextPage, videoDuration, 3000);
    setTimeout(() => {
      startSound(2000);
    }, videoDuration);
  } else if (index == 10) {
    // showGameIntro(nextPage, 5000, 0);
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

      gameDescriptionOverlay.addEventListener('click', () => {
        gameDescriptionOverlay.style.display = "none";
      });
    }
  }, introMilSec); // 게임 콘텐츠와 설명 오버레이가 등장하는 시간

  pageChangeTimers.push(timerId1);
}

function endingCreditAction() {
  const duckSole = document.getElementById("endingDuckSole");
  const endingCredit = document.getElementById("endingCredit");
  const creditImage = document.getElementById("creditImage");
  const imageHeight = creditImage.offsetHeight;

  // 엔딩 크레딧 스크롤 속도 (초 단위)
  const scrollDuration = 35; // 원하는 속도 조정 가능 (초 단위)

  // 이미지가 로드된 후 실행되는 함수
  function calculateImageHeight() {
    //const windowHeight = window.innerHeight; // 브라우저 창 높이
    const startBottom = -imageHeight; // 이미지 전체가 안보이는 하단 영역에서 시작

    // 엔딩 크레딧에 dynamic한 bottom 값 설정
    endingCredit.style.setProperty("--start-bottom", `${startBottom}px`);
    endingCredit.style.setProperty("--scroll-duration", `${scrollDuration}s`);
    endingCredit.style.display = "none";
  }

  function resetEndingCredit() {
    endingCredit.style.display = "none";
    endingCredit.classList.remove("animated-credit");
    duckSole.style.display = "block";
    duckSole.classList.remove("fade-out");
    calculateImageHeight(); // 다시 시작 위치로 이동
  }

  // 이미지가 이미 로드된 상태인지 확인
  if (creditImage.complete) {
    calculateImageHeight(); // 이미지가 이미 로드되었으면 즉시 실행
  } else {
    // 이미지가 로드되지 않았다면 onload 이벤트 사용
    creditImage.onload = function() {
      calculateImageHeight(); // 이미지가 로드되면 실행
    };
  }

  // 발바닥 클릭 시 엔딩 크레딧 애니메이션 시작
  duckSole.addEventListener("click", function() {
    // 발바닥 페이드 아웃
    duckSole.classList.remove("fade-out"); // 클래스 제거
    void duckSole.offsetWidth;
    duckSole.classList.add("fade-out"); // 다시 클래스 추가

    // 엔딩 크레딧 애니메이션 시작
    setTimeout(() => {
      duckSole.style.display = "none"; // 발바닥 이미지 숨김
      endingCredit.style.display = "flex"; // 엔딩 크레딧 표시
      endingCredit.classList.add("animated-credit");

      endingCredit.addEventListener("animationend", function () {
        resetEndingCredit(); // 애니메이션이 끝나면 초기화
      }, { once: true });
    }, 1000); // 페이드 아웃 후 1초 대기
  });

  // 엔딩 크레딧 클릭 시 발바닥 다시 표시
  endingCredit.addEventListener("click", function() {
    // 엔딩 크레딧 리셋
    resetEndingCredit();

    // 발바닥 다시 표시
    duckSole.style.display = "block";
    duckSole.classList.remove("fade-out");
  });

  resetEndingCredit();
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
    const rainImages = document.querySelectorAll(".rain-duck");
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

    // playRandomDuckSound('');
  });

  const backgroundMusic = document.getElementById("backgroundMusic");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeIcon = document.getElementById("volumeIcon");

  let isMuted = true;

  volumeSlider.addEventListener("input", function () {
    const volume = volumeSlider.value / 100;
    backgroundMusic.volume = volume;

    if (volume > 0 && isMuted) {
      isMuted = false;
      backgroundMusic.muted = false;
      backgroundMusic.play().catch(error => {
        console.log("Music playback failed:", error);
      });
      volumeIcon.classList.remove("fa-volume-mute");
      volumeIcon.classList.add("fa-volume-up");
    }

    if (volume === 0) {
      isMuted = true;
      backgroundMusic.muted = true;
      volumeIcon.classList.remove("fa-volume-up");
      volumeIcon.classList.add("fa-volume-mute");
    }
  });

  volumeIcon.addEventListener("click", function () {
    if (isMuted) {
      isMuted = false;
      backgroundMusic.muted = false;
      backgroundMusic.play().catch(error => {
        console.log("Music playback failed:", error);
      });
      backgroundMusic.volume = 1;
      volumeSlider.value = 100;
      volumeIcon.classList.remove("fa-volume-mute");
      volumeIcon.classList.add("fa-volume-up");
    } else {
      isMuted = true;
      backgroundMusic.muted = true;
      backgroundMusic.pause();
      volumeSlider.value = 0;
      volumeIcon.classList.remove("fa-volume-up");
      volumeIcon.classList.add("fa-volume-mute");
    }
  });

  const waveDuck = document.getElementById("waveDuck");
  const page10Container = document.getElementById("page10Container");

  page10Container.addEventListener("mousemove", function(event) {
    const containerRect = page10Container.getBoundingClientRect();
    const mouseY = event.clientY - containerRect.top;
    
    waveDuck.style.top = `${mouseY}px`;
  });

  endingCreditAction();
});
