import React from "react";

// 1. CORRECCIÓN: Añadido onGestionar a las props
function ModalDetalleCita({ isOpen, onClose, cita, onGestionar }) {
  if (!isOpen || !cita) return null;

  const obtenerEstiloEstado = (estado) => {
    switch (estado) {
      case "COMPLETADA":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELADA":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200"; // AGENDADA
    }
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden transform transition-all">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-800">Detalles de la Cita</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Paciente
            </label>
            <p className="text-base font-bold text-slate-900">{cita.paciente}</p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Horario asignado
            </label>
            <p className="text-sm font-medium text-slate-700 capitalize">
              {formatearFecha(cita.start)}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Motivo de consulta
            </label>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
              "{cita.motivo}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estado</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${obtenerEstiloEstado(cita.estado)}`}>
              {cita.estado}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-2 p-4 bg-slate-50/50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cerrar Vista
          </button>
          
          {cita.estado !== "COMPLETADA" && cita.estado !== "CANCELADA" && (
            <button
              onClick={onGestionar}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-xl transition-colors"
            >
              Gestionar Cita
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default ModalDetalleCita;