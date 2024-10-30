const NAMES = [
    "你好", "秦娜", "蔡娟", "蔡晴晴", "马仁军", "沈莉杰", "石梦婷", "王根发", 
    "许诺", "陈键", "冯泉栋", "高婷", "郭正楠", "黄扬", "何耀", "何禹坤", 
    "蒋源", "李靖", "李静", "李星月", "彭雪友", "秦艺凤", "唐兴", "王涛", 
    "旺仔小拳头", "喻红", "张浩", "周桓吏", "周杰", "皱坤龙", "皱念铖", 
    "曾琪", "周昇霖", "周思远", "张星豪", "朱益锋", "退休老阿姨"
];

let usedNames = new Set();
let drawHistory = [];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('totalNames').textContent = NAMES.length;
    // 从localStorage加载历史记录
    loadFromLocalStorage();
    updateHistory();
});

function draw() {
    const resultDiv = document.getElementById('result');
    const modeSelect = document.getElementById('mode');
    const allowRepeat = modeSelect.value === '2';
    
    // 添加抽取动画
    resultDiv.classList.add('drawing');
    resultDiv.innerHTML = '抽取中...';
    
    // 模拟抽取过程
    let count = 0;
    const duration = 1000; // 动画持续时间（毫秒）
    const interval = 50; // 更新间隔（毫秒）
    
    const animation = setInterval(() => {
        const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
        resultDiv.innerHTML = `<h2>${randomName}</h2>`;
        count += interval;
        
        if (count >= duration) {
            clearInterval(animation);
            finalizeDrawing(allowRepeat);
        }
    }, interval);
}

function finalizeDrawing(allowRepeat) {
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('drawing');
    
    if (!allowRepeat && usedNames.size === NAMES.length) {
        resultDiv.innerHTML = `
            <h2 style="color: var(--warning-color)">所有名字都已抽取完毕！</h2>
            <p>请点击"重置"重新开始</p>
        `;
        return;
    }
    
    let selectedName;
    if (allowRepeat) {
        selectedName = NAMES[Math.floor(Math.random() * NAMES.length)];
    } else {
        do {
            selectedName = NAMES[Math.floor(Math.random() * NAMES.length)];
        } while (usedNames.has(selectedName));
        usedNames.add(selectedName);
    }
    
    const now = new Date().toLocaleString();
    drawHistory.push({ name: selectedName, time: now });
    
    resultDiv.innerHTML = `
        <h2 style="color: var(--success-color)">${selectedName}</h2>
        <p>抽取时间：${now}</p>
    `;
    
    document.getElementById('drawCount').textContent = drawHistory.length;
    updateHistory();
    saveToLocalStorage();
}

function resetDraw() {
    if (!confirm('确定要重置所有记录吗？')) return;
    
    usedNames.clear();
    drawHistory = [];
    document.getElementById('result').innerHTML = '等待抽取...';
    document.getElementById('drawCount').textContent = '0';
    updateHistory();
    saveToLocalStorage();
}

function updateHistory() {
    const historyDiv = document.getElementById('history');
    if (drawHistory.length === 0) {
        historyDiv.innerHTML = '<p style="text-align: center; color: #999;">暂无抽取记录</p>';
        return;
    }

    const historyHTML = drawHistory.map((record, index) => `
        <div class="history-item">
            <strong>#${drawHistory.length - index}</strong>
            ${record.name}
            <span style="float: right; color: #999;">${record.time}</span>
        </div>
    `).reverse().join('');
    
    historyDiv.innerHTML = historyHTML;
}

function saveToLocalStorage() {
    localStorage.setItem('drawHistory', JSON.stringify(drawHistory));
    localStorage.setItem('usedNames', JSON.stringify([...usedNames]));
}

function loadFromLocalStorage() {
    const savedHistory = localStorage.getItem('drawHistory');
    const savedUsedNames = localStorage.getItem('usedNames');
    
    if (savedHistory) {
        drawHistory = JSON.parse(savedHistory);
        document.getElementById('drawCount').textContent = drawHistory.length;
    }
    
    if (savedUsedNames) {
        usedNames = new Set(JSON.parse(savedUsedNames));
    }
} 