// ═══════════════════════════════
//   ATTENDEASE — charts.js
// ═══════════════════════════════

let barChartInst      = null;
let doughnutInst      = null;
let analyticsBarInst  = null;

function destroyChart(inst) {
  try { if (inst) inst.destroy(); } catch(e) {}
}

// ── DASHBOARD BAR CHART ──
function renderBarChart() {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  const courses = getCourses();
  const cc      = chartColors();
  const labels  = courses.map(c => c.name.length > 12 ? c.name.slice(0,12)+'…' : c.name);
  const data    = courses.map(c => parseFloat(calcStats(c).pctTotal.toFixed(1)));
  const bgColors = courses.map(c => {
    const p = calcStats(c).pctTotal;
    return p >= 75 ? 'rgba(0,212,170,.75)' : p >= 60 ? 'rgba(249,199,79,.75)' : 'rgba(242,92,105,.75)';
  });
  const bdColors = courses.map(c => {
    const p = calcStats(c).pctTotal;
    return p >= 75 ? '#00d4aa' : p >= 60 ? '#f9c74f' : '#f25c69';
  });

  destroyChart(barChartInst);
  barChartInst = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Attendance %',
        data,
        backgroundColor: bgColors,
        borderColor: bdColors,
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ctx.raw + '%' } }
      },
      scales: {
        x: { ticks: { color: cc.text, font: { family: 'Plus Jakarta Sans', size: 11 } }, grid: { color: cc.grid } },
        y: { min: 0, max: 100, ticks: { color: cc.text, callback: v => v + '%', font: { family: 'Plus Jakarta Sans', size: 11 } }, grid: { color: cc.grid } }
      }
    }
  });
}

// ── DASHBOARD DOUGHNUT CHART ──
function renderDoughnutChart() {
  const canvas = document.getElementById('doughnutChart');
  if (!canvas) return;
  const courses  = getCourses();
  const attended = courses.reduce((s,c) => s + c.attended, 0);
  const absent   = courses.reduce((s,c) => s + c.absent,   0);
  const cc       = chartColors();

  destroyChart(doughnutInst);
  doughnutInst = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Attended', 'Absent'],
      datasets: [{
        data: [attended, absent],
        backgroundColor: ['rgba(0,212,170,.8)', 'rgba(242,92,105,.8)'],
        borderColor:     ['#00d4aa', '#f25c69'],
        borderWidth: 2,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: cc.text, font: { family: 'Plus Jakarta Sans', size: 12 }, padding: 16 }
        }
      }
    }
  });
}

// ── ANALYTICS BAR CHART ──
function renderAnalyticsChart() {
  const canvas = document.getElementById('analyticsBar');
  if (!canvas) return;
  const courses = getCourses();
  const cc      = chartColors();
  const labels  = courses.map(c => c.name.length > 14 ? c.name.slice(0,14)+'…' : c.name);
  const data    = courses.map(c => parseFloat(calcStats(c).pctTotal.toFixed(1)));

  destroyChart(analyticsBarInst);
  analyticsBarInst = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Your Attendance %',
          data,
          backgroundColor: 'rgba(61,142,248,.7)',
          borderColor: '#3d8ef8',
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: '75% Target',
          data: labels.map(() => 75),
          type: 'line',
          borderColor: '#f25c69',
          borderWidth: 2,
          borderDash: [6,4],
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: cc.text, font: { family: 'Plus Jakarta Sans', size: 12 }, padding: 16 }
        }
      },
      scales: {
        x: { ticks: { color: cc.text, font: { family: 'Plus Jakarta Sans', size: 11 } }, grid: { color: cc.grid } },
        y: { min: 0, max: 100, ticks: { color: cc.text, callback: v => v+'%', font: { family: 'Plus Jakarta Sans', size: 11 } }, grid: { color: cc.grid } }
      }
    }
  });
}

// ── REFRESH ALL CHARTS ──
function refreshCharts() {
  renderBarChart();
  renderDoughnutChart();
}
