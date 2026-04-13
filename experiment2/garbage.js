/**
 * 垃圾分类问答小程序 - 交互式版本
 */

// 垃圾分类数据
let garbageData = [];
let shuffledData = [];

// 从外部 JSON 文件加载数据
async function loadGarbageData() {
    try {
        const response = await fetch('../garbage.json');
        garbageData = await response.json();
        console.log('垃圾分类数据加载成功，共', garbageData.length, '条数据');
    } catch (error) {
        console.error('加载垃圾分类数据失败:', error);
        // 加载失败时使用默认数据
        garbageData = [
            { "garbageName": "废弃水银温度计", "garbageType": "有害垃圾", "garbageInfo": "含有水银等有害物质，需要专业处理，安全填埋或焚烧" },
            { "garbageName": "旧报纸", "garbageType": "可回收垃圾", "garbageInfo": "可回收再利用，制成再生纸等产品" },
            { "garbageName": "剩菜剩饭", "garbageType": "厨余垃圾", "garbageInfo": "可进行堆肥处理，转化为有机肥料" },
            { "garbageName": "一次性餐具", "garbageType": "其他垃圾", "garbageInfo": "难以回收，通常进行焚烧或填埋处理" },
            { "garbageName": "废电池", "garbageType": "有害垃圾", "garbageInfo": "含有重金属等有害物质，需专门回收处理" },
            { "garbageName": "塑料瓶", "garbageType": "可回收垃圾", "garbageInfo": "可回收再利用，制成新的塑料制品" },
            { "garbageName": "果皮果核", "garbageType": "厨余垃圾", "garbageInfo": "可进行堆肥处理，产生有机肥料" },
            { "garbageName": "烟头", "garbageType": "其他垃圾", "garbageInfo": "已污染且难以回收，通常填埋处理" },
            { "garbageName": "过期药品", "garbageType": "有害垃圾", "garbageInfo": "含有化学成分，需专业机构处理" },
            { "garbageName": "易拉罐", "garbageType": "可回收垃圾", "garbageInfo": "金属材质可回收再利用" },
            { "garbageName": "茶叶渣", "garbageType": "厨余垃圾", "garbageInfo": "可堆肥或作为植物肥料" },
            { "garbageName": "餐巾纸", "garbageType": "其他垃圾", "garbageInfo": "已污染，难以回收利用" }
        ];
    }
    
    document.getElementById('total-questions').textContent = garbageData.length;
}

// 全局变量
let currentIndex = 0;
let score = 0;
let correctCount = 0;
let isPlaying = false;
let currentGarbage = null;

// DOM 元素
const garbageItem = document.getElementById('garbage-item');
const questionNumber = document.getElementById('question-number');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');
const feedbackArea = document.getElementById('feedback-area');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackMessage = document.getElementById('feedback-message');
const correctAnswer = document.getElementById('correct-answer');
const garbageInfo = document.getElementById('garbage-info');
const categoryButtons = document.querySelectorAll('.category-btn');
const resultModal = document.getElementById('result-modal');
const closeModalBtn = document.getElementById('close-modal');

// 统计元素
const scoreSpan = document.getElementById('score');
const currentQuestionSpan = document.getElementById('current-question');
const accuracySpan = document.getElementById('accuracy');
const finalTotalSpan = document.getElementById('final-total');
const finalCorrectSpan = document.getElementById('final-correct');
const finalAccuracySpan = document.getElementById('final-accuracy');

/**
 * 初始化游戏
 */
function initGame() {
    shuffledData = [...garbageData].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    score = 0;
    correctCount = 0;
    isPlaying = false;
    
    updateStats();
    resetUI();
}

/**
 * 重置UI状态
 */
function resetUI() {
    garbageItem.textContent = '点击开始答题开始';
    questionNumber.textContent = '题目';
    feedbackArea.classList.remove('show', 'correct', 'wrong');
    nextBtn.disabled = true;
    
    categoryButtons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('selected', 'correct', 'wrong');
    });
}

/**
 * 更新统计信息
 */
function updateStats() {
    scoreSpan.textContent = score;
    currentQuestionSpan.textContent = isPlaying ? currentIndex : 0;
    
    const accuracy = garbageData.length > 0 ? Math.round((correctCount / garbageData.length) * 100) : 0;
    accuracySpan.textContent = accuracy;
}

/**
 * 显示当前题目
 */
function showCurrentQuestion() {
    if (currentIndex < shuffledData.length) {
        currentGarbage = shuffledData[currentIndex];
        garbageItem.textContent = currentGarbage.garbageName;
        questionNumber.textContent = `第 ${currentIndex + 1} 题`;
        
        feedbackArea.classList.remove('show', 'correct', 'wrong');
        nextBtn.disabled = true;
        
        categoryButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('selected', 'correct', 'wrong');
        });
    } else {
        showResult();
    }
}

/**
 * 处理用户选择
 */
function handleCategorySelect(selectedType) {
    if (!isPlaying || currentGarbage === null) return;
    
    // 禁用所有按钮
    categoryButtons.forEach(btn => {
        btn.disabled = true;
    });
    
    // 标记用户选择
    const selectedBtn = document.querySelector(`[data-type="${selectedType}"]`);
    selectedBtn.classList.add('selected');
    
    // 判断答案
    const isCorrect = selectedType === currentGarbage.garbageType;
    
    if (isCorrect) {
        // 答对了
        score += 10;
        correctCount++;
        selectedBtn.classList.add('correct');
        
        feedbackArea.className = 'feedback-area show correct';
        feedbackIcon.textContent = '✅';
        feedbackMessage.textContent = '回答正确！';
        correctAnswer.textContent = `正确答案：${currentGarbage.garbageType}`;
        garbageInfo.textContent = `解析：${currentGarbage.garbageInfo}`;
    } else {
        // 答错了
        selectedBtn.classList.add('wrong');
        
        // 显示正确答案
        const correctBtn = document.querySelector(`[data-type="${currentGarbage.garbageType}"]`);
        correctBtn.classList.add('correct');
        
        feedbackArea.className = 'feedback-area show wrong';
        feedbackIcon.textContent = '❌';
        feedbackMessage.textContent = '回答错误';
        correctAnswer.textContent = `正确答案：${currentGarbage.garbageType}`;
        garbageInfo.textContent = `解析：${currentGarbage.garbageInfo}`;
    }
    
    updateStats();
    nextBtn.disabled = false;
}

/**
 * 显示最终结果
 */
function showResult() {
    const accuracy = Math.round((correctCount / garbageData.length) * 100);
    
    finalTotalSpan.textContent = garbageData.length;
    finalCorrectSpan.textContent = correctCount;
    finalAccuracySpan.textContent = accuracy;
    
    resultModal.classList.add('show');
    isPlaying = false;
}

/**
 * 开始按钮点击事件
 */
startBtn.addEventListener('click', function() {
    if (!isPlaying) {
        initGame();
        isPlaying = true;
        showCurrentQuestion();
    }
});

/**
 * 下一题按钮点击事件
 */
nextBtn.addEventListener('click', function() {
    if (isPlaying) {
        currentIndex++;
        showCurrentQuestion();
    }
});

/**
 * 结束按钮点击事件
 */
resetBtn.addEventListener('click', function() {
    if (isPlaying) {
        showResult();
    } else {
        initGame();
    }
});

/**
 * 类别按钮点击事件
 */
categoryButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.dataset.type;
        handleCategorySelect(type);
    });
});

/**
 * 关闭结果弹窗
 */
closeModalBtn.addEventListener('click', function() {
    resultModal.classList.remove('show');
    initGame();
});

/**
 * 键盘支持
 */
document.addEventListener('keydown', function(e) {
    const keyMap = {
        '1': '可回收垃圾',
        '2': '有害垃圾',
        '3': '厨余垃圾',
        '4': '其他垃圾',
        'Enter': 'next'
    };
    
    const action = keyMap[e.key];
    
    if (action && isPlaying) {
        if (action === 'next') {
            if (!nextBtn.disabled) {
                nextBtn.click();
            }
        } else {
            const btn = document.querySelector(`[data-type="${action}"]`);
            if (btn && !btn.disabled) {
                btn.click();
            }
        }
    }
});

// 初始化
window.onload = async function() {
    garbageItem.textContent = '加载数据中...';
    
    await loadGarbageData();
    
    initGame();
};