import { useState } from "react";
import API from "../services/api";

function ModalPaciente({ isOpen, onClose, onPacienteCreado }) {
  // Estado único para agrupar el formulario de forma limpia
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    correo: "",
    fechaNacimiento: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Si el modal está cerrado, no renderiza absolutamente nada en el DOM
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Pega exactamente a endpoint del PacienteController
      await API.post("/api/pacientes/registrar", formData);
      
      // Notifica al padre que se creó con éxito para refrescar la lista
      onPacienteCreado();
      
      // Limpia el formulario y cierra
      setFormData({ nombre: "", apellidos: "", telefono: "", correo: "", fechaNacimiento: "" });
      onClose();
    } catch (err) {
      console.error("Error al registrar paciente:", err);
      setError(err.response?.data?.message || "Error al registrar el paciente. Verifica los campos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform transition-all">
        
        {/* Encabezado */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Registrar Nuevo Paciente</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 text-xl font-semibold transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nombre(s) *</label>
              <input
                type="text"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Ej. Juan"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                required
                value={formData.apellidos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Ej. Pérez Gómez"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="juan.perez@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                required
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="5512345678"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Fecha de Nacimiento *</label>
              <input
                type="date"
                name="fechaNacimiento"
                required
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Botones de acción de la parte inferior */}
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? "Registrando..." : "Guardar Paciente"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default ModalPaciente;