import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"
function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    citasHoy: 0,
    pacientesNuevos: 0,
    loading: true,
    error:""
  });

  useEffect(() => {
    const cargarEstadisticas = async () => {
        try {
            //Petición
            const response = await API.get("api/dashboard/stats");
            setStats({
                citasHoy: response.data.citasHoy,
                pacientesNuevos: response.data.pacientesNuevos,
                loading: false,
                error: ""
            });
        } catch (err) {
            console.error("Error al cargar estadísticas:", err);
            setStats((prev) => ({
                ...prev,
                loading: false,
                error: "No se pudieron sincronizar los datos en tiempo real."
            }));
        }
    };
    cargarEstadisticas();
  }, []);

  const handleLogout = () => {
    // Eliminar el token para cerrar la sesión
    localStorage.removeItem("token");
    navigate("/login");
  };
return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col justify-between p-4 hidden md:flex">
        <div>
          <h1 className="text-xl font-bold text-white mb-8 tracking-tight px-2">MediManage</h1>
          <nav className="space-y-2">
            <a href="#panel" className="block px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium">Panel Principal</a>
            <a href="#citas" className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors">Gestionar Citas</a>
            <a href="#pacientes" className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors">Pacientes</a>
          </nav>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-900/50 hover:text-red-400 transition-colors font-medium"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">Panel de Control</h2>
          <button 
            onClick={handleLogout}
            className="md:hidden bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold"
          >
            Salir
          </button>
        </header>

        {/* Alerta de Error si falla la API */}
        {stats.error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
            {stats.error}
          </div>
        )}

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Citas para Hoy</h3>
            <p className="text-3xl font-bold text-slate-950 mt-2">
              {stats.loading ? "..." : stats.citasHoy}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Pacientes Nuevos</h3>
            <p className="text-3xl font-bold text-slate-950 mt-2">
              {stats.loading ? "..." : stats.pacientesNuevos}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Estado del Servidor</h3>
            <p className={`text-sm font-semibold px-2 py-1 rounded-md inline-block mt-2 ${
              stats.error ? "text-amber-600 bg-amber-50" : "text-green-600 bg-green-50"
            }`}>
              {stats.loading ? "Verificando..." : stats.error ? "Modo Offline" : "Conectado (API)"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;