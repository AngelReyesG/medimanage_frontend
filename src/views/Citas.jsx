import { useEffect, useState } from "react";
import API from "../services/api";
import ModalCita from "../components/ModalCita"; // Componente modular que crearemos a continuación

function Citas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función modular para obtener la agenda de citas
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

  useEffect(() => {
    obtenerCitas();
  }, []);

  // Función auxiliar para pintar las insignias (badges) de estado según el Enum del backend
  const renderBadgeEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pendiente</span>;
      case "CONFIRMADA":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Confirmada</span>;
      case "CANCELADA":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">Cancelada</span>;
      case "COMPLETADA":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Completada</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-50 text-slate-700 border border-slate-200">{estado}</span>;
    }
  };

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

      {/* Control de carga y errores intermitentes */}
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
                <th className="py-3 px-6">Estado</th>
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
                    {/* Celda del Paciente */}
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellidos}` : <span className="text-red-400 font-normal">No asignado</span>}
                    </td>

                    {/* 🚨 REEMPLAZA ESTA CELDA ESPECÍFICA (Fecha y Hora): */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">
                          {/* Separamos la fecha de la hora usando el espacio en blanco como delimitador */}
                          {cita.fechaHora ? cita.fechaHora.split(" ")[0] : "Sin fecha"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {cita.fechaHora ? `${cita.fechaHora.split(" ")[1]} hrs` : ""}
                        </span>
                      </div>
                    </td>

                    {/* Celda del Motivo */}
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                      {cita.motivo}
                    </td>
                    
                    {/* Celda del Estado */}
                    <td className="py-4 px-6">
                      {renderBadgeEstado(cita.estado)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Inyección del Modal Reutilizable de Agenda */}
      <ModalCita 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCitaCreada={obtenerCitas} 
      />
    </div>
  );
}

export default Citas;