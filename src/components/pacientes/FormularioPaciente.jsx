import React, { useState } from 'react';
import API  from '../../services/api';

const FormularioPaciente = ({ onPacienteRegistrado }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    correo: '',
    fechaNacimiento: '',
    notasAlergias: '',
    historialClinico: ''
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' }); // tipo: 'exito' o 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // Enviamos el DTO limpio a la nueva ruta REST optimizada (/api/pacientes)
      const response = await API.post('/api/pacientes', formData);
      
      setMensaje({ texto: '¡Paciente registrado con éxito!', tipo: 'exito' });
      
      // Limpiamos el formulario
      setFormData({
        nombre: '',
        apellidos: '',
        telefono: '',
        correo: '',
        fechaNacimiento: '',
        notasAlergias: '',
        historialClinico: ''
      });

      // Disparamos un callback por si la vista padre necesita refrescar una lista
      if (onPacienteRegistrado) {
        onPacienteRegistrado(response.data);
      }
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      const errorMsg = error.response?.data?.message || 'Hubo un error al procesar el registro. Inténtalo de nuevo.';
      setMensaje({ texto: errorMsg, tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
        Registrar Nuevo Paciente
      </h2>

      {mensaje.texto && (
        <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${
          mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECCIÓN 1: DATOS PERSONALES */}
        <div>
          <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">
            Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                name="nombre"
                required
                maxLength={100}
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                placeholder="Ej. Juan José"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                required
                maxLength={200}
                value={formData.apellidos}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                placeholder="Ej. Reyes González"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
              <input
                type="date"
                name="fechaNacimiento"
                required
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: CONTACTO Y DATOS MÉDICOS */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">
            Contacto y Datos Médicos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                required
                maxLength={15}
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                placeholder="Ej. 5512345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                name="correo"
                maxLength={100}
                value={formData.correo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Alergias o Notas Médicas Importantes</label>
              <textarea
                name="notasAlergias"
                rows="2"
                value={formData.notasAlergias}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
                placeholder="Ej. Alérgico a la penicilina, intolerante a la lactosa..."
              />
            </div>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg font-semibold text-white transition-all shadow-md ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-sky-100'
            }`}
          >
            {loading ? 'Registrando...' : 'Guardar Paciente'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default FormularioPaciente;