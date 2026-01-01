document.addEventListener('DOMContentLoaded', async () => {
  try {
    const resp = await fetch('/api/navigation');  // 从 Pages Function 读取 KV
    const data = await resp.json();
    const container = document.getElementById('modules');

    data.sections.forEach(sec => {
      const sectionDiv = document.createElement('div');
      sectionDiv.innerHTML = `<h2>${sec.title}</h2>`;
      const grid = document.createElement('div');
      grid.className = 'card-grid';

      sec.items.forEach(item => {
        grid.innerHTML += `
          <a href="${item.file}" class="demo-card">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
          </a>`;
      });

      sectionDiv.appendChild(grid);
      container.appendChild(sectionDiv);
    });
  } catch (e) {
    document.getElementById('modules').innerHTML = '<p style="text-align:center;color:#999;">模块加载失败，请稍后刷新</p>';
  }
});
