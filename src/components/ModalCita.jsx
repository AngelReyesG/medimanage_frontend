import { useState, useEffect } from "react";
import API from "../services/api";

function ModalCita({ isOpen, onClose, onCitaCreada }) {
  // Estado para el formulario alineado con CitaRequestDTO
  const [formData, setFormData] = useState({
    pacienteId: "",
    fecha: "",
    hora: "",
    motivo: ""
  });

  // Estados para controlar el catálogo de pacientes necesarios en el select
  const [pacientes, setPacientes] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Efecto para cargar los pacientes únicamente cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      const cargarPacientes = async () => {
        try {
          setLoadingPacientes(true);
          const response = await API.get("/api/pacientes");
          setPacientes(response.data);
        } catch (err) {
          console.error("Error al obtener catálogo de pacientes para el modal:", err);
          setError("No se pudo cargar la lista de pacientes. Inténtalo de nuevo.");
        } finally {
          setLoadingPacientes(false);
        }
      };
      cargarPacientes();
    }
  }, [isOpen]);

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

    if (!formData.pacienteId) {
      setError("Por favor, selecciona un paciente de la lista.");
      setLoading(false);
      return;
    }

    try {
      //Formatear la fecha de YYYY-MM-DD a dd/MM/yyyy
      const [anio, mes, dia] = formData.fecha.split("-");
      const fechaFormateada = `${dia}/${mes}/${anio}`;

      //Unificar con la hora en el formato estricto
      const fechaHoraCombinada = `${fechaFormateada} ${formData.hora}`;

      // 🚨 3. Construir el Payload idéntico a tu CitaRequestDTO
      const payload = {
        pacienteId: Number(formData.pacienteId),
        fechaHora: fechaHoraCombinada, // Envía "dd/MM/yyyy HH:mm"
        motivo: formData.motivo
      };

      //Realizar la petición POST enviando el payload correcto
      await API.post("/api/citas/registrar", payload);

      //Notificar al padre, limpiar y cerrar
      onCitaCreada();
      setFormData({ pacienteId: "", fecha: "", hora: "", motivo: "" });
      onClose();
    } catch (err) {
      console.error("Error al registrar la cita:", err);
      setError(err.response?.data?.message || "Error al agendar la cita. Revisa los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform transition-all">
        
        {/* Encabezado */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Agendar Nueva Cita</h3>
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

          {/* Menú Desplegable de Pacientes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Paciente *
            </label>
            <select
              name="pacienteId"
              required
              value={formData.pacienteId}
              onChange={handleChange}
              disabled={loadingPacientes}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
            >
              <option value="">
                {loadingPacientes ? "Cargando pacientes..." : "--- Selecciona un paciente ---"}
              </option>
              {pacientes.map((p) => (
                <option key={p.idPaciente} value={p.idPaciente}>
                  {p.nombre} {p.apellidos}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora en paralelo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                required
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hora *
              </label>
              <input
                type="time"
                name="hora"
                required
                value={formData.hora}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Motivo de consulta */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Motivo de la Consulta *
            </label>
            <textarea
              name="motivo"
              required
              rows="3"
              value={formData.motivo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              placeholder="Ej. Control mensual de hipertensión arterial o revisión de estudios clínicos."
            />
          </div>

          {/* Botones de acción inferiores */}
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
              disabled={loading || loadingPacientes}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Agendando..." : "Confirmar Cita"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default ModalCita;