function openArchivePopup() {
    document.getElementById('archivePopup').style.display = 'flex';
}

function closeArchivePopup() {
    document.getElementById('archivePopup').style.display = 'none';
}

function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('mainDisplayImage');
    mainImage.src = thumbnail.src;
}

document.getElementById('textInput').addEventListener('click', function() {
  document.querySelector('.popup').classList.add('small');
  document.querySelector('.popupText').classList.add('small');
});


const imagesPath = "./images/";
const specialChars = {
    '♥': 'heart',
    '★': 'star',
    '!': 'exclamation',
    '?': 'question',
    '~': 'tilde',
    '.': 'dot',
    ',': 'comma',
    '^': 'caret',
    ')': 'rparen',
    '(': 'lparen'
};

const filters = [
    "invert(49%) sepia(98%) saturate(356%) hue-rotate(95deg) brightness(104%) contrast(104%)",      // green
    "invert(83%) sepia(35%) saturate(1543%) hue-rotate(229deg) brightness(101%) contrast(102%)",       // violet
    "invert(36%) sepia(0%) saturate(0%) hue-rotate(14deg) brightness(95%) contrast(91%)",       // pink   
    "invert(72%) sepia(9%) saturate(370%) hue-rotate(18deg) brightness(89%) contrast(88%)",        // gray
    "invert(52%) sepia(78%) saturate(4762%) hue-rotate(340deg) brightness(99%) contrast(108%)"         // red
];

let filterAssigned = false;  
let currentFilter;

function getRandomFilter() {
    return filters[Math.floor(Math.random() * filters.length)];
}

function assignRandomFilterToImage(imageElement) {
    if (!filterAssigned) {
        currentFilter = getRandomFilter();  
        filterAssigned = true;  
    }
    imageElement.style.filter = currentFilter; 
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
        return jongImageMap[jong] || jong; 
    }


    const BASE_CODE = 44032;
    const HANGUL_COUNT = 11172;


    let code = letter.charCodeAt(0) - BASE_CODE;
    if (code < 0 || code >= HANGUL_COUNT) return [letter, null, null];

    let cho = CHO[Math.floor(code / 588)];
    let jung = JUNG[Math.floor((code % 588) / 28)];
    let jong = JONG[code % 28];

    if (jong) {
        jong = getJongImage(jong); 
    }

    return [cho, jung, jong, null];
}

function updateTypography() {
    const text = document.getElementById("textInput").value;
    const output = document.getElementById("outputArea");
    output.innerHTML = "";

    let totalLetters = text.length;
    let maxSize = 300; 
    let mobileFactor = window.innerWidth <= 600 ? 0.3 : 1; 
    let baseSize = Math.min(maxSize, Math.floor((800 / totalLetters) * mobileFactor)); 

    let minSize = window.innerWidth <= 600 ? 50 : 100; 
    let letterSize = Math.max(minSize, baseSize);

    for (let char of text) {

        let letterDiv = document.createElement("div");
        letterDiv.className = "letter";

        if (char === ' ') {
            letterDiv.style.width = `${letterSize /2.5}px`;
            letterDiv.style.height = `${letterSize}px`;
            output.appendChild(letterDiv);
            continue; 
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

            let img = document.createElement("img");
            img.src = `${imagesPath}${specialChars[char]}.png`; 
            img.style.width = `${letterSize}px`;
            img.style.height = `${letterSize}px`;

            if (!img.dataset.filter) {
                img.dataset.filter = getRandomFilter(); 
            }
            img.style.filter = img.dataset.filter; 

            div.appendChild(img);
            output.appendChild(div);
            continue; 
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

        let imgSize = letterSize * 1; 

        // 초성
        if (cho) {
        let img = document.createElement("img");
        img.src = `${imagesPath}${cho}.png`;

        if (!img.dataset.filter) {
                img.dataset.filter = getRandomFilter(); 
            }
            img.style.filter = img.dataset.filter; 


        img.onerror = function() {
            img.style.display = "none"; 
            let textDiv = document.createElement("div");
            textDiv.innerText = cho; 
            textDiv.style.fontSize = `${letterSize * 1.2}px`; 
            textDiv.style.fontFamily = "Happiness Sans, sans-serif";
            textDiv.style.textAlign = "center"; 
            textDiv.style.filter = getRandomFilter();
            textDiv.style.position = "absolute";
            textDiv.style.top = "-20%";

            container.appendChild(textDiv);
        };

        let isHorizontalJung = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅣ", "ㅔ", "ㅖ", "ㅐ", "ㅒ"].includes(jung);
        let isVerticalJung = ["ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ"].includes(jung);
        let isComplexJung = ["ㅘ", "ㅢ", "ㅝ", "ㅞ", "ㅟ", "ㅚ", "ㅙ"].includes(jung);

        let hasJong = jong ? true : false; 

        let choWidth = imgSize * 1;  
        let choHeight = imgSize * 1; 

        if (isVerticalJung) {
            choHeight = imgSize * 0.6;
            choWidth = imgSize * 0.8; 
            img.style.left = "50%";
            img.style.top = "0";
            img.style.transform = "translateX(-50%)";
        } 

        if (isHorizontalJung) {
            choHeight = imgSize * 0.7; 
            choWidth = imgSize * 0.7; 
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
        img.style.top = "0%"; 
        } else if (isHorizontalJung) {
            img.style.top = "0%"; 

        } else if (isComplexJung) {
            img.style.top = "0%";
            img.style.left = "0%"; 
            img.style.width = "80%";
            img.style.height = "60%";
        }


        container.appendChild(img);
    }

        // 중성 
        if (jung) {
            let img = document.createElement("img");
            img.src = `${imagesPath}${jung}.png`;

            if (!img.dataset.filter) {
                img.dataset.filter = getRandomFilter(); 
            }
            img.style.filter = img.dataset.filter; 

            img.style.position = "absolute";

            img.onerror = function() {
                img.style.display = "none"; 
                let textDiv = document.createElement("div");
                textDiv.innerText = cho; 
                textDiv.style.fontSize = `${letterSize * 1.2}px`; 
                textDiv.style.fontFamily = "Happiness Sans, sans-serif";
                textDiv.style.textAlign = "center"; 
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

        // 종성
        if (jong) {
            let img = document.createElement("img");
            img.src = `${imagesPath}${jong}.png`;

            if (!img.dataset.filter) {
                img.dataset.filter = getRandomFilter(); 
            }
            img.style.filter = img.dataset.filter; 


            img.onerror = function() {
                img.style.display = "none"; 
                let textDiv = document.createElement("div");
                textDiv.innerText = cho; 
                textDiv.style.fontSize = `${letterSize * 1.2}px`; 
                textDiv.style.fontFamily = "Happiness Sans, sans-serif";
                textDiv.style.textAlign = "center"; 
                textDiv.style.filter = getRandomFilter();
                textDiv.style.position = "absolute";
                textDiv.style.top = "-20%";

                container.appendChild(textDiv);
            };
            
            let isHorizontalJung = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅣ", "ㅔ", "ㅖ", "ㅐ", "ㅒ"].includes(jung);
            let isVerticalJung = ["ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ"].includes(jung);
            let isComplexJung = ["ㅘ", "ㅢ", "ㅝ", "ㅞ", "ㅟ", "ㅚ", "ㅙ"].includes(jung);

            let jongSize = imgSize * 0.8; 
            let jongBottom = "0%"; 
            let jongLeft = "55%";
            
            if (isHorizontalJung) {
                jongSize = imgSize * 0.7; 
                jongBottom = "-30%"; 
                jongLeft = "55%"; 
            } else if (isVerticalJung) {
                jongSize = imgSize * 0.7; 
                jongBottom = "-55%"; 
                jongLeft = "55%"; 

            } else if (isComplexJung) {
                jongSize = imgSize * 0.7; 
                jongBottom = "-50%"; 
                jongLeft = "55%"; 
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
