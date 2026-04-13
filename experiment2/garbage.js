/**
 * 垃圾分类问答小程序
 */

// 垃圾分类数据
let garbageData = [];

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
            { "garbageName": "废弃水银温度计", "garbageType": "有害垃圾", "garbageInfo": "安全填埋、焚烧" },
            { "garbageName": "旧报纸", "garbageType": "可回收垃圾", "garbageInfo": "回收再利用" },
            { "garbageName": "剩菜剩饭", "garbageType": "厨余垃圾", "garbageInfo": "堆肥、焚烧" },
            { "garbageName": "一次性餐具", "garbageType": "其他垃圾", "garbageInfo": "焚烧、填埋" }
        ];
    }
}

// 全局变量
let currentIndex = 0;
let intervalId = null;
let currentGarbage = null;

// DOM 元素
const garbageItem = document.getElementById('garbage-item');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resultBtn = document.getElementById('result-btn');
const resultDiv = document.getElementById('result');

/**
 * 显示当前垃圾项目
 */
function showCurrentGarbage() {
    if (currentIndex < garbageData.length) {
        currentGarbage = garbageData[currentIndex];
        garbageItem.textContent = currentGarbage.garbageName;
        currentIndex++;
    } else {
        // 重置索引，循环显示
        currentIndex = 0;
        showCurrentGarbage();
    }
}

/**
 * 开始按钮点击事件
 */
startBtn.addEventListener('click', function() {
    // 清除之前的定时器
    if (intervalId) {
        clearInterval(intervalId);
    }
    
    // 开始轮播垃圾项目，每2秒切换一次
    intervalId = setInterval(showCurrentGarbage, 2000);
    
    // 显示第一个垃圾项目
    showCurrentGarbage();
    
    // 清空结果
    resultDiv.textContent = '';
});

/**
 * 停止按钮点击事件
 */
stopBtn.addEventListener('click', function() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
});

/**
 * 结果按钮点击事件
 */
resultBtn.addEventListener('click', function() {
    // 同时进行停止操作
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    
    // 显示当前垃圾的分类结果
    if (currentGarbage) {
        resultDiv.innerHTML = `<strong>${currentGarbage.garbageName}</strong><br>
                            分类：${currentGarbage.garbageType}<br>
                            处理方式：${currentGarbage.garbageInfo}`;
    } else {
        resultDiv.textContent = '请先点击开始按钮';
    }
});

// 初始化
window.onload = async function() {
    garbageItem.textContent = '加载数据中...';
    resultDiv.textContent = '点击结果按钮查看分类';
    
    // 加载垃圾分类数据
    await loadGarbageData();
    
    garbageItem.textContent = '点击开始按钮开始';
};