import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_OUT  = path.join(__dirname, "test-results.json");
const HTML_OUT  = path.join(__dirname, "test-report.html");

// ─────────────────────────────────────────────────────────────────
// 1. Ejecutar pruebas
// ─────────────────────────────────────────────────────────────────
console.log("\nEduCampus — Generando informe de pruebas Frontend...\n");

try {
  execSync(
    `npx vitest run --reporter=json --outputFile="${JSON_OUT}"`,
    { stdio: "inherit", cwd: __dirname }
  );
} catch { /* vitest sale con codigo != 0 cuando hay fallos; JSON igual se genera */ }

if (!existsSync(JSON_OUT)) {
  console.error("Error: No se encontro test-results.json");
  process.exit(1);
}

const data = JSON.parse(readFileSync(JSON_OUT, "utf-8"));

console.log(`\nJSON report written to ${JSON_OUT}\n`);

// ─────────────────────────────────────────────────────────────────
// 2. Metadatos por archivo
// ─────────────────────────────────────────────────────────────────
const FILE_LABELS = {
  "useEstudianteValidator.test.jsx": "useEstudianteValidator",
  "useDocenteValidator.test.jsx":    "useDocenteValidator",
  "useCursoValidator.test.jsx":      "useCursoValidator",
  "EstadoBadge.test.jsx":            "EstadoBadge",
  "Login.test.jsx":                  "Login",
  "AppRoles.test.jsx":               "AppRoles (Sidebar)",
  "App.test.jsx":                    "App (rutas)",
  "bugs.test.jsx":                   "Deteccion de Bugs",
  "int_flujo_login.test.jsx":        "Integracion — Flujo Login",
  "int_flujo_roles.test.jsx":        "Integracion — Flujo Roles",
  "sis_usabilidad.test.jsx":         "Sistema — Usabilidad UI",
  "sis_portabilidad.test.jsx":       "Sistema — Portabilidad",
  "acep_hu_frontend.test.jsx":       "Aceptacion — HU-01 a HU-04",
};

const FILE_TECNICA = {
  "useEstudianteValidator.test.jsx": "CE · VL · CB",
  "useDocenteValidator.test.jsx":    "CE · VL · CB",
  "useCursoValidator.test.jsx":      "CE · VL · CB",
  "EstadoBadge.test.jsx":            "CE · VL",
  "Login.test.jsx":                  "CE",
  "AppRoles.test.jsx":               "CE",
  "App.test.jsx":                    "CE",
  "bugs.test.jsx":                   "Regresion",
  "int_flujo_login.test.jsx":        "CB · Inc. Ascendente",
  "int_flujo_roles.test.jsx":        "CB · Inc. Descendente",
  "sis_usabilidad.test.jsx":         "CE",
  "sis_portabilidad.test.jsx":       "CE · VL",
  "acep_hu_frontend.test.jsx":       "CB (HU)",
};

// Agrupacion en 4 niveles (igual que backend)
const NIVELES = {
  "Pruebas Unitarias": {
    id:    "sec-unitarias",
    badge: "U",
    color: "#1849b5",
    desc:  "Pruebas de hooks y componentes React individuales. Tecnicas: CE · VL · CB",
    files: [
      "useEstudianteValidator.test.jsx",
      "useDocenteValidator.test.jsx",
      "useCursoValidator.test.jsx",
      "EstadoBadge.test.jsx",
      "Login.test.jsx",
      "AppRoles.test.jsx",
      "App.test.jsx",
      "bugs.test.jsx",
    ],
  },
  "Pruebas de Integracion": {
    id:    "sec-integracion",
    badge: "I",
    color: "#0f766e",
    desc:  "Integracion incremental entre componentes y contexto de autenticacion",
    files: [
      "int_flujo_login.test.jsx",
      "int_flujo_roles.test.jsx",
    ],
  },
  "Pruebas de Sistema": {
    id:    "sec-sistema",
    badge: "S",
    color: "#7e22ce",
    desc:  "Usabilidad: etiquetas, mensajes de error y retroalimentacion. Portabilidad: renderizado universal",
    files: [
      "sis_usabilidad.test.jsx",
      "sis_portabilidad.test.jsx",
    ],
  },
  "Pruebas de Aceptacion": {
    id:    "sec-aceptacion",
    badge: "A",
    color: "#b45309",
    desc:  "Criterios de aceptacion basados en historias de usuario (HU-01 a HU-04)",
    files: [
      "acep_hu_frontend.test.jsx",
    ],
  },
};

// Etiquetas cortas para el menu de navegacion
const FILE_NAV_LABEL = {
  "useEstudianteValidator.test.jsx": "useEstudianteValidator",
  "useDocenteValidator.test.jsx":    "useDocenteValidator",
  "useCursoValidator.test.jsx":      "useCursoValidator",
  "EstadoBadge.test.jsx":            "EstadoBadge",
  "Login.test.jsx":                  "Login",
  "AppRoles.test.jsx":               "AppRoles",
  "App.test.jsx":                    "App",
  "bugs.test.jsx":                   "Deteccion de Bugs",
  "int_flujo_login.test.jsx":        "flujo login",
  "int_flujo_roles.test.jsx":        "flujo roles",
  "sis_usabilidad.test.jsx":         "usabilidad",
  "sis_portabilidad.test.jsx":       "portabilidad",
  "acep_hu_frontend.test.jsx":       "historias de usuario",
};

// ─────────────────────────────────────────────────────────────────
// 3. Helpers
// ─────────────────────────────────────────────────────────────────
const bn       = (r) => path.basename(r.name || r.testFilePath || "");
const label    = (r) => FILE_LABELS[bn(r)]  || bn(r);
const ftec     = (r) => FILE_TECNICA[bn(r)] || "–";
const suiteDur = (r) => (r.endTime || 0) - (r.startTime || 0);
const fmtMs    = (ms) => !ms || ms < 1 ? "< 1 ms" : ms < 1000 ? `${Math.round(ms)} ms` : `${(ms/1000).toFixed(2)} s`;
const escHtml  = (s)  => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const fileToId = (fname) => "s-" + fname.replace(".test.jsx","").replace(/[^a-zA-Z0-9]/g,"-").toLowerCase();

function fmtDate(ts) {
  return new Date(ts || Date.now()).toLocaleString("es-CO", {
    weekday:"long", year:"numeric", month:"long", day:"numeric", hour:"2-digit", minute:"2-digit",
  });
}

// ─────────────────────────────────────────────────────────────────
// 4. Estadisticas globales
// ─────────────────────────────────────────────────────────────────
const total    = data.numTotalTests  || 0;
const passed   = data.numPassedTests || 0;
const failed   = data.numFailedTests || 0;
const duration = data.testResults.reduce((s,r) => s + suiteDur(r), 0);
const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
const execDate = fmtDate(data.startTime);

// Indice de suites por nombre de archivo
const suiteByFile = {};
data.testResults.forEach(r => { suiteByFile[bn(r)] = r; });

// ─────────────────────────────────────────────────────────────────
// 5. Navegacion desplegable (igual estructura que backend)
// ─────────────────────────────────────────────────────────────────
function navHtml() {
  let groups = "";

  for (const [nivelName, cfg] of Object.entries(NIVELES)) {
    const { id, badge, color, files } = cfg;
    let totalN = 0, passN = 0;
    let links  = "";

    files.forEach(fname => {
      const suite = suiteByFile[fname];
      if (!suite) return;
      const p = suite.assertionResults.filter(t => t.status === "passed").length;
      const t = suite.assertionResults.length;
      passN  += p;
      totalN += t;
      const dotCls = p === t ? "dot-ok" : "dot-err";
      const lbl    = FILE_NAV_LABEL[fname] || fname;
      links += `<a href="#${fileToId(fname)}" class="dd-link"><span class="dot ${dotCls}"></span>${escHtml(lbl)}<span class="dd-cnt">${t}</span></a>`;
    });

    if (!links) continue;

    groups += `
    <div class="nav-item">
      <a href="#${id}" class="nav-a" style="--c:${color}">
        <span class="nav-badge" style="background:${color}">${badge}</span>
        ${nivelName}
        <span class="nav-cnt">${totalN}</span>
        <span class="nav-arrow">&#9662;</span>
      </a>
      <div class="dropdown">
        <div class="dd-header" style="border-top:3px solid ${color}">${nivelName}</div>
        ${links}
      </div>
    </div>`;
  }

  return `
<nav class="sticky-nav">
  <div class="nav-inner">
    <a href="#resumen" class="nav-brand">EC Frontend</a>
    <div class="nav-group">
      <a href="#resumen" class="nav-a nav-plain">Resumen</a>
      <a href="#modulos" class="nav-a nav-plain">Tabla</a>
      <a href="#bugs"    class="nav-a nav-plain" style="color:rgba(255,150,150,.9)">Bugs</a>
      ${groups}
    </div>
  </div>
</nav>`;
}

// ─────────────────────────────────────────────────────────────────
// 6. Bloques HTML
// ─────────────────────────────────────────────────────────────────

/* Tarjetas globales */
function cards() {
  const rc = passRate===100?"#27ae60":passRate>=80?"#f39c12":"#e74c3c";
  return `
  <div class="cards">
    <div class="card card-total"><div class="card-icon">🧪</div><div class="card-num">${total}</div><div class="card-lbl">Total de Pruebas</div></div>
    <div class="card card-pass"><div class="card-icon">✅</div><div class="card-num">${passed}</div><div class="card-lbl">Exitosas</div></div>
    <div class="card card-fail"><div class="card-icon">❌</div><div class="card-num">${failed}</div><div class="card-lbl">Con Fallos</div></div>
    <div class="card card-time"><div class="card-icon">⏱</div><div class="card-num-sm">${fmtMs(duration)}</div><div class="card-lbl">Duracion Total</div></div>
  </div>
  <div class="progress-wrap">
    <div class="progress-top"><span class="progress-label">Tasa de Exito</span><span class="progress-pct" style="color:${rc}">${passRate}%</span></div>
    <div class="progress-track"><div class="progress-fill" style="width:${passRate}%;background:${rc}"></div></div>
    <div class="progress-sub">${passed} de ${total} pruebas pasaron correctamente</div>
  </div>`;
}

/* Tabla por modulo */
function moduleTable() {
  const rows = data.testResults.map(suite => {
    const p  = suite.assertionResults.filter(t => t.status==="passed").length;
    const f  = suite.assertionResults.length - p;
    const ok = f === 0;
    // Determinar nivel del archivo
    const fname = bn(suite);
    let nivel = "–";
    for (const [nName, cfg] of Object.entries(NIVELES)) {
      if (cfg.files.includes(fname)) { nivel = nName; break; }
    }
    return `
    <tr>
      <td><span class="badge ${ok?"badge-ok":"badge-err"}">${ok?"PASS":"FAIL"}</span></td>
      <td><a href="#${fileToId(fname)}" class="tbl-anchor"><strong>${label(suite)}</strong></a></td>
      <td><span class="chip chip-nivel">${nivel}</span></td>
      <td><span class="chip chip-tec">${ftec(suite)}</span></td>
      <td class="center">${suite.assertionResults.length}</td>
      <td class="center num-pass">${p}</td>
      <td class="center">${f>0?`<span class="num-fail">${f}</span>`:`<span class="dim">–</span>`}</td>
      <td class="center dim">${fmtMs(suiteDur(suite))}</td>
    </tr>`;
  }).join("");

  return `
  <table class="tbl">
    <thead><tr>
      <th>Estado</th><th>Modulo</th><th>Nivel</th><th>Tecnica</th>
      <th class="center">Total</th><th class="center">Pasaron</th>
      <th class="center">Fallaron</th><th class="center">Tiempo</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr class="tbl-foot">
      <td colspan="4"><strong>TOTAL</strong></td>
      <td class="center"><strong>${total}</strong></td>
      <td class="center num-pass"><strong>${passed}</strong></td>
      <td class="center num-fail"><strong>${failed>0?failed:"–"}</strong></td>
      <td class="center dim">${fmtMs(duration)}</td>
    </tr></tfoot>
  </table>`;
}

/* Seccion de bugs */
function bugSection() {
  const bugs = [{
    id:"BUG-02",
    title:"cupo_estudiante acepta valores de texto no numericos",
    module:"useCursoValidator.jsx",
    severity:"MEDIA",
    status:"CORREGIDO",
    description:'El campo <code>cupo_estudiante</code> aceptaba cadenas como <code>"abc"</code> sin error. La condicion <code>!curso.cupo_estudiante</code> evalua a false para cualquier string no vacio, y <code>"abc" &lt; 1</code> resulta false porque JS convierte "abc" a NaN.',
    before:`if (!curso.cupo_estudiante || curso.cupo_estudiante &lt; 1) {\n  newErrors.cupo_estudiante = "El cupo debe ser al menos 1.";\n}`,
    after:`const cupo = Number(curso.cupo_estudiante);\nif (!curso.cupo_estudiante || isNaN(cupo) || !Number.isInteger(cupo) || cupo &lt; 1) {\n  newErrors.cupo_estudiante = "Debe ser un numero entero de al menos 1.";\n}`,
    tests:["BUG-02 cupo='abc' (texto) debe ser INVALIDO","BUG-02 cupo=0.5 (fraccion) debe ser INVALIDO"],
    impact:"Un usuario podia registrar un curso con cupo invalido, generando inconsistencias en la BD.",
  }];

  return bugs.map(b => `
  <div class="bug-card">
    <div class="bug-hdr">
      <span class="bug-id">${b.id}</span>
      <span class="bug-title">${b.title}</span>
      <div class="bug-tags">
        <span class="bug-sev sev-${b.severity.toLowerCase()}">${b.severity}</span>
        <span class="bug-stat ${b.status==="CORREGIDO"?"stat-fixed":"stat-open"}">${b.status}</span>
      </div>
    </div>
    <div class="bug-body">
      <div class="info-grid">
        <div class="info-item"><span class="info-key">Modulo</span><code>${b.module}</code></div>
        <div class="info-item"><span class="info-key">Severidad</span>${b.severity}</div>
        <div class="info-item"><span class="info-key">Estado</span>${b.status}</div>
      </div>
      <p class="block-text" style="margin-bottom:12px">${b.description}</p>
      <p class="block-text" style="margin-bottom:12px;color:#7c3aed"><strong>Impacto:</strong> ${escHtml(b.impact)}</p>
      <div class="code-row">
        <div><p class="code-label code-label-bad">Codigo con defecto</p><pre class="code-blk code-bad">${b.before}</pre></div>
        <div><p class="code-label code-label-good">Codigo corregido</p><pre class="code-blk code-good">${b.after}</pre></div>
      </div>
      <p class="block-label">Pruebas que detectaron el defecto:</p>
      <ul class="bug-tests">${b.tests.map(t=>`<li><code>${escHtml(t)}</code></li>`).join("")}</ul>
    </div>
  </div>`).join("");
}

/* Bloque de nivel (igual estructura que backend) */
function nivelBlock(nivelName, cfg) {
  const { id, badge, color, desc, files } = cfg;
  let totalN = 0, passN = 0;
  let suitesHtml = "";

  files.forEach(fname => {
    const suite = suiteByFile[fname];
    if (!suite) return;

    const p = suite.assertionResults.filter(t => t.status==="passed").length;
    const f = suite.assertionResults.length - p;
    totalN += suite.assertionResults.length;
    passN  += p;

    // Agrupar por describe
    const groups = {};
    suite.assertionResults.forEach(t => {
      const g = (t.ancestorTitles && t.ancestorTitles[0]) || "(sin grupo)";
      if (!groups[g]) groups[g] = [];
      groups[g].push(t);
    });

    const groupsHTML = Object.entries(groups).map(([gName, tests]) => {
      const gp = tests.filter(t => t.status==="passed").length;
      const gf = tests.length - gp;
      const rows = tests.map(t => {
        const ok  = t.status==="passed";
        const err = t.failureMessages?.length
          ? `<tr class="err-row"><td></td><td colspan="2" class="err-msg">! ${escHtml(t.failureMessages[0].split("\n")[0])}</td></tr>` : "";
        return `<tr class="${ok?"tr-ok":"tr-err"}">
          <td class="icon-cell">${ok?"+":"x"}</td>
          <td>${escHtml(t.title)}</td>
          <td class="center dim">${fmtMs(t.duration)}</td>
        </tr>${err}`;
      }).join("");
      return `
      <tr class="grp-row ${gf>0?"grp-fail":"grp-pass"}">
        <td colspan="3"><strong>${escHtml(gName)}</strong>
          <span class="grp-meta"><span class="g-ok">${gp} pasaron</span>${gf>0?`<span class="g-err">${gf} fallaron</span>`:""}</span>
        </td>
      </tr>${rows}`;
    }).join("");

    suitesHtml += `
    <div class="suite" id="${fileToId(fname)}">
      <div class="suite-hdr ${f>0?"suite-bad":"suite-good"}">
        <span class="suite-icon">${f>0?"x":"v"}</span>
        <span class="suite-name">${label(suite)}</span>
        <span class="suite-right">
          <span class="chip chip-tec">${ftec(suite)}</span>
          <span class="s-ok">${p} pasaron</span>
          ${f>0?`<span class="s-err">${f} fallaron</span>`:""}
          <span class="dim">${fmtMs(suiteDur(suite))}</span>
        </span>
      </div>
      <table class="tbl tbl-detail">
        <thead><tr><th style="width:42px">Est.</th><th>Prueba</th><th class="center" style="width:90px">Tiempo</th></tr></thead>
        <tbody>${groupsHTML}</tbody>
      </table>
    </div>`;
  });

  if (!suitesHtml) return "";

  const rate = totalN > 0 ? Math.round((passN/totalN)*100) : 0;
  const rc   = rate===100?"#22c55e":rate>=80?"#f59e0b":"#ef4444";

  return `
  <div class="nivel-block" id="${id}">
    <div class="nivel-hdr" style="background:${color}">
      <div class="nivel-badge">${badge}</div>
      <div class="nivel-info">
        <div class="nivel-title">${nivelName}</div>
        <div class="nivel-desc">${desc}</div>
      </div>
      <div style="text-align:right;font-size:13px;font-weight:800;color:rgba(255,255,255,.9)">${passN}/${totalN} exitosas</div>
    </div>
    <div class="nivel-body">
      <div class="mini-cards" style="--acc:${color}">
        <div class="mc"><div class="mc-num" style="color:${color}">${totalN}</div><div class="mc-lbl">Total</div></div>
        <div class="mc"><div class="mc-num" style="color:#22c55e">${passN}</div><div class="mc-lbl">Pasaron</div></div>
        <div class="mc mc-rate">
          <div class="pbar-top"><span style="font-size:12px;font-weight:700;color:#475569">Exito</span>
            <span style="font-size:18px;font-weight:900;color:${rc}">${rate}%</span></div>
          <div class="pbar-track"><div class="pbar-fill" style="width:${rate}%;background:${rc}"></div></div>
        </div>
      </div>
      ${suitesHtml}
    </div>
  </div>`;
}

/* Todas las secciones de nivel */
function sectionsHtml() {
  return Object.entries(NIVELES)
    .map(([name, cfg]) => nivelBlock(name, cfg))
    .join("\n");
}

// ─────────────────────────────────────────────────────────────────
// 7. CSS
// ─────────────────────────────────────────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#eef2f7;color:#2d3748;font-size:14px;line-height:1.5}
a{color:inherit;text-decoration:none}
code{font-family:'Cascadia Code','Consolas',monospace;background:#edf2ff;color:#3730a3;padding:1px 6px;border-radius:4px;font-size:12px}
/* Header */
.hdr{background:linear-gradient(135deg,#0d2b6b 0%,#1849b5 100%);color:#fff}
.hdr-inner{max-width:1140px;margin:0 auto;padding:28px 32px 24px}
.hdr-brand-row{display:flex;align-items:center;gap:14px}
.hdr-logo{width:50px;height:50px;background:rgba(255,255,255,.15);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0}
.hdr-brand{font-size:23px;font-weight:800;letter-spacing:-.5px}
.hdr-brand-sub{font-size:12px;color:rgba(255,255,255,.6);margin-top:2px}
.hdr-divider{height:1px;background:rgba(255,255,255,.15);margin:16px 0 14px}
.hdr-title{font-size:18px;font-weight:700}
.hdr-meta{margin-top:7px;display:flex;flex-wrap:wrap;gap:18px;font-size:12px;color:rgba(255,255,255,.65)}
/* Navegacion sticky */
.sticky-nav{position:sticky;top:0;z-index:200;background:#162d59;box-shadow:0 2px 10px rgba(0,0,0,.35)}
.nav-inner{max-width:1140px;margin:0 auto;padding:0 24px;display:flex;align-items:center;gap:4px}
.nav-brand{font-size:13px;font-weight:800;color:rgba(255,255,255,.7);padding:0 12px 0 4px;white-space:nowrap;border-right:1px solid rgba(255,255,255,.12);margin-right:6px}
.nav-brand:hover{color:#fff}
.nav-group{display:flex;align-items:center}
.nav-a{display:flex;align-items:center;gap:6px;padding:11px 12px;font-size:12.5px;font-weight:600;color:rgba(255,255,255,.82);white-space:nowrap;transition:background .15s,color .15s;cursor:pointer}
.nav-a:hover,.nav-item:hover>.nav-a{background:rgba(255,255,255,.1);color:#fff}
.nav-plain{font-size:12px;font-weight:500;color:rgba(255,255,255,.65)}
.nav-plain:hover{color:#fff;background:rgba(255,255,255,.08)}
.nav-badge{width:20px;height:20px;border-radius:5px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff;flex-shrink:0}
.nav-cnt{background:rgba(255,255,255,.18);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px}
.nav-arrow{font-size:10px;opacity:.5;margin-left:2px}
.nav-item{position:relative}
/* Dropdown */
.dropdown{display:none;position:absolute;top:calc(100% + 2px);left:0;background:#fff;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.18);min-width:210px;z-index:300;overflow:hidden;animation:ddFade .12s ease}
@keyframes ddFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.nav-item:hover .dropdown{display:block}
.dd-header{padding:8px 14px 6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#94a3b8;background:#f8fafc;border-bottom:1px solid #e2e8f0}
.dd-link{display:flex;align-items:center;gap:8px;padding:9px 14px;font-size:12.5px;font-weight:500;color:#334155;border-bottom:1px solid #f1f5f9;transition:background .1s}
.dd-link:last-child{border-bottom:none}
.dd-link:hover{background:#f0f7ff;color:#1a3a6b}
.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.dot-ok{background:#22c55e}.dot-err{background:#ef4444}
.dd-cnt{margin-left:auto;background:#f1f5f9;color:#64748b;font-size:10px;font-weight:700;padding:1px 6px;border-radius:99px}
/* Layout */
.page{max-width:1140px;margin:0 auto;padding:0 32px 56px}
.section{margin-top:36px}
.section-title{font-size:12px;font-weight:800;color:#1a3a6b;text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;border-bottom:2px solid #1a3a6b;margin-bottom:16px}
/* Cards */
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.card{background:#fff;border-radius:14px;padding:22px 18px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.07);border-top:5px solid transparent}
.card-icon{font-size:22px;margin-bottom:8px}
.card-total{border-top-color:#3b82f6}.card-pass{border-top-color:#22c55e}.card-fail{border-top-color:#ef4444}.card-time{border-top-color:#8b5cf6}
.card-num{font-size:38px;font-weight:900;line-height:1}
.card-num-sm{font-size:20px;font-weight:800;line-height:1;padding-top:4px}
.card-total .card-num{color:#3b82f6}.card-pass .card-num{color:#22c55e}.card-fail .card-num{color:#ef4444}.card-time .card-num-sm{color:#8b5cf6}
.card-lbl{margin-top:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#94a3b8}
.progress-wrap{background:#fff;border-radius:14px;padding:18px 22px;box-shadow:0 2px 12px rgba(0,0,0,.07);margin-top:14px}
.progress-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}
.progress-label{font-weight:700;font-size:13px;color:#475569}
.progress-pct{font-size:20px;font-weight:900}
.progress-track{height:13px;background:#e2e8f0;border-radius:99px;overflow:hidden}
.progress-fill{height:100%;border-radius:99px}
.progress-sub{margin-top:7px;font-size:12px;color:#94a3b8}
/* Tabla */
.tbl{width:100%;border-collapse:collapse;background:#fff;box-shadow:0 1px 8px rgba(0,0,0,.06);border-radius:10px;overflow:hidden}
.tbl thead tr{background:#1a3a6b;color:#fff}
.tbl th{padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;white-space:nowrap}
.tbl td{padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:13px}
.tbl tbody tr:last-child td{border-bottom:none}
.tbl tbody tr:hover td{background:#f8faff}
.tbl-foot td{background:#f8fafc;border-top:2px solid #e2e8f0;font-size:13px;border-bottom:none}
.tbl-anchor{color:#1a3a6b;font-weight:700}.tbl-anchor:hover{text-decoration:underline}
.center{text-align:center}.dim{color:#94a3b8}.num-pass{color:#16a34a;font-weight:700}.num-fail{color:#dc2626;font-weight:700}
.badge{display:inline-block;padding:3px 10px;border-radius:5px;font-size:11px;font-weight:700;letter-spacing:.5px}
.badge-ok{background:#dcfce7;color:#15803d}.badge-err{background:#fee2e2;color:#b91c1c}
.chip{display:inline-block;padding:2px 9px;border-radius:5px;font-size:11px;font-weight:600;white-space:nowrap}
.chip-nivel{background:#e0e7ff;color:#4338ca}.chip-tec{background:#fef3c7;color:#92400e}
/* Bugs */
.bug-card{background:#fff;border-radius:12px;box-shadow:0 1px 8px rgba(0,0,0,.07);margin-bottom:18px;overflow:hidden;border-left:6px solid #ef4444}
.bug-hdr{background:#fff5f5;padding:13px 18px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #fee2e2;flex-wrap:wrap}
.bug-id{background:#ef4444;color:#fff;padding:3px 10px;border-radius:5px;font-size:11px;font-weight:800;white-space:nowrap}
.bug-title{flex:1;font-weight:700;font-size:14px;color:#1e293b}
.bug-tags{display:flex;gap:7px}
.bug-sev,.bug-stat{padding:3px 10px;border-radius:5px;font-size:11px;font-weight:700}
.sev-media{background:#fef3c7;color:#92400e}.sev-alta{background:#fee2e2;color:#b91c1c}
.stat-fixed{background:#dcfce7;color:#15803d}.stat-open{background:#fee2e2;color:#b91c1c}
.bug-body{padding:16px 18px}
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px}
.info-item{background:#f8fafc;border-radius:8px;padding:9px 12px}
.info-key{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#94a3b8;margin-bottom:3px}
.block-label{font-size:11px;font-weight:700;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px}
.block-text{font-size:13px;color:#334155;line-height:1.7}
.code-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:12px}
.code-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
.code-label-bad{color:#b91c1c}.code-label-good{color:#15803d}
.code-blk{border-radius:8px;padding:14px;font-family:'Cascadia Code','Consolas',monospace;font-size:12px;line-height:1.7;overflow-x:auto;white-space:pre;background:#0f172a;color:#cbd5e1}
.code-bad{border-left:4px solid #ef4444}.code-good{border-left:4px solid #22c55e}
.bug-tests{list-style:none;padding:0;margin-top:5px}
.bug-tests li{padding:5px 0;border-bottom:1px solid #f1f5f9;font-size:12px;color:#475569}
.bug-tests li:last-child{border-bottom:none}
/* Nivel blocks */
.nivel-block{margin-top:28px;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08)}
.nivel-hdr{padding:16px 22px;color:#fff;display:flex;align-items:center;gap:14px}
.nivel-badge{width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;flex-shrink:0}
.nivel-info{flex:1}
.nivel-title{font-size:16px;font-weight:800}
.nivel-desc{font-size:12px;color:rgba(255,255,255,.7);margin-top:2px}
.nivel-body{background:#fff;padding:20px}
.mini-cards{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;padding:13px;background:#f8fafc;border-radius:10px;border-left:4px solid var(--acc)}
.mc{text-align:center;padding:4px 14px;border-right:1px solid #e2e8f0}
.mc:last-child{border-right:none}
.mc-rate{flex:1;min-width:160px;text-align:left;padding-left:18px}
.mc-num{font-size:24px;font-weight:900;line-height:1}
.mc-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#94a3b8;margin-top:3px}
.pbar-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px}
.pbar-track{height:10px;background:#e2e8f0;border-radius:99px;overflow:hidden}
.pbar-fill{height:100%;border-radius:99px}
/* Suites */
.suite{margin-bottom:18px;border-radius:10px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,.06)}
.suite-hdr{padding:11px 16px;display:flex;align-items:center;gap:10px}
.suite-good{background:#f0fdf4;border-left:5px solid #22c55e}.suite-bad{background:#fff5f5;border-left:5px solid #ef4444}
.suite-icon{font-size:13px;font-weight:900}
.suite-good .suite-icon{color:#16a34a}.suite-bad .suite-icon{color:#dc2626}
.suite-name{flex:1;font-weight:700;font-size:13px;color:#1e293b}
.suite-right{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.s-ok{color:#16a34a;font-weight:700;font-size:12px}.s-err{color:#dc2626;font-weight:700;font-size:12px}
.tbl-detail{border-radius:0;box-shadow:none}
.grp-row td{padding:7px 14px !important;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;border-bottom:none !important}
.grp-pass td{background:#f0fdf4;color:#166534}.grp-fail td{background:#fff5f5;color:#991b1b}
.grp-meta{float:right;text-transform:none;font-weight:400;letter-spacing:0}
.g-ok{color:#16a34a;margin-left:10px}.g-err{color:#dc2626;margin-left:8px}
.icon-cell{width:40px;text-align:center;font-weight:900}
.tr-ok .icon-cell{color:#16a34a}.tr-err .icon-cell{color:#dc2626}.tr-err td:not(.icon-cell){color:#b91c1c}
.err-row{background:#fff5f5}.err-msg{font-family:'Cascadia Code',monospace;font-size:11px;color:#b91c1c;padding:4px 14px !important}
/* Footer */
.footer{text-align:center;padding:24px 20px;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;margin-top:16px}
.footer strong{color:#475569}
@media print{
  body{background:#fff}
  .sticky-nav{display:none}
  .nivel-block,.suite,.bug-card,.tbl{box-shadow:none !important;border:1px solid #e2e8f0}
  .hdr,.nivel-hdr{print-color-adjust:exact;-webkit-print-color-adjust:exact}
}`;

// ─────────────────────────────────────────────────────────────────
// 8. HTML completo
// ─────────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>EduCampus — Informe de Pruebas Frontend</title>
<style>${CSS}</style>
</head>
<body>

<div class="hdr">
  <div class="hdr-inner">
    <div class="hdr-brand-row">
      <div class="hdr-logo">🎓</div>
      <div>
        <div class="hdr-brand">EduCampus</div>
        <div class="hdr-brand-sub">Sistema de Gestion Academica</div>
      </div>
    </div>
    <div class="hdr-divider"></div>
    <div class="hdr-title">Informe de Pruebas — Modulo Frontend (React + Vitest)</div>
    <div class="hdr-meta">
      <span>Fecha: ${execDate}</span>
      <span>Framework: Vitest + Testing Library</span>
      <span>Carpeta: src/tests/</span>
      <span>Resultado: ${passed}/${total} exitosas</span>
    </div>
  </div>
</div>

${navHtml()}

<div class="page">

  <div class="section" id="resumen">
    <div class="section-title">Resumen Ejecutivo</div>
    ${cards()}
  </div>

  <div class="section" id="modulos">
    <div class="section-title">Resumen por Modulo</div>
    ${moduleTable()}
  </div>

  <div class="section" id="bugs">
    <div class="section-title">Defecto Detectado y Corregido</div>
    ${bugSection()}
  </div>

  <div class="section" id="detalle">
    <div class="section-title">Detalle por Nivel de Prueba</div>
    ${sectionsHtml()}
  </div>

</div>

<div class="footer">
  <strong>EduCampus</strong> · Informe de Pruebas Frontend<br/>
  Generado el ${execDate}<br/>
  ${passed} de ${total} pruebas exitosas · Tasa de exito: ${passRate}%
</div>

</body>
</html>`;

writeFileSync(HTML_OUT, html, "utf-8");
console.log(`\nReporte generado -> test-report.html\n`);

try {
  if (process.platform === "win32") {
    execSync(`cmd /c start "" "${HTML_OUT}"`, { stdio: "ignore" });
  } else if (process.platform === "darwin") {
    execSync(`open "${HTML_OUT}"`, { stdio: "ignore" });
  } else {
    execSync(`xdg-open "${HTML_OUT}"`, { stdio: "ignore" });
  }
  console.log("   El reporte se abrio en el navegador.\n");
} catch {
  console.log(`   Abre manualmente: ${HTML_OUT}\n`);
}
