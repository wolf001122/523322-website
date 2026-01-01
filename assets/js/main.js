/**
 * assets/js/main.js
 * 首页动态加载模块目录（从 Cloudflare KV 通过 Pages Function 获取）
 * 适用于 523322.xyz 工科教学网站
 */

document.addEventListener('DOMContentLoaded', async () => {
  const modulesContainer = document.getElementById('modules');

  if (!modulesContainer) {
    console.error('未找到 #modules 容器');
    return;
  }

  // 显示加载中提示
  modulesContainer.innerHTML = '<p style="text-align:center; color:#666; padding:40px;">加载模块中，请稍候...</p>';

  try {
    // 从 Pages Function 获取目录数据（路由：/api/navigation）
    const response = await fetch('/api/navigation');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('返回数据不是 JSON 格式');
    }

    const data = await response.json();

    // 验证 JSON 结构
    if (!data || !Array.isArray(data.sections)) {
      throw new Error('目录数据格式错误：缺少 sections 数组');
    }

    // 清空加载提示
    modulesContainer.innerHTML = '';

    // 渲染每个学科分类
    data.sections.forEach(section => {
      if (!section.title || !Array.isArray(section.items)) return;

      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'section';

      // 分类标题
      const title = document.createElement('h2');
      title.textContent = section.title;
      sectionDiv.appendChild(title);

      // 模块卡片网格
      const grid = document.createElement('div');
      grid.className = 'card-grid';

      section.items.forEach(item => {
        if (!item.name || !item.file || !item.desc) return;

        const link = document.createElement('a');
        link.href = item.file;
        link.className = 'demo-card';

        link.innerHTML = `
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.desc)}</p>
        `;

        grid.appendChild(link);
      });

      sectionDiv.appendChild(grid);
      modulesContainer.appendChild(sectionDiv);
    });

    // 如果没有内容
    if (modulesContainer.innerHTML.trim() === '') {
      modulesContainer.innerHTML = '<p style="text-align:center; color:#999;">暂无模块，敬请期待～</p>';
    }

  } catch (error) {
    console.error('加载目录失败:', error);
    modulesContainer.innerHTML = `
      <p style="text-align:center; color:#e74c3c; padding:40px;">
        模块加载失败<br>
        <small>${escapeHtml(error.message)}</small><br><br>
        <a href="." style="color:#007bff;">点击刷新重试</a>
      </p>
    `;
  }
});

// 简单 HTML 转义，防止潜在 XSS（虽然数据来自自己 KV）
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
