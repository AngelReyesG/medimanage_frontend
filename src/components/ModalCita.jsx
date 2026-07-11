import { useEffect, useState } from "react";
import API from "../services/api";

function ModalCita({ isOpen, onClose, onCitaCreada, citaAEditar }) {
  const [pacientes, setPacientes] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  
  const [idPaciente, setIdPaciente] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const cargarPacientes = async () => {
        try {
          setLoadingPacientes(true);
          const response = await API.get("/api/pacientes");
          setPacientes(response.data);
        } catch (err) {
          console.error("Error al cargar pacientes para la cita:", err);
        } finally {
          setLoadingPacientes(false);
        }
      };
      cargarPacientes();

      if (citaAEditar) {
        setIdPaciente(citaAEditar.pacienteId || "");
        setMotivo(citaAEditar.motivo || "");

        if (citaAEditar.start) {
          const [fechaParte, horaParte] = citaAEditar.start.split("T");
          setFecha(fechaParte || "");
          // CORRECCIÓN 2: .substring con 's' minúscula
          setHora(horaParte ? horaParte.substring(0, 5) : "");
        }
      } else {
        setIdPaciente("");
        setFecha("");
        setHora("");
        setMotivo("");
        setError("");
      }
      setError("");
    }
  }, [isOpen, citaAEditar]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idPaciente || !fecha || !hora || !motivo) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoadingSubmit(true);
      const fechaHoraIso = `${fecha}T${hora}:00`;
      const payload = {
        pacienteId: parseInt(idPaciente, 10),
        fechaHora: fechaHoraIso,
        motivo: motivo
      };

      // CORRECCIÓN 3: Cambiado playload por payload
      if (citaAEditar) {
        await API.put(`/api/citas/${citaAEditar.id}`, payload);
      } else {
        await API.post("/api/citas", payload);
      }
      
      if (onCitaCreada) await onCitaCreada();
      onClose();
    } catch (err) {
      console.error("Error al registrar la cita:", err);
      setError("No se pudo registrar la cita. Revisa los horarios e intenta de nuevo.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (  
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative border border-slate-100 animate-fade-in">
        
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {citaAEditar ? "Modificar Cita Médica" : "Agendar Nueva Cita"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Completa los datos para reservar el espacio médico.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Paciente</label>
            <select
              value={idPaciente}
              onChange={(e) => setIdPaciente(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              disabled={loadingPacientes}
            >
              <option value="">-- Selecciona un paciente --</option>
              {pacientes.map((p) => (
                <option key={p.idPaciente} value={p.idPaciente}>
                  {p.nombre} {p.apellido || p.apellidos}
                </option>
              ))}
            </select>
            {loadingPacientes && <span className="text-xs text-slate-400">Cargando lista de pacientes...</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hora</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Motivo de la Consulta</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej. Control mensual, limpieza dental, valoración inicial..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              disabled={loadingSubmit}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? "Guardando..." : "Confirmar Cita"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default ModalCita;