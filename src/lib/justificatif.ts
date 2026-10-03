export function downloadJustificatif(data: {
  type: string;
  amount: number;
  currency: string;
  sourceLabel: string;
  sourceIban: string;
  beneficiaryName: string;
  beneficiaryIban: string;
  motif?: string;
  date?: string;
  frequency?: string;
}) {
  const ref = `VIR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const dateStr = data.date || new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const amountFmt = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.amount);

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Justificatif de virement — ${ref}</title>
<style>
@media print{body{margin:0;padding:0}.no-print{display:none!important}.receipt{box-shadow:none!important}}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f5f5f5;color:#333;padding:20px}
.receipt{max-width:700px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1);overflow:hidden}
.hdr{background:linear-gradient(135deg,#001f42,#003d82);color:#fff;padding:30px;display:flex;align-items:center;justify-content:space-between}
.hdr h1{font-size:22px;font-weight:700}
.hdr .bn{font-size:14px;opacity:.8;margin-top:4px}
.hdr .ref{text-align:right;font-size:12px;opacity:.7}
.hdr .ref strong{display:block;font-size:14px;opacity:1}
.sb{background:#e8f5e9;padding:12px 30px;display:flex;align-items:center;gap:8px;border-bottom:1px solid #c8e6c9}
.sb .dot{width:8px;height:8px;border-radius:50%;background:#2e7d32}
.sb span{color:#2e7d32;font-weight:600;font-size:14px}
.bd{padding:30px}
.sec{margin-bottom:24px}
.sec:last-child{margin-bottom:0}
.st{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:12px;font-weight:600}
.rw{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0}
.rw:last-child{border-bottom:none}
.rw .lb{color:#666;font-size:13px}
.rw .vl{font-weight:600;font-size:13px;text-align:right;max-width:60%;word-break:break-all}
.rw .mn{font-family:'SF Mono',Monaco,'Cascadia Code',monospace;font-size:12px;letter-spacing:.5px}
.ab{background:#f8f9fa;border-radius:8px;padding:20px;text-align:center;margin:20px 0}
.ab .am{font-size:28px;font-weight:700;color:#001f42}
.ab .cu{font-size:16px;color:#666;margin-left:4px}
.ft{padding:20px 30px;background:#fafafa;border-top:1px solid #eee;font-size:11px;color:#999;line-height:1.6;text-align:center}
.pb{display:block;margin:20px auto;padding:12px 32px;background:#003d82;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer}
.pb:hover{background:#002a5c}
</style>
</head>
<body>
<div class="receipt">
<div class="hdr">
<div><h1>Justificatif de virement</h1><div class="bn">CaixaBank Luxembourg S.A.</div></div>
<div class="ref">Référence<br><strong>${ref}</strong></div>
</div>
<div class="sb"><div class="dot"></div><span>Opération exécutée</span></div>
<div class="bd">
<div class="sec">
<div class="st">Détails de l'opération</div>
<div class="rw"><span class="lb">Type</span><span class="vl">${esc(data.type)}</span></div>
<div class="rw"><span class="lb">Date</span><span class="vl">${esc(dateStr)}</span></div>
<div class="rw"><span class="lb">Heure</span><span class="vl">${timeStr}</span></div>
${data.frequency ? `<div class="rw"><span class="lb">Fréquence</span><span class="vl">${esc(data.frequency)}</span></div>` : ""}
${data.motif ? `<div class="rw"><span class="lb">Motif</span><span class="vl">${esc(data.motif)}</span></div>` : ""}
</div>
<div class="ab"><span class="am">${amountFmt}</span><span class="cu">${esc(data.currency)}</span></div>
<div class="sec">
<div class="st">Compte émetteur</div>
<div class="rw"><span class="lb">Intitulé</span><span class="vl">${esc(data.sourceLabel)}</span></div>
<div class="rw"><span class="lb">IBAN</span><span class="vl mn">${esc(data.sourceIban)}</span></div>
</div>
<div class="sec">
<div class="st">Bénéficiaire</div>
<div class="rw"><span class="lb">Nom</span><span class="vl">${esc(data.beneficiaryName)}</span></div>
<div class="rw"><span class="lb">IBAN</span><span class="vl mn">${esc(data.beneficiaryIban)}</span></div>
</div>
</div>
<div class="ft">
CaixaBank Luxembourg S.A. — Établissement de crédit agréé par la CSSF<br>
14, Boulevard Royal — L-2449 Luxembourg<br>
Ce document constitue un justificatif de virement. Référence : ${ref}
</div>
</div>
<button class="pb no-print" onclick="window.print()">Imprimer / Enregistrer en PDF</button>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
