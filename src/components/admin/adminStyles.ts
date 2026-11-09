/** Shared Fauji Grid admin portal styles (dashboard + mock test manager). */
export const ADMIN_CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  .adm-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #0f172a;
    display: flex;
    flex-direction: column;
  }

  .adm-header {
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 30;
  }
  .adm-header-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .adm-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .adm-brand-title { font-size: 15px; font-weight: 800; letter-spacing: -0.02em; }
  .adm-brand-sub { font-size: 11px; color: #64748b; font-weight: 500; }

  .adm-header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .adm-pill-gold {
    display: inline-flex; align-items: center; gap: 5px;
    background: #fef3c7; color: #92400e; font-size: 10px; font-weight: 800;
    letter-spacing: 0.06em; text-transform: uppercase; padding: 5px 10px; border-radius: 6px;
  }
  .adm-user { font-size: 13px; color: #475569; font-weight: 600; }
  .adm-logout {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; color: #475569;
    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 8px 12px; cursor: pointer;
  }
  .adm-logout:hover { background: #f1f5f9; color: #0f172a; }

  .adm-toolbar {
    max-width: 1280px; margin: 0 auto; padding: 0 24px 12px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  }
  .adm-toolbar-title { font-size: 13px; font-weight: 700; color: #334155; }
  .adm-toolbar-actions { display: flex; flex-wrap: wrap; gap: 8px; }

  .adm-main { max-width: 1280px; margin: 0 auto; padding: 20px 24px 48px; width: 100%; flex: 1; }

  .adm-footer {
    border-top: 1px solid #e2e8f0; background: #fff; margin-top: auto;
  }
  .adm-footer-inner {
    max-width: 1280px; margin: 0 auto; padding: 14px 24px;
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px;
    font-size: 11px; color: #94a3b8;
  }
  .adm-footer-ok { display: inline-flex; align-items: center; gap: 6px; color: #15803d; font-weight: 600; }

  .adm-welcome {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
    padding: 22px 24px; margin-bottom: 22px;
    display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 20px;
    box-shadow: 0 1px 3px rgba(15,23,42,0.04);
  }
  .adm-welcome h2 { font-size: 1.35rem; font-weight: 800; margin: 0 0 6px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .adm-welcome p { margin: 0; font-size: 13px; color: #64748b; max-width: 520px; line-height: 1.5; }
  .adm-meta-row { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 12px; font-size: 12px; color: #64748b; }
  .adm-kpi-row { display: flex; flex-wrap: wrap; gap: 12px; }
  .adm-kpi {
    min-width: 120px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 12px 14px; text-align: right;
  }
  .adm-kpi-val { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
  .adm-kpi-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-top: 2px; }
  .adm-kpi-tag { font-size: 10px; font-weight: 700; color: #15803d; margin-top: 4px; }

  .adm-section-head {
    display: flex; align-items: center; gap: 10px; margin: 8px 0 14px;
    font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #64748b;
  }
  .adm-section-head::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, #e2e8f0, transparent); }

  .adm-mgmt-grid { display: grid; grid-template-columns: 1fr 280px; gap: 16px; margin-bottom: 28px; }
  @media (max-width: 900px) { .adm-mgmt-grid { grid-template-columns: 1fr; } }

  .adm-hero-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px;
    box-shadow: 0 1px 3px rgba(15,23,42,0.04);
  }
  .adm-hero-card h3 { margin: 0 0 8px; font-size: 1.05rem; font-weight: 800; }
  .adm-hero-card p { margin: 0 0 14px; font-size: 13px; color: #64748b; line-height: 1.55; }
  .adm-track-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .adm-track-pill {
    font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 6px;
    background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4;
  }
  .adm-hero-actions { display: flex; flex-wrap: wrap; gap: 10px; }

  .adm-side-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px;
  }
  .adm-side-card h4 { margin: 0 0 4px; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; }
  .adm-sync { font-size: 10px; font-weight: 700; color: #15803d; }
  .adm-side-total { font-size: 22px; font-weight: 800; margin: 10px 0; }
  .adm-side-list { list-style: none; margin: 0; padding: 0; font-size: 12px; color: #475569; }
  .adm-side-list li { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
  .adm-side-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 12px; font-size: 12px; font-weight: 700; color: #0f766e; text-decoration: none; }
  .adm-side-link:hover { text-decoration: underline; }

  .adm-sys-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  @media (max-width: 900px) { .adm-sys-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .adm-sys-grid { grid-template-columns: 1fr; } }
  .adm-sys-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;
  }
  .adm-sys-card h4 { margin: 8px 0 4px; font-size: 13px; font-weight: 800; }
  .adm-sys-card p { margin: 0 0 10px; font-size: 11px; color: #94a3b8; }
  .adm-sys-stat { font-size: 12px; font-weight: 700; color: #334155; }

  .btn { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; border-radius: 8px; padding: 8px 14px; cursor: pointer; border: none; transition: all 0.12s; white-space: nowrap; text-decoration: none; font-family: inherit; }
  .btn-primary { background: #0f172a; color: #fff; }
  .btn-primary:hover { background: #1e293b; }
  .btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
  .btn-teal { background: #0f766e; color: #fff; }
  .btn-teal:hover { background: #0d9488; }
  .btn-outline { background: #fff; color: #0f172a; border: 1px solid #cbd5e1; }
  .btn-outline:hover { border-color: #64748b; background: #f8fafc; }
  .btn-ghost { background: transparent; color: #475569; padding: 6px 10px; }
  .btn-ghost:hover { background: #f1f5f9; color: #0f172a; }
  .btn-danger { background: #fee2e2; color: #dc2626; }
  .btn-danger:hover { background: #fecaca; }
  .btn-sm { padding: 6px 11px; font-size: 12px; }

  .adm-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #64748b; background: none; border: none; cursor: pointer; padding: 6px 8px; border-radius: 6px; }
  .adm-back:hover { background: #f1f5f9; color: #0f172a; }

  .adm-toast { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; margin-bottom: 16px; }
  .adm-toast-success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .adm-toast-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .adm-toast-close { margin-left: auto; background: none; border: none; cursor: pointer; color: inherit; opacity: 0.6; padding: 2px; }

  .adm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
  @media (max-width: 768px) { .adm-stats { grid-template-columns: repeat(2, 1fr); } }
  .adm-stat { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; display: flex; align-items: center; gap: 12px; }
  .adm-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .adm-stat-val { font-size: 1.35rem; font-weight: 800; line-height: 1; margin-bottom: 3px; }
  .adm-stat-label { font-size: 11px; color: #94a3b8; font-weight: 600; }

  .adm-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  .adm-card-header { padding: 14px 18px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
  .adm-card-title { font-size: 14px; font-weight: 800; }

  .adm-filters { display: flex; gap: 10px; padding: 12px 18px; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap; }
  .adm-search-wrap { position: relative; flex: 1; min-width: 200px; }
  .adm-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94a3b8; width: 14px; height: 14px; }
  .adm-search { width: 100%; padding: 8px 10px 8px 32px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; outline: none; background: #f8fafc; }
  .adm-search:focus { border-color: #0f766e; background: #fff; }
  .adm-select-sm { padding: 8px 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; background: #f8fafc; outline: none; cursor: pointer; }
  .adm-result-count { padding: 8px 18px; font-size: 12px; color: #94a3b8; border-bottom: 1px solid #f8fafc; }

  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-table th { font-size: 10px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #94a3b8; padding: 10px 14px; text-align: left; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
  .adm-table td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
  .adm-table tbody tr:hover td { background: #f8fafc; }
  .adm-td-title { font-weight: 700; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .adm-td-sub { font-size: 11px; color: #94a3b8; margin-top: 1px; }

  .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; white-space: nowrap; }
  .badge-outline { border: 1px solid #e2e8f0; color: #475569; background: #fff; }
  .badge-green { background: #f0fdf4; color: #15803d; }
  .badge-gray { background: #f1f5f9; color: #64748b; }
  .badge-blue { background: #eff6ff; color: #1d4ed8; }
  .badge-purple { background: #faf5ff; color: #7c3aed; }
  .badge-orange { background: #fff7ed; color: #c2410c; }
  .badge-cyan { background: #ecfeff; color: #0e7490; }
  .badge-yellow { background: #fefce8; color: #a16207; }
  .badge-red { background: #fef2f2; color: #dc2626; }
  .badge-teal { background: #f0fdfa; color: #0f766e; }

  .adm-empty { text-align: center; padding: 48px 24px; color: #94a3b8; }
  .adm-empty-title { font-size: 14px; font-weight: 700; color: #475569; margin-bottom: 6px; }
  .adm-empty-sub { font-size: 13px; }
  .adm-loading { padding: 40px; text-align: center; font-size: 13px; color: #94a3b8; }

  .adm-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .adm-modal { background: #fff; border-radius: 14px; width: 100%; max-height: 92vh; overflow-y: auto; display: flex; flex-direction: column; box-shadow: 0 24px 48px rgba(15,23,42,0.18); }
  .adm-modal-sm { max-width: 720px; }
  .adm-modal-lg { max-width: 900px; }
  .adm-modal-header { padding: 18px 22px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .adm-modal-title { font-size: 17px; font-weight: 800; margin-bottom: 4px; }
  .adm-modal-sub { font-size: 12px; color: #94a3b8; line-height: 1.5; }
  .adm-modal-close { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 4px; border-radius: 6px; }
  .adm-modal-close:hover { color: #0f172a; background: #f1f5f9; }
  .adm-modal-body { padding: 20px 22px; flex: 1; overflow-y: auto; }
  .adm-modal-footer { padding: 14px 22px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }

  .adm-format-note {
    font-size: 12px; line-height: 1.55; color: #475569; background: #f0fdfa;
    border: 1px solid #99f6e4; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;
  }

  .adm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .adm-form-full { grid-column: 1 / -1; }
  .adm-field { display: flex; flex-direction: column; gap: 5px; }
  .adm-label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.04em; }
  .adm-input, .adm-textarea, .adm-native-select {
    padding: 8px 11px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; outline: none; background: #fff; width: 100%; font-family: inherit;
  }
  .adm-input:focus, .adm-textarea:focus, .adm-native-select:focus { border-color: #0f766e; box-shadow: 0 0 0 2px rgba(15,118,110,0.15); }
  .adm-textarea { resize: vertical; min-height: 72px; }

  .adm-dropzone {
    border: 2px dashed #cbd5e1; border-radius: 10px; padding: 28px 16px; text-align: center; cursor: pointer; transition: all 0.15s; background: #fafafa;
  }
  .adm-dropzone:hover { border-color: #0f766e; background: #f0fdfa; }
  .adm-dropzone-active { border-color: #0f766e; background: #ecfdf5; }
  .adm-dropzone-done { border-color: #15803d; background: #f0fdf4; border-style: solid; }
  .adm-dropzone-title { font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 4px; }
  .adm-dropzone-sub { font-size: 12px; color: #94a3b8; margin-bottom: 10px; }

  .adm-import-bundle { margin-top: 14px; }
  .adm-import-steps { display: grid; grid-template-columns: 1fr; gap: 12px; }
  .adm-import-asset { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; background: #fafafa; }
  .adm-import-asset-title { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; margin-bottom: 6px; }
  .adm-import-asset-help { font-size: 11px; line-height: 1.5; color: #64748b; margin-bottom: 10px; }
  .adm-image-files { font-size: 11px; color: #0f766e; line-height: 1.6; overflow-wrap: anywhere; max-height: 80px; overflow: auto; }

  .adm-preview { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
  .adm-preview-item { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; }
  .adm-preview-item:last-child { border-bottom: none; }
  .adm-preview-q { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
  .adm-preview-opts { display: flex; flex-wrap: wrap; gap: 6px; }
  .adm-preview-image { display: block; max-width: 100%; max-height: 160px; object-fit: contain; margin: 8px 0; border-radius: 6px; border: 1px solid #e2e8f0; }
  .adm-preview-more { padding: 10px; text-align: center; font-size: 12px; color: #94a3b8; background: #f8fafc; }
  .adm-requirement-note { font-size: 12px; color: #b45309; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 12px; margin-top: 12px; }

  .adm-divider { border: none; border-top: 1px solid #f1f5f9; margin: 18px 0; }
  .adm-q-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .adm-q-title { font-size: 13px; font-weight: 800; }
  .adm-q-item { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 10px; background: #fafafa; }
  .adm-q-item-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .adm-q-num { font-size: 10px; font-weight: 800; color: #64748b; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; }
  .adm-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0; }
  @media (max-width: 560px) { .adm-options-grid { grid-template-columns: 1fr; } }
  .adm-option-row { display: flex; align-items: center; gap: 8px; }
  .adm-option-letter { width: 22px; height: 22px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }

  .adm-del-confirm { display: flex; align-items: center; gap: 6px; }
  .adm-del-confirm span { font-size: 12px; color: #dc2626; font-weight: 600; }

  .adm-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; width: 100%; }
  .adm-toggle-label { font-size: 13px; font-weight: 600; }
  .adm-toggle { position: relative; display: inline-block; width: 36px; height: 20px; }
  .adm-toggle input { opacity: 0; width: 0; height: 0; }
  .adm-toggle-slider { position: absolute; cursor: pointer; inset: 0; background: #cbd5e1; border-radius: 20px; transition: 0.2s; }
  .adm-toggle-slider::before { content: ''; position: absolute; height: 14px; width: 14px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.2s; }
  .adm-toggle input:checked + .adm-toggle-slider { background: #0f766e; }
  .adm-toggle input:checked + .adm-toggle-slider::before { transform: translateX(16px); }

  .adm-upload-progress { font-size: 12px; color: #0f766e; font-weight: 600; margin-top: 8px; }
`;
