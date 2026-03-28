// ======================= 配置区 =======================
// 【重要】请在此处设置您的抽象视频路径（本地文件或网络URL）
// 步骤说明：
// 1. 将你的抽象视频文件（例如 "abstract_surprise.mp4"）放在与HTML文件相同的文件夹内。
// 2. 将下面的变量改为你的文件名，例如 './abstract_surprise.mp4' 或 'https://example.com/video.mp4'
const ABSTRACT_VIDEO_SRC = "./gun.mp4";   // ← 请修改为你的抽象视频路径！！！
// 如果视频加载失败，视频区域会显示浏览器原生错误（极简风格），不影响恶作剧效果。
// =====================================================

// ---------- 题目数据 (15道题，分三大类，每类5题) ----------
const questionsData = {
    category1: [
        { text: "在团队讨论中，你通常扮演什么角色？", options: ["主导者，掌控议程", "协调者，促进共识", "创新者，提出狂想", "观察者，最后总结"] },
        { text: "面对一项全新挑战，你的第一反应是？", options: ["立刻制定计划", "评估风险再行动", "直觉感到兴奋", "寻找过往案例参考"] },
        { text: "哪种环境让你效率最高？", options: ["安静独立的空间", "背景有白噪音", "开放式协作氛围", "自然户外"] },
        { text: "你更倾向于哪种沟通方式？", options: ["直接简洁", "委婉含蓄", "幽默比喻", "逻辑论证"] },
        { text: "当计划被打乱时，你通常？", options: ["迅速调整新计划", "感到烦躁但适应", "随遇而安", "反思原计划漏洞"] }
    ],
    category2: [
        { text: "你对“抽象艺术”的态度是？", options: ["完全无法理解", "有兴趣但不懂", "觉得很震撼", "我本身就是抽象派"] },
        { text: "做重要决策时，更依赖？", options: ["数据分析", "直觉灵感", "他人建议", "过往经验"] },
        { text: "你如何描述自己的思维节奏？", options: ["快如闪电", "沉稳缓慢", "跳跃发散", "循序线性"] },
        { text: "遇到观点冲突，你优先？", options: ["捍卫自己观点", "寻求妥协", "探索新视角", "暂时搁置"] },
        { text: "周末理想状态是？", options: ["社交聚会", "独处充电", "尝试新事物", "规划未来"] }
    ],
    category3: [
        { text: "你相信“命中注定”吗？", options: ["完全不信", "有点相信", "命运可以改变", "一切皆是概率"] },
        { text: "哪种符号更吸引你？", options: ["⚖️ 天平", "🌀 漩涡", "🌌 星空", "🔺 金字塔"] },
        { text: "面对未知事物，好奇心程度？", options: ["很低，求稳", "一般，看情况", "很高，想探索", "狂热，忍不住研究"] },
        { text: "你更擅长？", options: ["语言表达", "数字逻辑", "空间想象", "人际共情"] },
        { text: "如果有一整天自由时间，你会？", options: ["学习新技能", "发呆冥想", "整理旧物", "创作或动手"] }
    ]
};//有对象、数组的嵌套

// 存储用户答案
let userAnswers = {};
let currentPage = "start";//当前页面
let categoryCompleted = { 1: false, 2: false, 3: false };//检测全都回答完了吗？

// 获取DOM 元素
const startPageDiv = document.getElementById('startPage');
const cat1Div = document.getElementById('category1Page');
const cat2Div = document.getElementById('category2Page');
const cat3Div = document.getElementById('category3Page');
const resultPageDiv = document.getElementById('resultPage');

const startBtn = document.getElementById('startBtn');
const revealVideoBtn = document.getElementById('revealVideoBtn');

const videoFullscreen = document.getElementById('videoFullscreen');//全屏容器层
const abstractVideo = document.getElementById('abstractVideo');//视频元素本身

const finalReportSummary = document.getElementById('finalReportSummary');//最终报告（其实不需要）

// 辅助：切换页面
function showPage(pageId) {
    startPageDiv.classList.remove('active-page');
    cat1Div.classList.remove('active-page');
    cat2Div.classList.remove('active-page');
    cat3Div.classList.remove('active-page');
    resultPageDiv.classList.remove('active-page');

    if (pageId === 'start') startPageDiv.classList.add('active-page');
    if (pageId === 'cat1') cat1Div.classList.add('active-page');
    if (pageId === 'cat2') cat2Div.classList.add('active-page');
    if (pageId === 'cat3') cat3Div.classList.add('active-page');
    if (pageId === 'result') resultPageDiv.classList.add('active-page');
    currentPage = pageId;
}



// 渲染某一类别的题目
function renderCategory(categoryId, containerDiv) {
    let categoryKey = `category${categoryId}`;
    let questions = questionsData[categoryKey];
    if (!questions) return;

    let html = `<div class="questions-area">`;
    questions.forEach((q, idx) => {
        const globalIdx = `${categoryId}_${idx}`;
        const savedValue = userAnswers[globalIdx] || "";
        html += `
            <div class="question-card">
                <div class="question-text">
                    <span class="q-num">${idx+1}</span> ${q.text}
                </div>
                <div class="options" data-qidx="${globalIdx}">
        `;

        q.options.forEach((opt, optIdx) => {
            const optVal = String.fromCharCode(65+optIdx);
            const checkedAttr = (savedValue === optVal) ? 'checked' : '';
            html += `
                <div class="option">
                    <input type="radio" name="q_${globalIdx}" value="${optVal}" id="${globalIdx}_${optVal}" ${checkedAttr}>
                    <label for="${globalIdx}_${optVal}">${opt}</label>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    //导航按钮区域
    html += `</div><div class="nav-buttons">`;
    if (categoryId > 1) {
        html += `<button class="btn btn-outline prev-category-btn">← 上一类</button>`;
    }
    html += `<button class="btn btn-primary next-category-btn">${categoryId === 3 ? '完成并生成报告 →' : '下一类 →'}</button>`;
    html += `</div>`;
    containerDiv.innerHTML = html;

    // 绑定选项点击事件
    containerDiv.querySelectorAll('.option').forEach(optDiv => {
        optDiv.addEventListener('click', (e) => {
            const radio = optDiv.querySelector('input[type="radio"]');
            if (radio && !radio.checked) {
                radio.checked = true;
                const changeEv = new Event('change', { bubbles: true });
                radio.dispatchEvent(changeEv);
            }
        });
    });


    // 保存答案
    const radios = containerDiv.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const name = radio.name;
            const match = name.match(/q_(\d+)_(\d+)/);
            if (match) {
                const cat = match[1];
                const idx = match[2];
                const globalKey = `${cat}_${idx}`;
                userAnswers[globalKey] = radio.value;
            }
        });
    });

    // 下一类按钮
    const nextBtn = containerDiv.querySelector('.next-category-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentCatQuestions = questionsData[`category${categoryId}`];
            let allAnswered = true;
            for (let i = 0; i < currentCatQuestions.length; i++) {
                const globalKey = `${categoryId}_${i}`;
                if (!userAnswers[globalKey]) {
                    allAnswered = false;
                    break;
                }
            }
            if (!allAnswered) {
                showTemporaryWarning(containerDiv, `请先完成当前类别所有 ${currentCatQuestions.length} 道题目`);
                return;
            }
            categoryCompleted[categoryId] = true;
            if (categoryId === 1) {
                renderCategory(2, cat2Div);
                showPage('cat2');
            } else if (categoryId === 2) {
                renderCategory(3, cat3Div);
                showPage('cat3');
            } else if (categoryId === 3) {
                /*generateFinalReportSummary();*/
                showPage('result');
            }
        });
    }

    // 上一类按钮
    const prevBtn = containerDiv.querySelector('.prev-category-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (categoryId === 2) {
                renderCategory(1, cat1Div);
                showPage('cat1');
            } else if (categoryId === 3) {
                renderCategory(2, cat2Div);
                showPage('cat2');
            }
        });
    }
}
/*function renderCategory(categoryId, containerDiv) {
    let categoryKey = `category${categoryId}`;
    let questions = questionsData[categoryKey];
    if (!questions) return;

    let html = `<div class="questions-area">`;
    questions.forEach((q, idx) => {
        const globalIdx = `${categoryId}_${idx}`;
        const savedValue = userAnswers[globalIdx] || "";
        html += `
            <div class="question-card">
                <div class="question-text">
                    <span class="q-num">${idx+1}</span> ${q.text}
                </div>
                <div class="options" data-qidx="${globalIdx}">
        `;

        q.options.forEach((opt, optIdx) => {
            const optVal = String.fromCharCode(65+optIdx);
            const checkedAttr = (savedValue === optVal) ? 'checked' : '';
            html += `
                <div class="option">
                    <input type="radio" name="q_${globalIdx}" value="${optVal}" id="${globalIdx}_${optVal}" ${checkedAttr}>
                    <label for="${globalIdx}_${optVal}">${opt}</label>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    //导航按钮区域
    html += `</div><div class="nav-buttons">`;
    if (categoryId > 1) {
        html += `<button class="btn btn-outline" id="prevCategoryBtn">← 上一类</button>`;
    }
    html += `<button class="btn btn-primary" id="nextCategoryBtn">${categoryId === 3 ? '完成并生成报告 →' : '下一类 →'}</button>`;
    html += `</div>`;
    containerDiv.innerHTML = html;

    // 绑定选项点击事件
    containerDiv.querySelectorAll('.option').forEach(optDiv => {
        optDiv.addEventListener('click', (e) => {
            const radio = optDiv.querySelector('input[type="radio"]');
            if (radio && !radio.checked) {
                radio.checked = true;
                const changeEv = new Event('change', { bubbles: true });
                radio.dispatchEvent(changeEv);
            }
        });
    });


    // 保存答案
    const radios = containerDiv.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const name = radio.name;
            const match = name.match(/q_(\d+)_(\d+)/);
            if (match) {
                const cat = match[1];
                const idx = match[2];
                const globalKey = `${cat}_${idx}`;
                userAnswers[globalKey] = radio.value;
            }
        });
    });

    // 下一类按钮
    const nextBtn = document.getElementById('nextCategoryBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentCatQuestions = questionsData[`category${categoryId}`];
            let allAnswered = true;
            for (let i = 0; i < currentCatQuestions.length; i++) {
                const globalKey = `${categoryId}_${i}`;
                if (!userAnswers[globalKey]) {
                    allAnswered = false;
                    break;
                }
            }
            if (!allAnswered) {
                showTemporaryWarning(containerDiv, `请先完成当前类别所有 ${currentCatQuestions.length} 道题目`);
                return;
            }
            categoryCompleted[categoryId] = true;
            if (categoryId === 1) {
                renderCategory(2, cat2Div);
                showPage('cat2');
            } else if (categoryId === 2) {
                renderCategory(3, cat3Div);
                showPage('cat3');
            } else if (categoryId === 3) {
                generateFinalReportSummary();
                showPage('result');
            }
        });
    }

    // 上一类按钮
    const prevBtn = document.getElementById('prevCategoryBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (categoryId === 2) {
                renderCategory(1, cat1Div);
                showPage('cat1');
            } else if (categoryId === 3) {
                renderCategory(2, cat2Div);
                showPage('cat2');
            }
        });
    }
}*/

//未完成警告
function showTemporaryWarning(container, msg) {
    let warnDiv = container.querySelector('.dynamic-warning');
    if (!warnDiv) {
        warnDiv = document.createElement('div');
        warnDiv.className = 'warning-badge dynamic-warning';
        container.appendChild(warnDiv);
    }
    warnDiv.innerText = `⚠️ ${msg} ⚠️`;
    setTimeout(() => {
        if (warnDiv) warnDiv.remove();
    }, 2500);
}

// 生成结果摘要
function generateFinalReportSummary() {
    const answersList = Object.values(userAnswers);
    const countA = answersList.filter(v => v === 'A').length;
    const countB = answersList.filter(v => v === 'B').length;
    const countC = answersList.filter(v => v === 'C').length;
    const countD = answersList.filter(v => v === 'D').length;
    let dominant = 'A';
    let maxCount = countA;
    
    if (countB > maxCount) { dominant = 'B'; maxCount = countB; }
    if (countC > maxCount) { dominant = 'C'; maxCount = countC; }
    if (countD > maxCount) { dominant = 'D'; maxCount = countD; }
    
    let typeTitle = "", description = "";
    if (dominant === 'A') { typeTitle = "⛰️ 架构型指挥官"; description = "目标导向，逻辑严谨，在结构化环境中表现卓越。擅长制定战略并推动执行。"; }
    else if (dominant === 'B') { typeTitle = "🌊 和谐联结者"; description = "共情力极强，擅长维护人际磁场，是团队中的凝聚力核心。"; }
    else if (dominant === 'C') { typeTitle = "🌀 抽象先锋派"; description = "直觉敏锐，创意丰沛，对非线性信息有天然的感知力，适合开拓性领域。"; }
    else { typeTitle = "📚 智识探索者"; description = "深度思考，追求真理，善于系统性拆解复杂问题，是可靠的智库角色。"; }
    
    finalReportSummary.innerHTML = `
        <strong>✨ 主导人格倾向：${typeTitle}</strong><br>
        📊 样本匹配度：92.7% · 常模超越指数：高<br>
        💡 核心特质：${description}<br>
        🔮 建议发展领域：创造性思维 / 抽象整合 / 非线性决策
    `;
}



// 极简视频展示：全屏黑色背景 + 视频（无任何文字/按钮）
function showVideoOnly() {
    // 设置视频源
    if (ABSTRACT_VIDEO_SRC && ABSTRACT_VIDEO_SRC !== "./abstract_surprise.mp4") {
        abstractVideo.src = ABSTRACT_VIDEO_SRC;
    } else {
        // 如果未配置，显示占位提示（但仍保持极简，仅在控制台提醒）
        console.warn("未配置抽象视频，请修改 ABSTRACT_VIDEO_SRC 变量");
        abstractVideo.src = "";
    }

    videoFullscreen.classList.add('active');
    const playPromise = abstractVideo.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // 静默失败，用户可手动点击播放按钮（原生控件可见）
            console.log("自动播放被阻止，用户可点击播放");
        });
    }
}

function hideVideo() {
    videoFullscreen.classList.remove('active');
    if (!abstractVideo.paused) abstractVideo.pause();
    abstractVideo.currentTime = 0;
}





// 开始测试
function startTest() {
    userAnswers = {};
    categoryCompleted = { 1: false, 2: false, 3: false };
    renderCategory(1, cat1Div);
    showPage('cat1');
}

// 事件绑定
startBtn.addEventListener('click', startTest);
revealVideoBtn.addEventListener('click', showVideoOnly);

// 关闭视频：点击视频本身或点击黑色背景任意处关闭（极简交互，无额外UI）
videoFullscreen.addEventListener('click', (e) => {
    // 点击任何地方都关闭（包括视频本身）
    hideVideo();
});
// 防止点击视频时冒泡导致关闭冲突（由于关闭逻辑统一，无需额外处理）
// 同时支持 ESC 键关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoFullscreen.classList.contains('active')) {
        hideVideo();
    }
});

// 视频错误时的极简处理（静默，无弹窗）
abstractVideo.addEventListener('error', () => {
    // 不做任何UI干预，保持干净
    console.warn("视频加载失败，请检查路径");
});

// 页面加载完成后，预先设置视频源（但不展示）
if (ABSTRACT_VIDEO_SRC && ABSTRACT_VIDEO_SRC !== "./abstract_surprise.mp4") {
    abstractVideo.src = ABSTRACT_VIDEO_SRC;
} else {
    // 页面控制台提醒
    setTimeout(() => {
        if (ABSTRACT_VIDEO_SRC === "./abstract_surprise.mp4") {
            console.log("%c🎬 提示：请修改 ABSTRACT_VIDEO_SRC 变量，指向你的抽象视频文件路径", "color: #ff8800; font-size: 12px");
        }
    }, 1000);
}

// 确保结果页初始占位
if (finalReportSummary) {
    finalReportSummary.innerHTML = "分析模型中，完成全部三类题目后将呈现完整报告...";
}