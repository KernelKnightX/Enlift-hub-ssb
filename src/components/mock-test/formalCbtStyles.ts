/** NTA / formal CBT-style theme for in-exam UI (shared across NDA, CDS, AFCAT). */
export const formalCbtStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #1a1a1a; --ink-2: #374151; --ink-3: #6b7280;
    --paper: #eef2f7; --paper-2: #e5e7eb; --paper-3: #d1d5db;
    --portal: #0b3d91; --portal-dark: #062a66;
    --action: #c2410c; --action-hover: #ea580c;
    --success: #15803d; --warn: #d97706;
    --radius: 4px; --shadow: 0 1px 3px rgba(0,0,0,.08);
  }
  body { font-family: 'Source Sans 3', system-ui, sans-serif; background: var(--paper); color: var(--ink); }

  .ex-wrap { display: flex; flex-direction: column; height: 100vh; background: var(--paper); overflow: hidden; }
  .ex-subbar {
    background: #fff; border-bottom: 1px solid var(--paper-3); padding: 6px 16px;
    font-size: .72rem; color: var(--ink-3); display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: space-between;
  }
  .ex-subbar strong { color: var(--ink-2); font-weight: 600; }
  .ex-save-status.saved { color: #15803d; }
  .ex-save-status.saving { color: #a16207; }
  .ex-save-status.error { color: #b91c1c; }

  .ex-topbar {
    background: linear-gradient(180deg, var(--portal) 0%, var(--portal-dark) 100%);
    padding: 0 16px; min-height: 52px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    position: sticky; top: 0; z-index: 50; flex-wrap: wrap;
  }
  .ex-topbar-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .ex-brand { font-size: .68rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: rgba(255,255,255,.75); }
  .ex-back-btn {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.25); border-radius: var(--radius);
    color: #fff; font-size: .72rem; font-weight: 600;
    padding: 5px 10px; cursor: pointer; font-family: inherit;
  }
  .ex-back-btn:hover { background: rgba(255,255,255,.2); }
  .ex-exam-title { font-size: .88rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
  .ex-exam-sub { font-size: .65rem; color: rgba(255,255,255,.65); margin-top: 1px; }
  .ex-topbar-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .ex-timer {
    display: flex; align-items: center; gap: 6px;
    background: #fff; border-radius: var(--radius); padding: 6px 12px;
    font-weight: 700; color: var(--portal-dark); font-size: .9rem; font-variant-numeric: tabular-nums;
    border: 2px solid #fde68a;
  }
  .ex-timer.urgent { border-color: #fecaca; color: #b91c1c; background: #fef2f2; }
  .ex-submit-top {
    background: var(--action); color: #fff; border: none; border-radius: var(--radius);
    padding: 8px 16px; font-size: .78rem; font-weight: 700; cursor: pointer; font-family: inherit;
  }
  .ex-submit-top:hover { background: var(--action-hover); }

  .ex-body { flex: 1; display: flex; overflow: hidden; flex-direction: row; }
  .ex-q-panel { flex: 1; overflow-y: auto; padding: 12px; min-width: 0; }
  .ex-q-card { background: white; border-radius: var(--radius); border: 1px solid var(--paper-3); box-shadow: var(--shadow); }
  .ex-q-head {
    padding: 10px 14px; border-bottom: 1px solid var(--paper-2);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
    background: #f9fafb;
  }
  .ex-q-num { font-size: .72rem; font-weight: 700; color: var(--portal); text-transform: uppercase; }
  .ex-q-subj { font-size: .68rem; font-weight: 600; padding: 2px 8px; border-radius: var(--radius); background: var(--paper); color: var(--ink-2); border: 1px solid var(--paper-3); }
  .ex-flag-btn {
    font-size: .72rem; font-weight: 600; color: var(--ink-3);
    background: #fff; border: 1px solid var(--paper-3); border-radius: var(--radius);
    padding: 4px 10px; cursor: pointer; font-family: inherit;
  }
  .ex-flag-btn.flagged { border-color: var(--warn); color: #92400e; background: #fffbeb; }
  .ex-q-body { padding: 16px 14px; }
  .ex-q-text { font-size: .95rem; color: var(--ink); line-height: 1.65; font-weight: 500; margin-bottom: 18px; white-space: pre-line; }
  .ex-options { display: flex; flex-direction: column; gap: 8px; }
  .ex-option {
    display: flex; align-items: center; gap: 12px;
    background: #fff; border: 1px solid var(--paper-3); border-radius: var(--radius);
    padding: 11px 14px; cursor: pointer; text-align: left; width: 100%; font-family: inherit; transition: border-color .12s, background .12s;
  }
  .ex-option:hover:not(.selected) { border-color: var(--paper-3); background: #f9fafb; }
  .ex-option:focus-visible { outline: 2px solid var(--portal); outline-offset: 2px; }
  .ex-option.selected { border-color: var(--portal); background: #eff6ff; }
  .ex-opt-letter {
    width: 28px; height: 28px; border-radius: var(--radius); border: 1px solid var(--paper-3);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: .75rem; color: var(--ink-3); flex-shrink: 0;
  }
  .ex-option.selected .ex-opt-letter { border-color: var(--portal); background: var(--portal); color: #fff; }
  .ex-opt-text { font-size: .86rem; color: var(--ink-2); }
  .ex-q-foot {
    padding: 12px 14px; border-top: 1px solid var(--paper-2);
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
  }
  .ex-nav-btn {
    font-size: .78rem; font-weight: 600; color: var(--ink-2);
    background: #fff; border: 1px solid var(--paper-3); border-radius: var(--radius);
    padding: 8px 14px; cursor: pointer; font-family: inherit;
  }
  .ex-nav-btn:hover:not(:disabled) { border-color: var(--portal); color: var(--portal); }
  .ex-nav-btn:disabled { opacity: .4; cursor: not-allowed; }
  .ex-clear-btn { font-size: .75rem; font-weight: 600; color: var(--ink-3); background: none; border: none; cursor: pointer; text-decoration: underline; font-family: inherit; }

  .ex-palette {
    width: 260px; background: #fff; border-left: 1px solid var(--paper-3);
    padding: 14px; overflow-y: auto; flex-shrink: 0;
  }
  .ex-palette-title { font-size: .82rem; font-weight: 700; color: var(--portal-dark); margin-bottom: 10px; border-bottom: 2px solid var(--portal); padding-bottom: 6px; }
  .ex-palette-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 14px; }
  .ex-p-btn {
    width: 100%; aspect-ratio: 1; max-height: 38px; border-radius: var(--radius); border: 1px solid var(--paper-3);
    background: #fff; font-size: .72rem; font-weight: 700; color: var(--ink-3); cursor: pointer;
  }
  .ex-p-btn.answered { background: var(--success); border-color: var(--success); color: #fff; }
  .ex-p-btn.marked { background: var(--warn); border-color: var(--warn); color: #fff; }
  .ex-p-btn.current { box-shadow: 0 0 0 2px var(--portal); }
  .ex-legend { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; font-size: .68rem; color: var(--ink-3); }
  .ex-legend-item { display: flex; align-items: center; gap: 6px; }
  .ex-legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
  .ex-palette-submit {
    width: 100%; background: var(--portal); color: #fff; border: none; border-radius: var(--radius);
    padding: 10px; font-size: .82rem; font-weight: 700; cursor: pointer; font-family: inherit;
  }
  .ex-palette-submit:hover { background: var(--portal-dark); }

  @media (max-width: 900px) {
    .ex-body { flex-direction: column; }
    .ex-palette { width: 100%; border-left: none; border-top: 1px solid var(--paper-3); max-height: 220px; }
    .ex-exam-title { max-width: 140px; }
  }

  @media (max-width: 600px) {
    .ex-wrap { height: auto; min-height: 100vh; min-height: 100dvh; overflow: visible; }
    .ex-subbar { justify-content: flex-start; gap: 4px 12px; padding: 6px 10px; font-size: .68rem; }
    .ex-topbar { padding: 8px 10px; gap: 8px; flex-wrap: nowrap; }
    .ex-topbar-left { gap: 7px; flex: 1 1 auto; }
    .ex-topbar-right { width: auto; justify-content: flex-end; gap: 6px; }
    .ex-brand { display: none; }
    .ex-exam-title { max-width: min(34vw, 180px); font-size: .8rem; }
    .ex-exam-sub { font-size: .62rem; }
    .ex-timer { padding: 5px 7px; font-size: .78rem; }
    .ex-submit-top { padding: 7px 9px; font-size: .7rem; white-space: nowrap; }
    .ex-body { flex: none; overflow: visible; }
    .ex-q-panel { flex: none; overflow: visible; padding: 8px; }
    .ex-q-head { padding: 9px 10px; }
    .ex-q-body { padding: 13px 10px; }
    .ex-q-text { font-size: 1rem; line-height: 1.55; }
    .ex-option { min-height: 48px; padding: 9px 10px; }
    .ex-q-foot { padding: 10px; }
    .ex-nav-btn { min-height: 42px; padding: 8px 10px; }
    .ex-palette { max-height: none; overflow: visible; padding: 12px 10px; }
    .ex-palette-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 7px; }
    .ex-p-btn { min-height: 38px; aspect-ratio: auto; }
    .ex-legend { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .ex-palette-submit { min-height: 44px; }
  }

  .ex-center { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 12px; padding: 24px; }
  .ex-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid var(--paper-3); border-top-color: var(--portal); animation: exSpin .75s linear infinite; }
  @keyframes exSpin { to { transform: rotate(360deg); } }
  .ex-center-title { font-size: 1rem; font-weight: 700; color: var(--ink); }
  .ex-center-sub { font-size: .82rem; color: var(--ink-3); text-align: center; }
  .ex-err-btn { background: var(--portal); color: #fff; border: none; border-radius: var(--radius); padding: 10px 18px; font-weight: 700; cursor: pointer; font-family: inherit; }

  .res-wrap { min-height: 100vh; background: var(--paper); padding: 24px 16px; display: flex; align-items: center; justify-content: center; }
  .res-card { background: white; border: 1px solid var(--paper-3); max-width: 560px; width: 100%; overflow: hidden; border-radius: var(--radius); }
  .res-head { background: linear-gradient(180deg, var(--portal), var(--portal-dark)); padding: 28px; text-align: center; color: #fff; }
  .res-score { font-size: 2.8rem; font-weight: 700; line-height: 1; }
  .res-score-lbl { font-size: .68rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; opacity: .85; }
  .res-title { font-size: 1rem; font-weight: 700; margin-top: 8px; }
  .res-sub { font-size: .78rem; opacity: .8; margin-top: 4px; }
  .res-body { padding: 20px; }
  .res-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
  .res-stat { border-radius: var(--radius); padding: 12px; text-align: center; font-size: .65rem; font-weight: 700; text-transform: uppercase; }
  .res-stat-val { font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; }
  .res-stat-correct { background: #dcfce7; color: #166534; }
  .res-stat-wrong { background: #fee2e2; color: #991b1b; }
  .res-stat-skip { background: var(--paper); color: var(--ink-3); }
  .res-raw { background: #f9fafb; border: 1px solid var(--paper-2); border-radius: var(--radius); padding: 12px; margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: .8rem; }
  .res-btns { display: flex; flex-direction: column; gap: 8px; }
  @media (min-width: 480px) { .res-btns { flex-direction: row; } }
  .res-btn { flex: 1; border-radius: var(--radius); padding: 11px; font-size: .82rem; font-weight: 700; cursor: pointer; font-family: inherit; border: none; }
  .res-btn-primary { background: var(--portal); color: #fff; }
  .res-btn-outline { background: #fff; color: var(--ink); border: 1px solid var(--paper-3) !important; }

  .rev-wrap { min-height: 100vh; background: #f4f6fb; padding: 0 0 68px; color: #111827; }
  .rev-shell { width: 100%; }
  .rev-topbar { min-height: 40px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 6px 18px; background: #111827; color: #e5e7eb; font-size: .68rem; }
  .rev-brand, .rev-topbar-meta { display: flex; align-items: center; gap: 14px; min-width: 0; }
  .rev-brand span { color: #cbd5e1; white-space: nowrap; }
  .rev-brand strong { color: #93c5fd; white-space: nowrap; }
  .rev-topbar-meta span { white-space: nowrap; }
  .rev-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 18px; background: #fff; border-bottom: 1px solid #dbe2ec; flex-wrap: wrap; }
  .rev-toolbar-title { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .rev-toolbar-title h1 { margin: 0; font-size: .9rem; font-weight: 700; color: #111827; }
  .rev-toolbar-title > span { border: 1px solid #bfdbfe; border-radius: 4px; background: #eff6ff; color: #1d4ed8; padding: 3px 8px; font-size: .65rem; white-space: nowrap; }
  .rev-filter-list { display: flex; align-items: center; gap: 2px; border: 1px solid #dbe2ec; border-radius: 6px; padding: 3px; background: #f8fafc; }
  .rev-filter { border: 0; border-radius: 4px; background: transparent; color: #475569; padding: 5px 8px; font: inherit; font-size: .68rem; white-space: nowrap; cursor: pointer; }
  .rev-filter.active { background: #dbeafe; color: #1d4ed8; font-weight: 700; }
  .rev-filter:disabled { opacity: .4; cursor: not-allowed; }
  .rev-current-meta { display: flex; align-items: center; gap: 6px; font-size: .65rem; color: #475569; }
  .rev-current-meta span { border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 7px; white-space: nowrap; }
  .rev-content { display: grid; grid-template-columns: minmax(0, 1fr) 245px; align-items: start; gap: 16px; max-width: 1440px; margin: 0 auto; padding: 16px 18px; }
  .rev-main-column { min-width: 0; }
  .rev-card { background: white; border: 1px solid #dbe2ec; margin-bottom: 12px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(15,23,42,.04); }
  .rev-card-head { min-height: 42px; padding: 9px 14px; background: #fff; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .rev-q-label { border-radius: 4px; padding: 4px 8px; background: #1e293b; color: white; font-size: .65rem; font-weight: 700; }
  .rev-topic { color: #64748b; font-size: .68rem; }
  .rev-badge { font-size: .65rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius); }
  .rev-badge-correct { background: #dcfce7; color: #166534; }
  .rev-badge-wrong { background: #fee2e2; color: #991b1b; }
  .rev-badge-skip { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
  .rev-card-body { padding: 16px 18px; }
  .rev-q-text { font-size: .92rem; font-weight: 500; margin-bottom: 14px; line-height: 1.6; white-space: pre-line; }
  .rev-outcome { margin: 0 0 12px; border-radius: 5px; padding: 8px 10px; font-size: .75rem; line-height: 1.5; }
  .rev-outcome-skip { border: 1px solid #fde68a; background: #fffbeb; color: #92400e; }
  .rev-outcome-wrong { border: 1px solid #fecaca; background: #fef2f2; color: #991b1b; }
  .rev-options { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
  .rev-option { display: flex; align-items: center; gap: 10px; min-height: 43px; border-radius: 6px; padding: 8px 11px; font-size: .8rem; border: 1px solid transparent; }
  .rev-opt-letter { display: flex; width: 23px; height: 23px; flex: 0 0 23px; align-items: center; justify-content: center; border: 1px solid #cbd5e1; border-radius: 4px; background: #f8fafc; color: #334155; font-size: .66rem; font-weight: 700; }
  .rev-opt-text { min-width: 0; white-space: pre-line; }
  .rev-option-tag { margin-left: auto; flex-shrink: 0; font-size: .64rem; font-weight: 700; }
  .rev-option-neutral { background: #fff; border-color: #dbe2ec; }
  .rev-option-correct { background: #f0fdf8; border-color: #10b981; color: #065f46; }
  .rev-option-correct .rev-opt-letter { border-color: #059669; background: #059669; color: #fff; }
  .rev-option-wrong { background: #fff7f7; border-color: #fca5a5; color: #991b1b; }
  .rev-option-wrong .rev-opt-letter { border-color: #dc2626; background: #dc2626; color: #fff; }
  .rev-expl { overflow: hidden; border: 1px solid #bfdbfe; border-radius: 7px; background: #f5f8ff; }
  .rev-expl-heading { padding: 10px 13px; border-bottom: 1px solid #cfe0ff; background: #eaf1ff; color: #1e3a8a; font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
  .rev-expl-text { padding: 13px; color: #334155; font-size: .78rem; line-height: 1.65; white-space: pre-line; }
  .rev-nav { position: sticky; bottom: 0; z-index: 5; display: flex; justify-content: space-between; gap: 8px; margin-top: 10px; padding: 9px 10px; border: 1px solid #dbe2ec; border-radius: 7px; background: rgba(255,255,255,.96); box-shadow: 0 -3px 12px rgba(15,23,42,.06); }
  .rev-nav-btn { font-size: .75rem; font-weight: 600; padding: 8px 14px; border: 1px solid var(--paper-3); border-radius: 5px; background: #fff; color: #1e293b; cursor: pointer; font-family: inherit; }
  .rev-nav-btn:disabled { opacity: .4; cursor: not-allowed; }
  .rev-back-results { background: #111827; color: #fff; border-color: #111827; }
  .rev-palette { position: sticky; top: 12px; max-height: calc(100vh - 24px); overflow: auto; border: 1px solid #dbe2ec; border-radius: 8px; background: #fff; }
  .rev-palette-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px; border-bottom: 1px solid #e2e8f0; }
  .rev-palette-heading > div { display: flex; flex-direction: column; gap: 3px; }
  .rev-palette-heading strong { font-size: .8rem; }
  .rev-palette-heading span { color: #64748b; font-size: .65rem; }
  .rev-palette-heading b { padding: 4px 6px; border-radius: 4px; background: #f1f5f9; color: #475569; font-size: .62rem; }
  .rev-palette-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
  .rev-palette-legend span { display: flex; align-items: center; gap: 5px; color: #475569; font-size: .63rem; }
  .rev-palette-legend i { width: 9px; height: 9px; border: 1px solid #cbd5e1; border-radius: 2px; background: #fff; }
  .rev-palette-legend i.correct { border-color: #10b981; background: #10b981; }
  .rev-palette-legend i.wrong { border-color: #f87171; background: #fecaca; }
  .rev-palette-legend i.skipped { border-color: #fbbf24; background: #fef3c7; }
  .rev-palette-legend i.current { border: 2px solid #2563eb; }
  .rev-palette-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; padding: 10px; }
  .rev-palette-btn { aspect-ratio: 1; min-width: 0; border: 1px solid #dbe2ec; border-radius: 4px; background: #f8fafc; color: #334155; font: inherit; font-size: .63rem; cursor: pointer; }
  .rev-palette-btn.correct { border-color: #6ee7b7; background: #d1fae5; color: #065f46; }
  .rev-palette-btn.wrong { border-color: #fda4af; background: #ffe4e6; color: #9f1239; }
  .rev-palette-btn.skipped { border-color: #fcd34d; background: #fef3c7; color: #92400e; }
  .rev-palette-btn.current { outline: 2px solid #2563eb; outline-offset: 1px; z-index: 1; }
  .rev-palette-help { padding: 0 12px 12px; color: #64748b; font-size: .63rem; line-height: 1.45; text-align: center; }

  @media (max-width: 900px) {
    .rev-content { grid-template-columns: minmax(0, 1fr) 210px; gap: 10px; padding: 12px; }
    .rev-topbar { padding-inline: 12px; }
    .rev-brand, .rev-topbar-meta { gap: 8px; }
  }
  @media (max-width: 700px) {
    .rev-wrap { padding-bottom: 76px; }
    .rev-topbar { align-items: flex-start; flex-direction: column; gap: 4px; padding: 7px 10px; }
    .rev-brand { max-width: 100%; overflow-x: auto; }
    .rev-brand span:nth-of-type(n+3) { display: none; }
    .rev-topbar-meta { font-size: .62rem; }
    .rev-toolbar { align-items: flex-start; padding: 10px; }
    .rev-toolbar-title { width: 100%; align-items: flex-start; flex-direction: column; gap: 4px; }
    .rev-toolbar-title h1 { font-size: .88rem; }
    .rev-filter-list { max-width: 100%; overflow-x: auto; }
    .rev-current-meta { width: 100%; flex-wrap: wrap; }
    .rev-content { grid-template-columns: minmax(0, 1fr); padding: 10px; }
    .rev-palette { position: static; max-height: none; order: 2; }
    .rev-palette-grid { grid-template-columns: repeat(8, minmax(0, 1fr)); }
    .rev-card-body { padding: 12px; }
    .rev-q-text { font-size: .87rem; }
    .rev-option { align-items: flex-start; }
    .rev-option-tag { font-size: .58rem; }
    .rev-nav { position: fixed; right: 0; bottom: 0; left: 0; margin: 0; padding: 8px 10px calc(8px + env(safe-area-inset-bottom)); border-radius: 0; }
    .rev-nav-btn { padding: 9px 10px; }
  }

  .ex-lock-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--paper); }
  .ex-lock-card { max-width: 420px; width: 100%; background: #fff; border: 1px solid var(--paper-3); border-radius: var(--radius); padding: 24px; text-align: center; }
  .ex-lock-card h2 { font-size: 1.1rem; color: var(--portal-dark); margin-bottom: 8px; }
  .ex-lock-card p { font-size: .85rem; color: var(--ink-3); margin-bottom: 16px; line-height: 1.5; }
  .ex-candidate-card { max-width: 480px; padding: 28px; border-color: #dbe2ec; border-radius: 12px; box-shadow: 0 18px 50px rgba(15,23,42,.14); }
  .ex-candidate-kicker { margin-bottom: 8px; color: var(--portal); font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .ex-candidate-card h2 { color: #111827; font-size: 1.35rem; }
  .ex-candidate-card > p { color: #64748b; }
  .ex-candidate-form { display: flex; flex-direction: column; gap: 8px; text-align: left; }
  .ex-candidate-form label { color: #334155; font-size: .76rem; font-weight: 700; }
  .ex-candidate-form input { width: 100%; min-height: 44px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; background: #fff; color: #111827; font: inherit; font-size: .9rem; }
  .ex-candidate-form input:focus { outline: 2px solid #93c5fd; border-color: var(--portal); }
  .ex-candidate-form small { margin: 0 0 8px; color: #64748b; font-size: .7rem; line-height: 1.4; }
  .ex-candidate-form .ex-err-btn { width: 100%; margin-top: 4px; }
  .ex-err-btn:disabled { opacity: .55; cursor: wait; }
  .ex-candidate-error { margin: 0 0 12px; border: 1px solid #fecaca; border-radius: 6px; padding: 9px 10px; background: #fef2f2; color: #991b1b; font-size: .76rem; text-align: left; }
  .ex-candidate-sent { margin: 0 0 4px !important; font-size: .78rem !important; }
  .ex-candidate-link, .ex-candidate-cancel { border: 0; padding: 8px; background: transparent; color: var(--portal); font: inherit; font-size: .75rem; font-weight: 700; cursor: pointer; }
  .ex-candidate-cancel { margin-top: 12px; color: #64748b; }
  @media (max-width: 600px) {
    .ex-lock-wrap { min-height: 100dvh; padding: 16px; }
    .ex-candidate-card { padding: 22px 18px; }
  }
`;
