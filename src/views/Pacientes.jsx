import { useEffect, useState } from "react";
import API from "../services/api";
import FormularioPaciente from "../components/pacientes/FormularioPaciente";
import HistorialClinico from "../components/pacientes/HistorialClinico";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estado para el buscador por nombre
  const [filtroNombre, setFiltroNombre] = useState("");

  // Estado para controlar la visibilidad del modal de registro
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para almacenar el paciente seleccionado para ver su expediente
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  // Función para buscar o listar todos aprovechando el Backend
  const obtenerPacientes = async (nombreABuscar = "") => {
    try {
      setLoading(true);
      const url = nombreABuscar.trim() 
        ? `/api/pacientes?nombre=${encodeURIComponent(nombreABuscar)}` 
        : "/api/pacientes";
        
      const response = await API.get(url);
      setPacientes(response.data);
      setError(""); 
    } catch (err) {
      console.error("Error al traer pacientes:", err);
      setError("No se pudo cargar la lista de pacientes.");
    } finally {
      setLoading(false);
    }
  };

  // Escucha los cambios del buscador con debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      obtenerPacientes(filtroNombre);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [filtroNombre]);

  // Callback cuando el Formulario guarda con éxito
  const handlePacienteRegistrado = () => {
    obtenerPacientes(filtroNombre); 
    setIsModalOpen(false); 
  };

  return (
    <div className="space-y-6">
      {/* CONTENEDOR GRID DINÁMICO: Si hay un paciente seleccionado se divide en 2 columnas, si no, se muestra en 1 sola */}
      <div className={`grid grid-cols-1 ${pacienteSeleccionado ? 'lg:grid-cols-12' : 'grid-cols-1'} gap-6`}>
        
        {/* COLUMNA DEL LISTADO CLÍNICO */}
        <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden relative ${
          pacienteSeleccionado ? 'lg:col-span-5 xl:col-span-4' : 'w-full'
        }`}>
          
          {/* Encabezado de la Sección */}
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Listado Clínico</h3>
              <p className="text-sm text-slate-500 mt-0.5">Filtra o selecciona un expediente.</p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors w-full sm:w-auto text-center"
            >
              + Nuevo
            </button>
          </div>

          {/* Barra de Búsqueda */}
          <div className="p-4 border-b border-slate-100 bg-white flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <div className="absolute left-3.5 top-2.5 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Estado de Carga y Errores */}
          {loading && <p className="p-6 text-slate-500 text-sm">Cargando catálogo...</p>}
          {error && <p className="p-6 text-red-600 text-sm font-medium">{error}</p>}

          {/* Tabla Autoadaptable */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-6">Paciente</th>
                    {/* Ocultamos columnas secundarias en pantallas divididas para mantener la legibilidad */}
                    {!pacienteSeleccionado && <th className="py-3 px-6">Contacto</th>}
                    {!pacienteSeleccionado && <th className="py-3 px-6">Fecha Nacimiento</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                  {pacientes.length === 0 ? (
                    <tr>
                      <td colSpan={pacienteSeleccionado ? "1" : "3"} className="py-8 text-center text-slate-400">
                        No se encontraron registros.
                      </td>
                    </tr>
                  ) : (
                    pacientes.map((paciente) => (
                      <tr 
                        key={paciente.idPaciente} 
                        onClick={() => setPacienteSeleccionado(paciente)} // 🚀 Al hacer clic seleccionamos al paciente
                        className={`cursor-pointer transition-colors ${
                          pacienteSeleccionado?.idPaciente === paciente.idPaciente 
                            ? 'bg-blue-50/70 hover:bg-blue-50' 
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          <div className="flex flex-col">
                            <span>{paciente.nombre} {paciente.apellidos}</span>
                            {/* Si la pantalla está dividida, mostramos el teléfono chiquito aquí abajo */}
                            {pacienteSeleccionado && <span className="text-xs text-slate-400 font-normal mt-0.5">{paciente.telefono}</span>}
                          </div>
                        </td>
                        {!pacienteSeleccionado && (
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span>{paciente.telefono}</span>
                              <span className="text-xs text-slate-400">{paciente.correo}</span>
                            </div>
                          </td>
                        )}
                        {!pacienteSeleccionado && (
                          <td className="py-4 px-6 text-slate-500">
                            {paciente.fechaNacimiento}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* COLUMNA DEL EXPEDIENTE CLÍNICO (Sólo se monta si hay selección) */}
        {pacienteSeleccionado && (
          <div className="lg:col-span-7 xl:col-span-8 relative animate-fade-in">
            {/* Botón flotante para cerrar/deseleccionar el expediente */}
            <button 
              onClick={() => setPacienteSeleccionado(null)}
              className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
              title="Cerrar expediente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Inyección de tu componente de Historial Clínico */}
            <HistorialClinico 
              idPaciente={pacienteSeleccionado.idPaciente} 
              nombrePaciente={`${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellidos}`} 
            />
          </div>
        )}

      </div>

      {/* MODAL DE NUEVO PACIENTE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative border border-slate-100">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-2">
              <FormularioPaciente onPacienteRegistrado={handlePacienteRegistrado} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pacientes;