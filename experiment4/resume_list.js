/**
 * 简历列表页面脚本
 */

// 模拟简历数据
const mockResumes = [
    {
        id: 1,
        name: '张三丰',
        position: 'Java后端开发',
        education: '本科',
        location: '北京',
        salary: '15k-20k',
        experience: '12年'
    },
    {
        id: 2,
        name: '李四',
        position: '前端开发',
        education: '硕士',
        location: '上海',
        salary: '12k-18k',
        experience: '8年'
    },
    {
        id: 3,
        name: '王五',
        position: '测试工程师',
        education: '大专',
        location: '广州',
        salary: '8k-12k',
        experience: '5年'
    },
    {
        id: 4,
        name: '赵六',
        position: '产品经理',
        education: '本科',
        location: '深圳',
        salary: '18k-25k',
        experience: '10年'
    },
    {
        id: 5,
        name: '钱七',
        position: 'UI设计',
        education: '本科',
        location: '杭州',
        salary: '10k-15k',
        experience: '6年'
    },
    {
        id: 6,
        name: '孙八',
        position: 'Python开发',
        education: '博士',
        location: '成都',
        salary: '20k-30k',
        experience: '15年'
    }
];

/**
 * 页面加载完成后执行
 */
document.addEventListener('DOMContentLoaded', function() {
    renderResumeList(mockResumes);
});

/**
 * 渲染简历列表
 * @param {Array} resumes - 简历数组
 */
function renderResumeList(resumes) {
    const grid = document.getElementById('resumeGrid');
    
    if (resumes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>暂无简历</h3>
                <p>还没有添加任何简历</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    resumes.forEach(function(resume) {
        html += `
            <div class="resume-card" onclick="viewResume(${resume.id})">
                <div class="card-header">
                    <h3 class="card-name">${resume.name}</h3>
                    <p class="card-position">${resume.position}</p>
                </div>
                <div class="card-info">
                    <div class="info-row">
                        <span class="info-label">学历：</span>
                        <span class="info-value">${resume.education}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">地点：</span>
                        <span class="info-value">${resume.location}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">薪资：</span>
                        <span class="info-value">${resume.salary}/月</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">经验：</span>
                        <span class="info-value">${resume.experience}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-btn btn-view" onclick="event.stopPropagation();viewResume(${resume.id})">查看</button>
                    <button class="action-btn btn-edit" onclick="event.stopPropagation();editResume(${resume.id})">编辑</button>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

/**
 * 搜索简历
 */
function searchResume() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = mockResumes.filter(function(resume) {
        return resume.name.toLowerCase().includes(keyword) ||
               resume.position.toLowerCase().includes(keyword) ||
               resume.location.toLowerCase().includes(keyword);
    });
    
    renderResumeList(filtered);
}

/**
 * 查看简历详情
 * @param {number} id - 简历ID
 */
function viewResume(id) {
    const resume = mockResumes.find(function(r) { return r.id === id; });
    if (resume) {
        alert(`简历详情\n\n姓名：${resume.name}\n职位：${resume.position}\n学历：${resume.education}\n地点：${resume.location}\n薪资：${resume.salary}/月\n经验：${resume.experience}`);
    }
}

/**
 * 编辑简历
 * @param {number} id - 简历ID
 */
function editResume(id) {
    // 跳转到简历编辑页面
    alert(`正在打开简历ID ${id} 的编辑页面...`);
    // 实际项目中这里会跳转到编辑页面
}