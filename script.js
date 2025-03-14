// 팝업 열기
function openArchivePopup() {
    document.getElementById('archivePopup').style.display = 'flex';
}

// 팝업 닫기
function closeArchivePopup() {
    document.getElementById('archivePopup').style.display = 'none';
}

// 썸네일 클릭 시 메인 이미지 변경
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('mainDisplayImage');
    mainImage.src = thumbnail.src;
}

document.getElementById('textInput').addEventListener('click', function() {
  document.querySelector('.popup').classList.add('small');
  document.querySelector('.popupText').classList.add('small');
});


const imagesPath = "images/";
const specialChars = {
    '♥': '하트',
    '★': '별',
    '!': '느낌표',
    '?': '물음표',
    '~': '물결',
    '.': '점',
    ',': '반점',
    '^': '웃음',
    ')': '오른괄호',
    '(': '왼괄호'
};

const filters = [
    "invert(49%) sepia(98%) saturate(356%) hue-rotate(95deg) brightness(104%) contrast(104%)",      // green
    "invert(83%) sepia(35%) saturate(1543%) hue-rotate(229deg) brightness(101%) contrast(102%)",       // violet
    "invert(36%) sepia(0%) saturate(0%) hue-rotate(14deg) brightness(95%) contrast(91%)",       // pink   
    "invert(72%) sepia(9%) saturate(370%) hue-rotate(18deg) brightness(89%) contrast(88%)",        // gray
    "invert(52%) sepia(78%) saturate(4762%) hue-rotate(340deg) brightness(99%) contrast(108%)"         // red
];

let filterAssigned = false;  // 필터 값이 할당되었는지 여부를 추적
let currentFilter;

function getRandomFilter() {
    return filters[Math.floor(Math.random() * filters.length)];
}

function assignRandomFilterToImage(imageElement) {
    if (!filterAssigned) {
        currentFilter = getRandomFilter();  // 필터를 한 번만 랜덤으로 생성
        filterAssigned = true;  // 필터가 이미 할당되었음을 표시
    }
    imageElement.style.filter = currentFilter;  // 현재 필터를 이미지에 적용
}


function decomposeHangul(letter) {
    const CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
    const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const jongImageMap = {
    'ㄳ': 'ㄱㅅ', 
    'ㄵ': 'ㄴㅈ',
    "ㄶ": 'ㄴㅎ',
    'ㄺ': 'ㄹㄱ', 
    'ㄻ': 'ㄹㅁ',
    "ㄼ": 'ㄹㅂ',
    'ㄽ': 'ㄹㅅ', 
    'ㄾ': 'ㄹㅌ',
    "ㄿ": 'ㄹㅍ',
    'ㅀ': 'ㄹㅎ', 
    'ㅄ': 'ㅂㅅ'
    };

    function getJongImage(jong) {
        return jongImageMap[jong] || jong; // 겹자음 변환
    }


    const BASE_CODE = 44032;
    const HANGUL_COUNT = 11172;


    let code = letter.charCodeAt(0) - BASE_CODE;
    if (code < 0 || code >= HANGUL_COUNT) return [letter, null, null];

    let cho = CHO[Math.floor(code / 588)];
    let jung = JUNG[Math.floor((code % 588) / 28)];
    let jong = JONG[code % 28];

    if (jong) {
        jong = getJongImage(jong); // 겹자음에 대한 이미지 파일 이름으로 변환
    }

    return [cho, jung, jong, null];
}

function updateTypography() {
    const text = document.getElementById("textInput").value;
    const output = document.getElementById("outputArea");
    output.innerHTML = "";

    let totalLetters = text.length;
    let maxSize = 300; // 최대 크기 제한
    let mobileFactor = window.innerWidth <= 600 ? 0.3 : 1; // 모바일에서는 글자 크기를 50%로 줄임
    let baseSize = Math.min(maxSize, Math.floor((800 / totalLetters) * mobileFactor)); 

    let minSize = window.innerWidth <= 600 ? 50 : 100; // 모바일에서는 최소 30px, 기본은 100px
    let letterSize = Math.max(minSize, baseSize);

    for (let char of text) {

        let letterDiv = document.createElement("div");
        letterDiv.className = "letter";

        if (char === ' ') {
            letterDiv.style.width = `${letterSize /2.5}px`;
            letterDiv.style.height = `${letterSize}px`;
            output.appendChild(letterDiv);
            continue; // 띄어쓰기는 더 이상 처리하지 않음
        }


        if (specialChars[char]) {
            let div = document.createElement("div");
            div.className = "letter";
            div.style.width = `${letterSize}px`;
            div.style.height = `${letterSize}px`;
            div.style.position = "relative";
            div.style.display = "flex";
            div.style.justifyContent = "center";
            div.style.alignItems = "center";

            // 특수 문자 이미지 생성
            let img = document.createElement("img");
            img.src = `${imagesPath}${specialChars[char]}.png`; // 특수 문자에 맞는 이미지 경로
            img.style.width = `${letterSize}px`;
            img.style.height = `${letterSize}px`;

            // 필터가 이미 설정되어 있는지 확인
            if (!img.dataset.filter) {
                img.dataset.filter = getRandomFilter(); // 필터를 한 번만 랜덤으로 생성
            }
            img.style.filter = img.dataset.filter; // 현재 필터를 이미지에 적용

            div.appendChild(img);
            output.appendChild(div);
            continue; // 특수 문자는 더 이상 처리하지 않음
        }

        let [cho, jung, jong] = decomposeHangul(char);
        let div = document.createElement("div");
        div.className = "letter";
        div.style.width = `${letterSize}px`;
        div.style.height = `${letterSize}px`;
        div.style.position = "relative";
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";

        let container = document.createElement("div");
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.position = "relative";

        let imgSize = letterSize * 1; // 기본 이미지 크기 (전체 크기의 90%)

        // 초성 추가
        if (cho) {
        let img = document.createElement("img");
        img.src = `${imagesPath}${cho}.png`;

        if (!img.dataset.filter) {
                img.dataset.filter = getRandomFilter(); // 필터를 한 번만 랜덤으로 생성
            }
            img.style.filter = img.dataset.filter; // 현재 필터를 이미지에 적용


        img.onerror = function() {
            img.style.display = "none"; // 이미지 숨기기
            let textDiv = document.createElement("div");
            textDiv.innerText = cho; // 초성을 텍스트로 표시
            textDiv.style.fontSize = `${letterSize * 1.2}px`; // 크기 조정
            textDiv.style.fontFamily = "Happiness Sans, sans-serif";
            textDiv.style.textAlign = "center"; // 중앙 정렬
            textDiv.style.filter = getRandomFilter();
            textDiv.style.position = "absolute";
            textDiv.style.top = "-20%";

            container.appendChild(textDiv);
        };

        let isHorizontalJung = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅣ", "ㅔ", "ㅖ", "ㅐ", "ㅒ"].includes(jung);
        let isVerticalJung = ["ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ"].includes(jung);
        let isComplexJung = ["ㅘ", "ㅢ", "ㅝ", "ㅞ", "ㅟ", "ㅚ", "ㅙ"].includes(jung);

        let hasJong = jong ? true : false; // 종성이 있는지 확인


        // 중성이 있는 경우 초성 크기 축소
        let choWidth = imgSize * 1;  // 기본 크기
        let choHeight = imgSize * 1; // 기본 크기

        if (isVerticalJung) {
            choHeight = imgSize * 0.6;
            choWidth = imgSize * 0.8; 
            img.style.left = "50%";
            img.style.top = "0";
            img.style.transform = "translateX(-50%)";
        } 

        if (isHorizontalJung) {
            choHeight = imgSize * 0.7; 
            choWidth = imgSize * 0.7; // 세로 크기만 줄이기
        }

        if (hasJong) {
        choWidth *= 0.9;
        choHeight *= 0.9;
        }

        img.style.width = `${choWidth}px`;
        img.style.height = `${choHeight}px`;
        img.style.filter = getRandomFilter();

        img.style.position = "absolute";
        img.style.left = "0";

        if (isVerticalJung) {
        img.style.left = "50%";
        img.style.top = "0%"; // 종성이 있으면 살짝 올리기
        } else if (isHorizontalJung) {
            img.style.top = "0%"; // 종성이 있으면 덜 내리기

        } else if (isComplexJung) {
            img.style.top = "0%";
            img.style.left = "0%"; 
            img.style.width = "80%";
            img.style.height = "60%";// 종성이 있으면 덜 내리기
        }


        container.appendChild(img);
    }


        // 중성 추가
        if (jung) {
            let img = document.createElement("img");
            img.src = `${imagesPath}${jung}.png`;

            if (!img.dataset.filter) {
                img.dataset.filter = getRandomFilter(); // 필터를 한 번만 랜덤으로 생성
            }
            img.style.filter = img.dataset.filter; // 현재 필터를 이미지에 적용

            img.style.position = "absolute";

            img.onerror = function() {
                img.style.display = "none"; // 이미지 숨기기
                let textDiv = document.createElement("div");
                textDiv.innerText = cho; // 초성을 텍스트로 표시
                textDiv.style.fontSize = `${letterSize * 1.2}px`; // 크기 조정
                textDiv.style.fontFamily = "Happiness Sans, sans-serif";
                textDiv.style.textAlign = "center"; // 중앙 정렬
                textDiv.style.filter = getRandomFilter();
                textDiv.style.position = "absolute";
                textDiv.style.top = "-20%";

                container.appendChild(textDiv);
            };


            let isHorizontalJung = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅣ", "ㅔ", "ㅖ", "ㅐ", "ㅒ"].includes(jung);
            let isVerticalJung = ["ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ"].includes(jung);
            let isComplexJung = ["ㅘ", "ㅢ", "ㅝ", "ㅞ", "ㅟ", "ㅚ", "ㅙ"].includes(jung);
            let hasJong = jong ? true : false;

            let jungWidth = imgSize * 0.8;
            let jungHeight = imgSize * 0.8;
            
            if (isHorizontalJung) {
                jungWidth = imgSize * 0.8;
                img.style.top = "-10%";
                img.style.right = "-25%";
            } else if (isVerticalJung) {
                jungWidth = imgSize * 0.9;
                jungHeight = imgSize * 0.7;
                img.style.top = hasJong ? "35%" : "45%";
                img.style.left = "50%";
                img.style.transform = "translateX(-50%)";
            } else if (isComplexJung) {
                jungWidth = imgSize * 0.9;
                jungHeight = imgSize * 0.9;
                img.style.top = "15%";
                img.style.left = "50%";
                img.style.transform = "translateX(-50%)";
            }

            img.style.width = `${jungWidth}px`;
            img.style.height = `${jungHeight}px`;

            img.style.filter = getRandomFilter();

            container.appendChild(img);
        }
        // 종성 추가
        if (jong) {
            let img = document.createElement("img");
            img.src = `${imagesPath}${jong}.png`;

            if (!img.dataset.filter) {
                img.dataset.filter = getRandomFilter(); // 필터를 한 번만 랜덤으로 생성
            }
            img.style.filter = img.dataset.filter; // 현재 필터를 이미지에 적용


            img.onerror = function() {
                img.style.display = "none"; // 이미지 숨기기
                let textDiv = document.createElement("div");
                textDiv.innerText = cho; // 초성을 텍스트로 표시
                textDiv.style.fontSize = `${letterSize * 1.2}px`; // 크기 조정
                textDiv.style.fontFamily = "Happiness Sans, sans-serif";
                textDiv.style.textAlign = "center"; // 중앙 정렬
                textDiv.style.filter = getRandomFilter();
                textDiv.style.position = "absolute";
                textDiv.style.top = "-20%";

                container.appendChild(textDiv);
            };
            
            let isHorizontalJung = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅣ", "ㅔ", "ㅖ", "ㅐ", "ㅒ"].includes(jung);
            let isVerticalJung = ["ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ"].includes(jung);
            let isComplexJung = ["ㅘ", "ㅢ", "ㅝ", "ㅞ", "ㅟ", "ㅚ", "ㅙ"].includes(jung);

            let jongSize = imgSize * 0.8; // 기본 크기
            let jongBottom = "0%"; // 기본 위치
            let jongLeft = "55%";
            
            if (isHorizontalJung) {
                jongSize = imgSize * 0.7; // 가로형 중성이 있을 때 종성 크기 약간 축소
                jongBottom = "-30%"; // 종성을 조금 더 아래로 배치
                jongLeft = "55%"; // 약간 오른쪽 이동
            } else if (isVerticalJung) {
                jongSize = imgSize * 0.7; // 세로형 중성이 있을 때 종성 크기 조정
                jongBottom = "-55%"; // 종성을 기본보다 살짝 위로
                jongLeft = "55%"; // 중앙 정렬

            } else if (isComplexJung) {
                jongSize = imgSize * 0.7; // 세로형 중성이 있을 때 종성 크기 조정
                jongBottom = "-50%"; // 종성을 기본보다 살짝 위로
                jongLeft = "55%"; // 중앙 정렬
            }

            img.style.width = `${jongSize}px`;
            img.style.position = "absolute";
            img.style.bottom = jongBottom;
            img.style.left = jongLeft;
            img.style.transform = "translateX(-50%)";

            img.style.filter = getRandomFilter();

                container.appendChild(img);
            }


        div.appendChild(container);
        output.appendChild(div);
    } 
}
