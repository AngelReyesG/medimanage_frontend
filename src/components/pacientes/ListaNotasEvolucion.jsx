import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const ListaNotasEvolucion = ({ idPaciente }) => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Estado inicial del formulario clínico
  const [nuevaNota, setNuevaNota] = useState({
    tensionArterial: '',
    frecuenciaCardiaca: '',
    temperatura: '',
    peso: '',
    talla: '',
    motivoConsulta: '',
    exploracionFisica: '',
    diagnostico: '',
    planTratamiento: ''
  });

  const cargarNotas = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/notas-evolucion/paciente/${idPaciente}`);
      setNotas(response.data);
    } catch (err) {
      console.error("Error al traer notas de evolución:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNotas();
  }, [idPaciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaNota({ ...nuevaNota, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await API.post(`/api/notas-evolucion/paciente/${idPaciente}`, nuevaNota);
      // Limpiar formulario y recargar historial
      setNuevaNota({
        tensionArterial: '', frecuenciaCardiaca: '', temperatura: '',
        peso: '', talla: '', motivoConsulta: '',
        exploracionFisica: '', diagnostico: '', planTratamiento: ''
      });
      setMostrarFormulario(false);
      cargarNotas();
    } catch (err) {
      console.error("Error al registrar nota:", err);
      alert("No se pudo guardar la nota de evolución.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Botón de alternancia */}
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Historial de Consultas</span>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all text-white shadow-sm ${
            mostrarFormulario ? 'bg-slate-500 hover:bg-slate-600' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {mostrarFormulario ? '✖ Cancelar Consulta' : '➕ Iniciar Nueva Consulta'}
        </button>
      </div>

      {/* FORMULARIO DE NUEVA CONSULTA */}
      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="bg-slate-50/50 rounded-xl border border-slate-200 p-4 space-y-4 animate-fade-in">
          <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">🩺 Registro de Consulta Actual</h5>
          
          {/* Subgrupo: Signos Vitales */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-3 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Presión (T/A)</label>
              <input type="text" name="tensionArterial" value={nuevaNota.tensionArterial} onChange={handleChange} placeholder="120/80" className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Frec. Cardíaca (FC)</label>
              <input type="number" step="0.1" name="frecuenciaCardiaca" value={nuevaNota.frecuenciaCardiaca} onChange={handleChange} placeholder="72" className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Temperatura (°C)</label>
              <input type="number" step="0.1" name="temperatura" value={nuevaNota.temperatura} onChange={handleChange} placeholder="36.5" className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Peso (Kg)</label>
              <input type="number" step="0.1" name="peso" value={nuevaNota.peso} onChange={handleChange} placeholder="70" className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Estatura (cm)</label>
              <input type="number" step="0.1" name="talla" value={nuevaNota.talla} onChange={handleChange} placeholder="170" className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
          </div>

          {/* Campos de texto descriptivos */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Motivo de Consulta *</label>
              <textarea required name="motivoConsulta" value={nuevaNota.motivoConsulta} onChange={handleChange} rows="2" className="w-full p-2.5 border border-slate-200 rounded-xl text-xs" placeholder="¿Por qué acude el paciente?..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exploración Física *</label>
              <textarea required name="exploracionFisica" value={nuevaNota.exploracionFisica} onChange={handleChange} rows="2" className="w-full p-2.5 border border-slate-200 rounded-xl text-xs" placeholder="Hallazgos clínicos observados..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Diagnóstico *</label>
              <textarea required name="diagnostico" value={nuevaNota.diagnostico} onChange={handleChange} rows="2" className="w-full p-2.5 border border-slate-200 rounded-xl text-xs" placeholder="Impresión diagnóstica médica..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tratamiento / Receta</label>
              <textarea name="planTratamiento" value={nuevaNota.planTratamiento} onChange={handleChange} rows="2" className="w-full p-2.5 border border-slate-200 rounded-xl text-xs" placeholder="Medicamentos, dosis e indicaciones..." />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={guardando} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2 rounded-xl shadow-sm transition-all">
              {guardando ? 'Guardando Consulta...' : 'Finalizar y Guardar Consulta'}
            </button>
          </div>
        </form>
      )}

      {/* LISTADO CRONOLÓGICO DE CONSULTAS PREVIAS */}
      {loading ? (
        <p className="text-center text-xs text-slate-400 py-4">Cargando consultas previas...</p>
      ) : notas.length === 0 ? (
        <div className="text-center p-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
          El paciente aún no cuenta con notas de evolución registradas.
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {notas.map((nota) => (
            <div key={nota.idNota} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  📅 {new Date(nota.fechaConsulta).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
                {/* Microbloque de Signos Vitales */}
                <div className="flex gap-2 text-[10px] text-slate-500 font-medium">
                  {nota.tensionArterial && <span>🩸 {nota.tensionArterial}</span>}
                  {nota.temperatura && <span>🌡️ {nota.temperatura}°C</span>}
                  {nota.peso && <span>⚖️ {nota.peso}kg</span>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <h6 className="font-bold text-slate-800">📋 Motivo:</h6>
                  <p className="text-slate-600 mt-0.5 whitespace-pre-wrap">{nota.motivoConsulta}</p>
                </div>
                <div>
                  <h6 className="font-bold text-slate-800">🔍 Exploración:</h6>
                  <p className="text-slate-600 mt-0.5 whitespace-pre-wrap">{nota.exploracionFisica}</p>
                </div>
                <div className="md:col-span-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <h6 className="font-bold text-emerald-800 text-[11px] uppercase">🎯 Diagnóstico:</h6>
                  <p className="text-slate-700 font-medium mt-0.5 whitespace-pre-wrap">{nota.diagnostico}</p>
                </div>
                {nota.planTratamiento && (
                  <div className="md:col-span-2 border-t border-slate-100 pt-2">
                    <h6 className="font-bold text-slate-800">💊 Plan y Tratamiento:</h6>
                    <p className="text-slate-600 mt-0.5 whitespace-pre-wrap">{nota.planTratamiento}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaNotasEvolucion;