import { useEffect, useState } from "react";
import API from "../services/api";
import ModalPaciente from "../components/ModalPaciente"; // 🚨 Importamos el componente profesional

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 🚨 Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modularizamos la función de carga para poder llamarla al montar y al crear un paciente
  const obtenerPacientes = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/pacientes");
      setPacientes(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error al traer pacientes:", err);
      setError("No se pudo cargar la lista de pacientes.");
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPacientes();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden relative">
      {/* Encabezado de la Sección */}
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Listado Clínico</h3>
          <p className="text-sm text-slate-500 mt-0.5">Filtra, revisa o añade expedientes a tu matrícula.</p>
        </div>
        {/* 🚨 Al dar clic cambiamos el estado a true para abrir la ventana */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
        >
          + Nuevo Paciente
        </button>
      </div>

      {/* Estado de Carga y Errores */}
      {loading && <p className="p-6 text-slate-500 text-sm">Cargando catálogo de pacientes...</p>}
      {error && <p className="p-6 text-red-600 text-sm font-medium">{error}</p>}

      {/* Tabla Autoadaptable */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Paciente</th>
                <th className="py-3 px-6">Contacto</th>
                <th className="py-3 px-6">Fecha Nacimiento</th>
                <th className="py-3 px-6">Alergias / Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    No tienes pacientes registrados todavía. ¡Añade el primero!
                  </td>
                </tr>
              ) : (
                pacientes.map((paciente) => (
                  <tr key={paciente.idPaciente} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {paciente.nombre} {paciente.apellidos}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span>{paciente.telefono}</span>
                        <span className="text-xs text-slate-400">{paciente.correo}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {paciente.fechaNacimiento}
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-slate-500">
                      {paciente.notasAlergias || <span className="text-slate-300">Ninguna</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🚨 Inyección del Componente Modal Reutilizable */}
      <ModalPaciente 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPacienteCreado={obtenerPacientes} 
      />
    </div>
  );
}

export default Pacientes;