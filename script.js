// 定義兩組主題資料 (每組8張卡片)

const themes = {
    theme1: [
        { front: 'a.png', back: 'a1.png' },
        { front: 'a.png', back: 'a2.png' },
        { front: 'a.png', back: 'a3.png' },
        { front: 'a.png', back: 'a4.png' },
        { front: 'a.png', back: 'a5.png' },
        { front: 'a.png', back: 'a6.png' },
        { front: 'a.png', back: 'a7.png' },
        { front: 'a.png', back: 'a8.png' },
        { front: 'a.png', back: 'a9.png' },
        { front: 'a.png', back: 'a10.png' },
        { front: 'a.png', back: 'a11.png' },
        { front: 'a.png', back: 'a12.png' },
        { front: 'a.png', back: 'a13.png' },
        { front: 'a.png', back: 'a14.png' },
        { front: 'a.png', back: 'a15.png' },
        { front: 'a.png', back: 'a16.png' },
        { front: 'a.png', back: 'a17.png' },
        { front: 'a.png', back: 'a18.png' }
    ],
    theme2: [
        { front: 'b.png', back: 'b1.png' },
        { front: 'b.png', back: 'b2.png' },
        { front: 'b.png', back: 'b3.png' },
        { front: 'b.png', back: 'b4.png' },
        { front: 'b.png', back: 'b5.png' },
        { front: 'b.png', back: 'b6.png' },
        { front: 'b.png', back: 'b7.png' },
        { front: 'b.png', back: 'b8.png' },
        { front: 'b.png', back: 'b9.png' },
        { front: 'b.png', back: 'b10.png' },
        { front: 'b.png', back: 'b11.png' },
        { front: 'b.png', back: 'b12.png' },
        { front: 'b.png', back: 'b13.png' },
        { front: 'b.png', back: 'b14.png' },
        { front: 'b.png', back: 'b15.png' },
        { front: 'b.png', back: 'b16.png' },
        { front: 'b.png', back: 'b17.png' },
        { front: 'b.png', back: 'b18.png' }
    ]
};

// 當前主題，默認為 theme1
let currentTheme = 'theme1';
let currentLayout = '2x2'; // 當前布局
let flippedCards = []; // 存放當前翻轉的兩張卡片
let matchedPairs = 0; // 計算匹配的對數
let gameStarted = false; // 遊戲是否已開始
let startTime; // 遊戲開始時間
let timerInterval; // 計時器

// 倒數計時顯示元素
const countdownElement = document.getElementById('countdown');

// 根據選擇的佈局生成卡片數量
function getCardCount() {
    switch (currentLayout) {
        case '2x2':
            return 4; // 2x2 生成 4 張卡片 (2 組)
        case '2x4':
            return 8; // 2x4 生成 8 張卡片 (4 組)
        case '4x4':
            return 16; // 4x4 生成 16 張卡片 (8 組)
        case '6x6':
            return 36; // 6x6 生成 36 張卡片 (18 組)
        default:
            return 4; // 默認為 2x2
    }
}


// 根據主題生成對應的配對卡片
function getRepeatedCards(theme) {
    const count = getCardCount() / 2; // 每對顯示兩次
    const themeCards = themes[theme];

    // 確保不會超過主題卡片數量
    const selectedCards = themeCards.slice(0, count); // 獲取對應數量的卡片
    return [...selectedCards, ...selectedCards]; // 返回配對的卡片
}




// 隨機打亂陣列的順序 (Fisher-Yates 洗牌演算法)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 動態生成卡片的函數
function createCard(frontImage, backImage) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.matched = 'false'; // 標記卡片是否匹配成功

    const front = document.createElement('div');
    front.classList.add('card-front');
    const frontImg = document.createElement('img');
    frontImg.src = frontImage;
    frontImg.alt = `Front of card`;
    front.appendChild(frontImg);

    const back = document.createElement('div');
    back.classList.add('card-back');
    const backImg = document.createElement('img');
    backImg.src = backImage;
    backImg.alt = `Back of card`;
    back.appendChild(backImg);

    card.appendChild(front);
    card.appendChild(back);

    // 添加翻轉事件
    card.addEventListener('click', function () {
        if (!gameStarted || flippedCards.length >= 2 || card.classList.contains('flipped') || card.dataset.matched === 'true') return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    });

    return card;
}

// 檢查是否匹配
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    const successSound = document.getElementById('success-sound');
    const failureSound = document.getElementById('failure-sound');

    if (firstCard.querySelector('.card-back img').src === secondCard.querySelector('.card-back img').src) {
        // 匹配成功
        firstCard.dataset.matched = 'true';
        secondCard.dataset.matched = 'true';
        flippedCards = [];
        matchedPairs++;

        successSound.currentTime = 0; // 重置音效播放時間
        successSound.play(); // 播放成功音效

        // 隱藏匹配的卡片，但保留空間
        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';

        // 檢查是否所有對已經配對完成
        if (matchedPairs === getCardCount() / 2) {
            endGame(); // 完成所有匹配後結束遊戲
        }
    } else {
        // 匹配失敗
        failureSound.currentTime = 0; // 重置音效播放時間
        failureSound.play(); // 播放失敗音效

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// 開始遊戲按鈕邏輯，添加 3 秒倒數計時
function startGame() {
    gameStarted = false;
    flippedCards = [];
    matchedPairs = 0;
    clearInterval(timerInterval); // 清除計時器
    renderCards(); // 重新生成卡片
    const allCards = document.querySelectorAll('.card');

    // 先顯示卡片背面
    allCards.forEach(card => {
        card.classList.add('flipped'); // 顯示背面
    });

    // 讀取選擇的倒數時間
    const countdownSelect = document.getElementById('countdown-select');
    let countdown = parseInt(countdownSelect.value);
    countdownElement.textContent = `倒數: ${countdown}s`;

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = `倒數: ${countdown}s`;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = ''; // 清空倒數顯示

            // 倒數結束後翻轉所有卡片到正面
            allCards.forEach(card => {
                card.classList.remove('flipped'); // 顯示正面
            });

            startTime = new Date();
            startTimer(); // 開始計時
            gameStarted = true;
        }
    }, 1000); // 每秒更新一次倒數
}


// 開始計時器
function startTimer() {
    const timerElement = document.getElementById('timer');
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((new Date() - startTime) / 1000);
        timerElement.textContent = `計時: ${elapsedTime} 秒`;
    }, 1000);
}

// 結束遊戲，顯示時間
function endGame() {
    clearInterval(timerInterval); // 停止計時
    const elapsedTime = Math.floor((new Date() - startTime) / 1000); // 計算遊戲耗時
    
    // 更新計時器的內容
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `所用時間: ${elapsedTime} 秒。恭喜你完成遊戲！`; // 顯示時間和完成的文字
    
    // 遊戲結束後禁用卡片點擊
    document.querySelectorAll('.card').forEach(card => {
        card.removeEventListener('click', handleCardClick); // 移除點擊事件
    });
    gameStarted = false; // 禁止繼續翻牌
}

// 渲染卡片的函數，根據當前主題和佈局生成卡片
function renderCards() {
    const container = document.querySelector('.cards-container');
    container.innerHTML = ''; // 清空現有的卡片
    container.setAttribute('data-layout', currentLayout); // 設置佈局屬性

    const repeatedCards = getRepeatedCards(currentTheme); // 獲取重複的卡片
    const shuffledCards = shuffle(repeatedCards); // 隨機打亂卡片順序

    shuffledCards.forEach(card => {
        const newCard = createCard(card.front, card.back);
        container.appendChild(newCard);
    });
}





// 顯示所有卡片正面
function showAllFront() {
    document.querySelectorAll('.card').forEach((card) => {
        card.classList.remove('flipped'); // 顯示正面
    });
}

// 顯示所有卡片背面
function showAllBack() {
    document.querySelectorAll('.card').forEach((card) => {
        card.classList.add('flipped'); // 一次性顯示背面
    });
}


// 監聽按鈕事件
document.getElementById('show-front').addEventListener('click', showAllFront);
document.getElementById('show-back').addEventListener('click', showAllBack);
document.getElementById('start-game').addEventListener('click', startGame);

// 切換主題邏輯
document.getElementById('theme-select').addEventListener('change', (event) => {
    currentTheme = event.target.value; // 根據選擇更新主題
    console.log(`當前主題: ${currentTheme}`); // 在控制台中輸出當前主題
    renderCards(); // 重新渲染卡片
});


// 監聽布局選擇事件
document.getElementById('layout-select').addEventListener('change', (event) => {
    currentLayout = event.target.value; // 根據選擇更新布局
    renderCards(); // 重新渲染卡片
});
 