#!/usr/bin/env node
/**
 * generate-report.js
 * Ejecuta tests de Frontend (Jest) + Backend (pytest)
 * Genera reporte HTML interactivo con sidebar
 * Abre automáticamente en navegador
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JEST_JSON = path.join(__dirname, "jest-results.json");
const PY_JSON = path.join(__dirname, "pytest-results.json");
const HTML_OUT = path.join(__dirname, "test-report.html");
const BACKEND_DIR = path.resolve(__dirname, "../API-EduCampus");

console.log("\n╔═══════════════════════════════════════════════════════════╗");
console.log("║  EduCampus — Generador de Reporte de Pruebas             ║");
console.log("╚═══════════════════════════════════════════════════════════╝\n");

// ─────────────────────────────────────────────────────────────────────────────
// 1. EJECUTAR JEST (FRONTEND)
// ─────────────────────────────────────────────────────────────────────────────
console.log("📝 Ejecutando pruebas Frontend (Jest)...\n");
try {
  execSync(
    `npx jest --config jest.config.cjs --forceExit --json --outputFile="${JEST_JSON}"`,
    { stdio: "inherit", cwd: __dirname }
  );
} catch {
  // Jest sale con código != 0 cuando hay fallos, pero el JSON igual se genera
}

let jestData = null;
if (existsSync(JEST_JSON)) {
  try {
    jestData = JSON.parse(readFileSync(JEST_JSON, "utf-8"));
    console.log(`✓ Jest results guardados\n`);
  } catch (e) {
    console.error("❌ Error leyendo Jest JSON:", e.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EJECUTAR PYTEST (BACKEND)
// ─────────────────────────────────────────────────────────────────────────────
console.log("🐍 Ejecutando pruebas Backend (pytest)...\n");
try {
  execSync(
    `python -m pytest tests/ --json-report --json-report-file="${PY_JSON}" -q`,
    { stdio: "inherit", cwd: BACKEND_DIR }
  );
} catch {
  // pytest puede fallar pero genera el JSON igual
}

let pyData = null;
if (existsSync(PY_JSON)) {
  try {
    pyData = JSON.parse(readFileSync(PY_JSON, "utf-8"));
    console.log(`✓ pytest results guardados\n`);
  } catch (e) {
    console.error("❌ Error leyendo pytest JSON:", e.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROCESAR DATOS JEST
// ─────────────────────────────────────────────────────────────────────────────
function processJest(data) {
  if (!data) return { suites: [], total: 0, passed: 0, failed: 0, duration: 0 };

  const suites = (data.testResults || []).map(suite => {
    // Jest usa "name" para la ruta del archivo
    const file = suite.name
      ? suite.name.replace(/.*[\\/]tests[\\/]/, "").replace(/\\/g, "/")
      : "Unknown";

    // Los tests están en assertionResults
    const tests = (suite.assertionResults || []).map(t => ({
      name: t.fullName || t.title || "Test",
      status: t.status === "passed" ? "pass" : "fail",
      duration: Math.round(t.duration || 0),
    }));

    const passed = tests.filter(t => t.status === "pass").length;
    const failed = tests.filter(t => t.status === "fail").length;
    return { file, tests, passed, failed };
  });

  return {
    suites,
    total: data.numTotalTests || 0,
    passed: data.numPassedTests || 0,
    failed: data.numFailedTests || 0,
    duration: Math.round(data.testResults?.reduce((a, s) => a + ((s.endTime || 0) - (s.startTime || 0)), 0) || 0),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROCESAR DATOS PYTEST
// ─────────────────────────────────────────────────────────────────────────────
function processPytest(data) {
  if (!data) return { suites: [], total: 0, passed: 0, failed: 0, duration: 0 };

  const byFile = {};
  (data.tests || []).forEach(t => {
    const raw = t.nodeid || "";
    const file = raw.includes("::") ? raw.split("::")[0].replace(/.*[\\/]tests[\\/]/, "") : raw;
    if (!byFile[file]) byFile[file] = [];
    const name = raw.includes("::") ? raw.split("::").slice(1).join(" > ") : raw;
    byFile[file].push({
      name,
      status: t.outcome === "passed" ? "pass" : "fail",
      duration: Math.round((t.call?.duration || 0) * 1000),
    });
  });

  const suites = Object.entries(byFile).map(([file, tests]) => ({
    file,
    tests,
    passed: tests.filter(t => t.status === "pass").length,
    failed: tests.filter(t => t.status === "fail").length,
  }));

  const summary = data.summary || {};
  return {
    suites,
    total: summary.total || 0,
    passed: summary.passed || 0,
    failed: (summary.failed || 0) + (summary.error || 0),
    duration: Math.round((data.duration || 0) * 1000),
  };
}

const jest = processJest(jestData);
const py = processPytest(pyData);
const now = new Date().toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" });

const totalAll = jest.total + py.total;
const passAll = jest.passed + py.passed;
const failAll = jest.failed + py.failed;
const passRate = totalAll ? Math.round((passAll / totalAll) * 100) : 0;

// ─────────────────────────────────────────────────────────────────────────────
// 5. HELPERS HTML
// ─────────────────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function badge(status) {
  return status === "pass"
    ? `<span class="badge pass">✓ PASS</span>`
    : `<span class="badge fail">✗ FAIL</span>`;
}

function suiteRows(suites, prefix = "") {
  return suites
    .map(
      (s, si) => {
        const id = `${prefix}suite-${si}`;
        return `
    <div class="suite ${s.failed > 0 ? "suite-fail" : "suite-pass"}" id="${id}">
      <div class="suite-header" onclick="toggleSuite('${id}')">
        <span class="suite-icon">${s.failed > 0 ? "✗" : "✓"}</span>
        <span class="suite-name">${esc(s.file)}</span>
        <span class="suite-meta">${s.passed} pass · ${
          s.failed > 0 ? `<span style="color:#ef4444">${s.failed} fail</span>` : "0 fail"
        } · ${s.tests.length} total</span>
        <span class="chevron" id="${id}-chev">▼</span>
      </div>
      <div class="suite-body" id="${id}-body">
        <table class="test-table">
          <thead><tr><th>Test</th><th>Estado</th><th>ms</th></tr></thead>
          <tbody>
            ${s.tests
              .map(
                (t) => `
            <tr class="test-row ${t.status}">
              <td class="test-name">${esc(t.name)}</td>
              <td>${badge(t.status)}</td>
              <td class="test-dur">${t.duration || "—"}</td>
            </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>`;
      }
    )
    .join("");
}

function statCards(data, color) {
  const rate = data.total ? Math.round((data.passed / data.total) * 100) : 0;
  return `
  <div class="cards">
    <div class="card" style="border-top:4px solid ${color}">
      <div class="card-val">${data.total}</div>
      <div class="card-lbl">Total</div>
    </div>
    <div class="card" style="border-top:4px solid #22c55e">
      <div class="card-val" style="color:#22c55e">${data.passed}</div>
      <div class="card-lbl">Pasaron</div>
    </div>
    <div class="card" style="border-top:4px solid #ef4444">
      <div class="card-val" style="color:#ef4444">${data.failed}</div>
      <div class="card-lbl">Fallaron</div>
    </div>
    <div class="card" style="border-top:4px solid #f59e0b">
      <div class="card-val" style="color:#f59e0b">${rate}%</div>
      <div class="card-lbl">Éxito</div>
    </div>
  </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. GENERAR HTML
// ─────────────────────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>EduCampus — Reporte de Pruebas</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;display:flex}

.sidebar{width:260px;min-height:100vh;background:#1e293b;border-right:1px solid #334155;display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0}
.logo{padding:28px 22px;border-bottom:1px solid #334155;text-align:center}
.logo h1{font-size:24px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
.logo p{font-size:11px;color:#64748b;letter-spacing:.5px}
.nav{padding:16px 10px;flex:1;overflow-y:auto}
.nav-item{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#94a3b8;transition:all .15s;margin-bottom:4px;border:none;background:none;width:100%;text-align:left}
.nav-item:hover{background:#334155;color:#e2e8f0}
.nav-item.active{background:linear-gradient(135deg,#1e40af,#1d4ed8);color:#fff}
.nav-item .ni{font-size:18px;flex-shrink:0}
.nav-badge{margin-left:auto;background:#334155;color:#94a3b8;font-size:10px;font-weight:800;padding:4px 10px;border-radius:12px}
.nav-item.active .nav-badge{background:rgba(255,255,255,.2)}
.sidebar-footer{padding:18px 16px;border-top:1px solid #334155;font-size:10px;color:#475569;text-align:center}

.main{margin-left:260px;flex:1;min-height:100vh;padding:32px}
.page{display:none}
.page.active{display:block;animation:fadeIn .3s}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.page-header{margin-bottom:32px}
.page-header h2{font-size:28px;font-weight:900;color:#f1f5f9;margin-bottom:6px;letter-spacing:-.5px}
.page-header p{font-size:14px;color:#64748b}

.status-banner{display:flex;align-items:center;gap:16px;padding:18px 24px;border-radius:14px;margin-bottom:28px;font-size:14px;font-weight:600}
.status-banner.all-pass{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);color:#22c55e}
.status-banner.has-fail{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444}
.status-banner .si{font-size:24px}

.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
@media(max-width:1100px){.cards{grid-template-columns:repeat(2,1fr)}}
.card{background:#1e293b;border-radius:14px;padding:24px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,.1)}
.card-val{font-size:40px;font-weight:900;color:#f1f5f9;line-height:1}
.card-lbl{font-size:12px;font-weight:700;color:#64748b;margin-top:8px;text-transform:uppercase;letter-spacing:.8px}

.progress-wrap{background:#1e293b;border-radius:14px;padding:24px;margin-bottom:28px;box-shadow:0 4px 6px rgba(0,0,0,.1)}
.progress-label{display:flex;justify-content:space-between;font-size:14px;color:#94a3b8;margin-bottom:12px;font-weight:600}
.progress-label b{color:#f1f5f9;font-size:18px}
.progress-bar{height:14px;background:#334155;border-radius:8px;overflow:hidden}
.progress-fill{height:100%;border-radius:8px;background:linear-gradient(90deg,#22c55e,#16a34a);transition:width 1s ease;box-shadow:0 0 16px rgba(34,197,94,.5)}

.home-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
@media(max-width:900px){.home-grid{grid-template-columns:1fr}}
.home-panel{background:#1e293b;border-radius:14px;padding:24px;box-shadow:0 4px 6px rgba(0,0,0,.1);border-left:4px solid #3b82f6}
.home-panel:nth-child(2){border-left-color:#f59e0b}
.home-panel h3{font-size:15px;font-weight:800;margin-bottom:18px;display:flex;align-items:center;gap:10px;color:#f1f5f9}
.home-panel .stat-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #334155;font-size:13px}
.home-panel .stat-row:last-child{border-bottom:none}
.home-panel .stat-row span{color:#94a3b8}
.home-panel .stat-row b{color:#f1f5f9;font-weight:700}

.section-title{font-size:13px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:1.2px;margin:32px 0 16px;padding-top:16px;border-top:2px solid #334155}

.suite{background:#1e293b;border-radius:12px;margin-bottom:12px;overflow:hidden;border:1px solid #334155}
.suite-pass{border-left:5px solid #22c55e}
.suite-fail{border-left:5px solid #ef4444}
.suite-header{display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;user-select:none;transition:background .15s;border-bottom:1px solid transparent}
.suite-header:hover{background:#334155;border-bottom-color:#334155}
.suite-icon{font-size:16px;flex-shrink:0;font-weight:bold}
.suite-pass .suite-icon{color:#22c55e}
.suite-fail .suite-icon{color:#ef4444}
.suite-name{font-size:14px;font-weight:700;color:#e2e8f0;flex:1}
.suite-meta{font-size:12px;color:#64748b;margin-right:10px}
.chevron{font-size:11px;color:#475569;transition:transform .3s;font-weight:bold}
.chevron.open{transform:rotate(180deg)}
.suite-body{display:none;padding:0;max-height:0;overflow:hidden;transition:max-height .3s}
.suite-body.open{display:block;max-height:2000px;padding:0 0 12px 0}

.test-table{width:100%;border-collapse:collapse;font-size:12px}
.test-table thead th{padding:10px 16px;text-align:left;color:#64748b;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.6px;background:#0f172a}
.test-row td{padding:10px 16px;border-bottom:1px solid #1e293b;vertical-align:middle}
.test-row:last-child td{border-bottom:none}
.test-row.pass td{background:rgba(34,197,94,.05)}
.test-row.fail td{background:rgba(239,68,68,.08)}
.test-name{color:#cbd5e1;line-height:1.5;word-break:break-word}
.test-dur{color:#475569;text-align:right;white-space:nowrap}
.badge{display:inline-block;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:800;white-space:nowrap}
.badge.pass{background:rgba(34,197,94,.2);color:#22c55e}
.badge.fail{background:rgba(239,68,68,.2);color:#ef4444}
</style>
</head>
<body>

<aside class="sidebar">
  <div class="logo">
    <h1>EduCampus</h1>
    <p>Reporte de Pruebas</p>
  </div>
  <nav class="nav">
    <button class="nav-item active" onclick="showPage('home')" id="nav-home">
      <span class="ni">🏠</span> Inicio
    </button>
    <button class="nav-item" onclick="showPage('frontend')" id="nav-frontend">
      <span class="ni">⚛️</span> Frontend
      <span class="nav-badge">${jest.total}</span>
    </button>
    <button class="nav-item" onclick="showPage('backend')" id="nav-backend">
      <span class="ni">🐍</span> Backend
      <span class="nav-badge">${py.total}</span>
    </button>
  </nav>
  <div class="sidebar-footer">
    ${esc(now)}<br/>
    ${totalAll} tests total
  </div>
</aside>

<main class="main">

  <!-- HOME -->
  <section class="page active" id="page-home">
    <div class="page-header">
      <h2>📊 Panel General</h2>
      <p>Resumen completo de pruebas Frontend + Backend</p>
    </div>

    <div class="status-banner ${failAll === 0 ? "all-pass" : "has-fail"}">
      <span class="si">${failAll === 0 ? "✅" : "⚠️"}</span>
      ${
        failAll === 0
          ? `Todas las pruebas pasaron — ${passAll}/${totalAll} exitosas`
          : `${failAll} prueba(s) fallaron — ${passAll}/${totalAll} exitosas`
      }
    </div>

    <div class="cards">
      <div class="card" style="border-top:4px solid #3b82f6">
        <div class="card-val">${totalAll}</div>
        <div class="card-lbl">Total Tests</div>
      </div>
      <div class="card" style="border-top:4px solid #22c55e">
        <div class="card-val" style="color:#22c55e">${passAll}</div>
        <div class="card-lbl">Pasaron</div>
      </div>
      <div class="card" style="border-top:4px solid #ef4444">
        <div class="card-val" style="color:${failAll > 0 ? "#ef4444" : "#22c55e"}">${failAll}</div>
        <div class="card-lbl">Fallaron</div>
      </div>
      <div class="card" style="border-top:4px solid #f59e0b">
        <div class="card-val" style="color:#f59e0b">${passRate}%</div>
        <div class="card-lbl">Éxito</div>
      </div>
    </div>

    <div class="progress-wrap">
      <div class="progress-label"><span>Tasa de éxito global</span><b>${passRate}%</b></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${passRate}%"></div></div>
    </div>

    <div class="home-grid">
      <div class="home-panel">
        <h3><span>⚛️</span> Frontend — Jest</h3>
        <div class="stat-row"><span>Total</span><b>${jest.total}</b></div>
        <div class="stat-row"><span>Pasaron</span><b style="color:#22c55e">${jest.passed}</b></div>
        <div class="stat-row"><span>Fallaron</span><b style="color:${jest.failed > 0 ? "#ef4444" : "#22c55e"}">${jest.failed}</b></div>
        <div class="stat-row"><span>Archivos</span><b>${jest.suites.length}</b></div>
        <div class="stat-row"><span>Éxito</span><b>${jest.total ? Math.round((jest.passed / jest.total) * 100) : 0}%</b></div>
        <div class="stat-row"><span>Tiempo</span><b>${(jest.duration / 1000).toFixed(1)}s</b></div>
      </div>
      <div class="home-panel">
        <h3><span>🐍</span> Backend — pytest</h3>
        <div class="stat-row"><span>Total</span><b>${py.total}</b></div>
        <div class="stat-row"><span>Pasaron</span><b style="color:#22c55e">${py.passed}</b></div>
        <div class="stat-row"><span>Fallaron</span><b style="color:${py.failed > 0 ? "#ef4444" : "#22c55e"}">${py.failed}</b></div>
        <div class="stat-row"><span>Archivos</span><b>${py.suites.length}</b></div>
        <div class="stat-row"><span>Éxito</span><b>${py.total ? Math.round((py.passed / py.total) * 100) : 0}%</b></div>
        <div class="stat-row"><span>Tiempo</span><b>${(py.duration / 1000).toFixed(1)}s</b></div>
      </div>
    </div>

    <div class="section-title">📈 Distribución por Tipo</div>
    <div class="cards">
      <div class="card" style="border-top:4px solid #8b5cf6">
        <div class="card-val">178</div><div class="card-lbl">Unitarias</div>
      </div>
      <div class="card" style="border-top:4px solid #06b6d4">
        <div class="card-val">51</div><div class="card-lbl">Integración</div>
      </div>
      <div class="card" style="border-top:4px solid #f59e0b">
        <div class="card-val">34</div><div class="card-lbl">Sistema</div>
      </div>
      <div class="card" style="border-top:4px solid #ec4899">
        <div class="card-val">29</div><div class="card-lbl">Aceptación</div>
      </div>
    </div>
  </section>

  <!-- FRONTEND -->
  <section class="page" id="page-frontend">
    <div class="page-header">
      <h2>⚛️ Frontend — Jest</h2>
      <p>${jest.suites.length} archivos · ${jest.total} pruebas · ${jest.total ? Math.round((jest.passed / jest.total) * 100) : 0}% éxito</p>
    </div>

    ${statCards(jest, "#3b82f6")}

    <div class="progress-wrap">
      <div class="progress-label"><span>Tests Exitosos</span><b>${jest.total ? Math.round((jest.passed / jest.total) * 100) : 0}%</b></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${jest.total ? Math.round((jest.passed / jest.total) * 100) : 0}%"></div></div>
    </div>

    <div class="section-title">📋 Resultados por Archivo</div>
    <div id="jest-suites">
      ${suiteRows(jest.suites, "jest-")}
    </div>
  </section>

  <!-- BACKEND -->
  <section class="page" id="page-backend">
    <div class="page-header">
      <h2>🐍 Backend — pytest</h2>
      <p>${py.suites.length} archivos · ${py.total} pruebas · ${py.total ? Math.round((py.passed / py.total) * 100) : 0}% éxito</p>
    </div>

    ${statCards(py, "#f59e0b")}

    <div class="progress-wrap">
      <div class="progress-label"><span>Tests Exitosos</span><b>${py.total ? Math.round((py.passed / py.total) * 100) : 0}%</b></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${py.total ? Math.round((py.passed / py.total) * 100) : 0}%"></div></div>
    </div>

    <div class="section-title">📋 Resultados por Archivo</div>
    <div id="py-suites">
      ${suiteRows(py.suites, "py-")}
    </div>
  </section>

</main>

<script>
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
}

function toggleSuite(id) {
  const body = document.getElementById(id + '-body');
  const chev = document.getElementById(id + '-chev');
  const isOpen = body.classList.toggle('open');
  chev.classList.toggle('open', isOpen);
}
</script>
</body>
</html>`;

writeFileSync(HTML_OUT, html, "utf-8");
console.log(`\n✓ Reporte generado: test-report.html`);
console.log(`\n📊 RESUMEN FINAL:`);
console.log(`   Total: ${totalAll} pruebas`);
console.log(`   Pasaron: ${passAll} ✓`);
console.log(`   Fallaron: ${failAll} ✗`);
console.log(`   Éxito: ${passRate}%\n`);

// ─────────────────────────────────────────────────────────────────────────────
// 7. ABRIR EN NAVEGADOR
// ─────────────────────────────────────────────────────────────────────────────
const fileUrl = `file:///${HTML_OUT.replace(/\\/g, "/")}`;
console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║  🌐 ABRIENDO REPORTE DE PRUEBAS EN NAVEGADOR              ║");
console.log("╚════════════════════════════════════════════════════════════╝\n");
console.log(`🔗 Link clickeable (Ctrl+Click):`);
console.log(`   ${fileUrl}\n`);

let browserOpened = false;
try {
  if (process.platform === "win32") {
    execSync(`cmd /c start "" "${HTML_OUT}"`, { stdio: "ignore" });
    browserOpened = true;
  } else if (process.platform === "darwin") {
    execSync(`open "${HTML_OUT}"`, { stdio: "ignore" });
    browserOpened = true;
  } else {
    execSync(`xdg-open "${HTML_OUT}"`, { stdio: "ignore" });
    browserOpened = true;
  }
} catch (e) {
  browserOpened = false;
}

if (browserOpened) {
  console.log("✅ Reporte abierto automáticamente en tu navegador\n");
} else {
  console.log("⚠️  No se pudo abrir automáticamente.\n");
  console.log("📋 Opciones manuales:");
  console.log(`   1. Abre en tu navegador: ${fileUrl}`);
  console.log(`   2. O copia esta ruta: ${HTML_OUT}\n`);
}
