import { useEffect, useState } from "react";
import API from "../services/api";
import ModalCita from "../components/ModalCita";

function Citas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // Para mostrar un estado de carga visual por fila

  const obtenerCitas = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/api/citas");
      setCitas(response.data);
    } catch (err) {
      console.error("Error al traer las citas:", err);
      setError("No se pudo cargar la agenda de citas.");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstadoCita = async (idCita, nuevoEstado) => {
    setUpdatingId(idCita);
    try {
      // Pasamos el estado estrictamente en MAYÚSCULAS para que Spring Boot lo parsee sin errores al Enum
      const estadoUpper = nuevoEstado.toUpperCase();
      
      // PatchMapping: /api/citas/{id}/estado?nuevoEstado=VALOR
      await API.patch(`/api/citas/${idCita}/estado`, null, {
        params: { nuevoEstado: estadoUpper }
      });

      // Actualizamos el estado local de la tabla de forma inmediata y limpia sin hacer otro GET total
      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.idCita === idCita ? { ...cita, estado: estadoUpper } : cita
        )
      );
    } catch (err) {
      console.error("Error al cambiar el estado de la cita:", err);
      alert("No se pudo actualizar el estado de la cita. Verifica la conexión.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden relative">
      
      {/* Encabezado */}
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Agenda Médica</h3>
          <p className="text-sm text-slate-500 mt-0.5">Controla los horarios, motivos de consulta y estados de tus citas diarias.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
        >
          + Agendar Cita
        </button>
      </div>

      {loading && <p className="p-6 text-slate-500 text-sm">Sincronizando agenda...</p>}
      {error && <p className="p-6 text-red-600 text-sm font-medium">{error}</p>}

      {/* Tabla de la Agenda */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Paciente</th>
                <th className="py-3 px-6">Fecha y Hora</th>
                <th className="py-3 px-6">Motivo de Consulta</th>
                <th className="py-3 px-6 text-center">Estado / Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {citas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    No tienes consultas programadas. ¡Agenda una nueva cita!
                  </td>
                </tr>
              ) : (
                citas.map((cita) => (
                  <tr key={cita.idCita} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellidos}` : <span className="text-red-400 font-normal">No asignado</span>}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">
                          {cita.fechaHour || cita.fechaHora ? (cita.fechaHora || "").split(" ")[0] : "Sin fecha"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {cita.fechaHour || cita.fechaHora ? `${(cita.fechaHora || "").split(" ")[1]} hrs` : ""}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                      {cita.motivo}
                    </td>
                    
                    {/* 🚨 Gestión interactiva del Estado */}
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center space-x-2">
                        <select
                          value={cita.estado}
                          disabled={updatingId === cita.idCita}
                          onChange={(e) => cambiarEstadoCita(cita.idCita, e.target.value)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10
                            ${cita.estado === "PENDIENTE" ? "text-amber-700 border-amber-200 bg-amber-50/50" : ""}
                            ${cita.estado === "CONFIRMADA" ? "text-emerald-700 border-emerald-200 bg-emerald-50/50" : ""}
                            ${cita.estado === "CANCELADA" ? "text-rose-700 border-rose-200 bg-rose-50/50" : ""}
                            ${cita.estado === "COMPLETADA" ? "text-blue-700 border-blue-200 bg-blue-50/50" : ""}
                          `}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="CONFIRMADA">Confirmada</option>
                          <option value="COMPLETADA">Completada</option>
                          <option value="CANCELADA">Cancelada</option>
                        </select>
                        {updatingId === cita.idCita && (
                          <span className="text-[10px] text-slate-400 animate-pulse">...</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ModalCita 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCitaCreada={obtenerCitas} 
      />
    </div>
  );
}

export default Citas;