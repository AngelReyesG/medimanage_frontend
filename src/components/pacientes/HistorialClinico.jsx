import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import ListaNotasEvolucion from './ListaNotasEvolucion.jsx';

const HistorialClinico = ({ idPaciente, nombrePaciente }) => {
  const [activeTab, setActiveTab] = useState('antecedentes'); // 'antecedentes' o 'consultas'
  const [antecedentes, setAntecedentes] = useState({
    antecedentesFamiliares: '',
    antecedentesPatologicos: '',
    antecedentesNoPatologicos: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/historias-clinicas/paciente/${idPaciente}`);
        if (response.data) {
          setAntecedentes({
            antecedentesFamiliares: response.data.antecedentesFamiliares || '',
            antecedentesPatologicos: response.data.antecedentesPatologicos || '',
            antecedentesNoPatologicos: response.data.antecedentesNoPatologicos || ''
          });
        }
      } catch (err) {
        console.error("Error al cargar historia clínica:", err);
        setMensaje({ texto: "No se pudo recuperar el expediente clínico.", tipo: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (idPaciente) {
      cargarHistorial();
    }
  }, [idPaciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAntecedentes({ ...antecedentes, [name]: value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      await API.put(`/api/historias-clinicas/paciente/${idPaciente}`, antecedentes);
      setMensaje({ texto: '¡Expediente actualizado con éxito!', tipo: 'exito' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (err) {
      console.error("Error al guardar historia clínica:", err);
      setMensaje({ texto: "Hubo un error al guardar los cambios.", tipo: "error" });
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm animate-pulse">
        Cargando expediente clínico del paciente...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-4xl mx-auto">
      {/* Encabezado Interno */}
      <div className="border-b border-slate-100 pb-2 mb-4">
        <h4 className="text-lg font-bold text-slate-900">Expediente Clínico Integral</h4>
        <p className="text-xs text-slate-500 mt-0.5">Paciente: <span className="font-semibold text-slate-700">{nombrePaciente}</span></p>
        
        {/* NAVEGACIÓN POR PESTAÑAS (TABS) */}
        <div className="flex space-x-4 mt-4 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('antecedentes')}
            className={`pb-2 px-1 border-b-2 transition-all ${
              activeTab === 'antecedentes' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            📋 Antecedentes Generales
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('consultas')}
            className={`pb-2 px-1 border-b-2 transition-all ${
              activeTab === 'consultas' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            🩺 Notas de Evolución (Consultas)
          </button>
        </div>
      </div>

      {/* CUERPO DEL CONTENEDOR CON CONDICIONAL REFORZADO */}
      <div className="mt-4">
        {activeTab === 'antecedentes' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={handleGuardar}
                disabled={guardando}
                className={`px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all ${
                  guardando ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                }`}
              >
                {guardando ? 'Guardando...' : 'Guardar Antecedentes'}
              </button>
            </div>

            {mensaje.texto && (
              <div className={`p-4 mb-6 rounded-xl text-sm font-medium border ${
                mensaje.tipo === 'exito' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {mensaje.texto}
              </div>
            )}

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">🧬 Antecedentes Heredofamiliares</label>
                <textarea
                  name="antecedentesFamiliares"
                  rows="3"
                  value={antecedentes.antecedentesFamiliares}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Ej. Diabetes, Hipertensión en línea directa..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">🏥 Antecedentes Personales Patológicos</label>
                <textarea
                  name="antecedentesPatologicos"
                  rows="3"
                  value={antecedentes.antecedentesPatologicos}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Ej. Cirugías previas, fracturas, enfermedades crónicas..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">🌿 Antecedentes Personales No Patológicos</label>
                <textarea
                  name="antecedentesNoPatologicos"
                  rows="3"
                  value={antecedentes.antecedentesNoPatologicos}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Ej. Tabaquismo, alimentación, vacunas, vivienda..."
                />
              </div>
            </form>
          </div>
        )}

        {activeTab === 'consultas' && (
          <div className="animate-fade-in">
            <ListaNotasEvolucion idPaciente={idPaciente} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialClinico;