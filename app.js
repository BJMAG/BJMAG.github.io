const API = 'http://localhost:3000';

const mapConsulta = r => ({
  id:  r.id,
  pac: r.paciente_id,
  fec: r.fecha ? r.fecha.split('T')[0] : '',  // quita el T05:00:00.000Z
  mot: r.motivo,
  dia: r.diagnostico,
  tra: r.tratamiento,
  vet: r.veterinario,
  cos: Number(r.costo_total),
  pag: Number(r.monto_pagado),
  mp:  r.metodo_pago,
  prx: r.proxima_cita ? r.proxima_cita.split('T')[0] : ''
});

async function cargarConsultas() {
  try {
    const rows = await fetch(`${API}/consultas`).then(r => r.json());
    D.consultas = rows.map(mapConsulta);
    renderAll();
    console.log('✓ Consultas cargadas desde MySQL:', D.consultas.length);
  } catch (e) {
    console.warn('Backend no disponible, usando datos locales');
  }
}

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

    D.consultas.push(mapConsulta({
      ...payload,
      id,
      costo_total:  cos,
      monto_pagado: ab
    }));

    cerrar('mCon');
    saveData();
    renderAll();
    toast('✓ Consulta guardada en base de datos');

  } catch (e) {
    console.error('Error:', e);
    toast('⚠ Error conectando con el servidor', 'var(--danger)');
  }
}

// Arranca cargando desde MySQL
cargarConsultas();
