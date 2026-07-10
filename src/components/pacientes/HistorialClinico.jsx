import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const HistorialClinico = ({ idPaciente, nombrePaciente }) => {
  const [antecedentes, setAntecedentes] = useState({
    antecedentesFamiliares: '',
    antecedentesPatologicos: '',
    antecedentesNoPatologicos: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Cargar los antecedentes desde el backend al montar el componente o cambiar de paciente
  // Cargar los antecedentes desde el backend al montar el componente o cambiar de paciente
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
        // 🚀 Corregido: Quitamos la línea de setError que no existía
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
    setAntecedentes({
      ...antecedentes,
      [name]: value
    });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // Consumimos el endpoint PUT que actualiza o inserta de forma segura
      await API.put(`/api/historias-clinicas/paciente/${idPaciente}`, antecedentes);
      setMensaje({ texto: '¡Expediente actualizado con éxito!', tipo: 'exito' });
      
      // Limpiar el mensaje de éxito después de 3 segundos
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
      {/* Encabezado interno */}
      <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h4 className="text-lg font-bold text-slate-900">Antecedentes Clínicos</h4>
          <p className="text-xs text-slate-500 mt-0.5">Paciente: <span className="font-semibold text-slate-700">{nombrePaciente}</span></p>
        </div>
        
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className={`px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all ${
            guardando 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {guardando ? 'Guardando...' : 'Guardar Expediente'}
        </button>
      </div>

      {/* Alertas de Estado */}
      {mensaje.texto && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-medium border ${
          mensaje.tipo === 'exito' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* Formulario de tres bloques de texto amplios */}
      <form onSubmit={handleGuardar} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            🧬 Antecedentes Heredofamiliares
          </label>
          <p className="text-xs text-slate-400 mb-2">Enfermedades de línea sanguínea directa (Diabetes, Hipertensión, Cáncer, Cardiopatías).</p>
          <textarea
            name="antecedentesFamiliares"
            rows="3"
            value={antecedentes.antecedentesFamiliares}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            placeholder="Redactar patologías familiares..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            🏥 Antecedentes Personales Patológicos
          </label>
          <p className="text-xs text-slate-400 mb-2">Historial médico propio (Enfermedades crónicas, cirugías previas, hospitalizaciones, traumatismos).</p>
          <textarea
            name="antecedentesPatologicos"
            rows="3"
            value={antecedentes.antecedentesPatologicos}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            placeholder="Redactar antecedentes médicos y quirúrgicos del paciente..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            🌿 Antecedentes Personales No Patológicos
          </label>
          <p className="text-xs text-slate-400 mb-2">Estilo de vida y hábitos (Tabaquismo, alcoholismo, sustancias, vivienda, alimentación, vacunas).</p>
          <textarea
            name="antecedentesNoPatologicos"
            rows="3"
            value={antecedentes.antecedentesNoPatologicos}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            placeholder="Redactar hábitos, adicciones o condiciones generales de vida..."
          />
        </div>
      </form>
    </div>
  );
};

export default HistorialClinico;