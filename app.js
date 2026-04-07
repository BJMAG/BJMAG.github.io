// ── app.js ──────────────────────────────────────────────────
// Conexión entre veterinaria.html y el backend Node/MySQL
// ────────────────────────────────────────────────────────────

const API = 'http://localhost:3000';

// Convierte la fila de MySQL al formato que usa el HTML (D.consultas)
const mapConsulta = r => ({
  id:  r.id,
  pac: r.paciente_id,
  fec: r.fecha,
  mot: r.motivo,
  dia: r.diagnostico,
  tra: r.tratamiento,
  vet: r.veterinario,
  cos: Number(r.costo_total),
  pag: Number(r.monto_pagado),
  mp:  r.metodo_pago,
  prx: r.proxima_cita
});

// Carga consultas desde MySQL al arrancar
async function cargarConsultas() {
  try {
    const rows = await fetch(`${API}/consultas`).then(r => r.json());
    D.consultas = rows.map(mapConsulta);
    renderAll();
  } catch (e) {
    console.warn('Backend no disponible, usando datos locales');
  }
}

// Reemplaza guarCon() que está en el HTML
async function guarCon() {
  const cos = parseFloat(_('k-c').value) || 0;
  const ab  = Math.min(parseFloat(_('k-a').value) || 0, cos);

  const payload = {
    paciente_id:  parseInt(_('k-p').value),
    fecha:        _('k-f').value,
    motivo:       _('k-m').value,
    diagnostico:  _('k-d').value,
    tratamiento:  _('k-t').value,
    veterinario:  _('k-v').value,
    costo_total:  cos,
    monto_pagado: ab,
    metodo_pago:  _('k-pg').value,
    proxima_cita: _('k-x').value || null
  };

  try {
    const res = await fetch(`${API}/consultas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(await res.text());
    const { id } = await res.json();

    // Agregar al array local con el id que devolvió MySQL
    D.consultas.push({ ...mapConsulta({ ...payload, id, monto_pagado: ab, costo_total: cos }) });

    cerrar('mCon');
    saveData();
    renderAll();
    toast('✓ Consulta guardada en base de datos');

  } catch (e) {
    console.error('Error guardando consulta:', e);
    // Fallback: guarda solo local si el servidor no responde
    D.consultas.push({
      id: IDS.k++,
      pac: parseInt(_('k-p').value),
      fec: _('k-f').value, mot: _('k-m').value,
      dia: _('k-d').value, tra: _('k-t').value,
      vet: _('k-v').value, cos, pag: ab,
      mp: _('k-pg').value, prx: _('k-x').value
    });
    cerrar('mCon');
    saveData();
    renderAll();
    toast('⚠ Guardado local (sin conexión al servidor)', 'var(--shop)');
  }
}

// Arranca cargando datos reales desde MySQL
cargarConsultas();
