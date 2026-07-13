import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PanelDoctor = () => {
    // Estados para la gestión de datos
    const [solicitudes, setSolicitudes] = useState([]);
    const [citasAgendadas, setCitasAgendadas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);
    
    // ESTADO NUEVO: Guarda el idCita de la cita que el usuario desea expandir
    const [citaExpandidaId, setCitaExpandidaId] = useState(null);

    // Función auxiliar para obtener y decodificar el ID del médico desde el JWT
    const obtenerMedicoIdDesdeToken = () => {
        const token = localStorage.getItem('token'); 
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payloadDecodificado = JSON.parse(window.atob(base64));
            return payloadDecodificado.medicoId || payloadDecodificado.id;
        } catch (error) {
            console.error("Error al decodificar el token de sesión:", error);
            return null;
        }
    };

    // Cargar solicitudes pendientes y la agenda dinámica
    const cargarDatosPanel = async () => {
        const medicoId = obtenerMedicoIdDesdeToken();

        if (!medicoId) {
            setMensaje({ 
                tipo: 'error', 
                texto: 'Sesión no válida o expirada. Por favor, inicia sesión nuevamente.' 
            });
            return;
        }

        setLoading(true);
        try {
            const configBase = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };

            // 1. Obtener solicitudes pendientes
            const resSolicitudes = await axios.get(`http://localhost:8080/api/citas/solicitudes-pendientes`, configBase);
            setSolicitudes(resSolicitudes.data);

            // 2. Obtener la agenda diaria
            const configAgenda = {
                ...configBase,
                params: { fecha: fechaFiltro }
            };
            const resAgenda = await axios.get(`http://localhost:8080/api/citas/agenda-diaria`, configAgenda);
            setCitasAgendadas(resAgenda.data);

        } catch (error) {
            console.error("Error al cargar los datos del panel:", error);
            setMensaje({ tipo: 'error', texto: 'Error de comunicación con el servidor al sincronizar los datos.' });
        } finally {
            setLoading(false);
        }
    };

    // Hook para recargar datos al cambiar la fecha del filtro
    useEffect(() => {
        cargarDatosPanel();
    }, [fechaFiltro]);

    // Función para alternar la expansión de detalles de una cita
    const toggleExpandirCita = (idCita) => {
        setCitaExpandidaId(citaExpandidaId === idCita ? null : idCita);
    };

    // Acción: Confirmar Solicitud usando idCita
    const handleConfirmar = async (citaId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(`http://localhost:8080/api/citas/${citaId}/confirmar`, {}, config);
            setMensaje({ tipo: 'exito', texto: 'Cita confirmada exitosamente. Se ha integrado a la agenda.' });
            cargarDatosPanel(); 
        } catch (error) {
            setMensaje({ tipo: 'error', texto: 'No se pudo confirmar la cita.' });
        }
    };

    // Acción: Rechazar / Cancelar Solicitud usando idCita
    const handleCancelar = async (citaId) => {
        if (!window.confirm('¿Está seguro de que desea rechazar o cancelar esta cita?')) return;
        
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.delete(`http://localhost:8080/api/citas/${citaId}`, config);
            setMensaje({ tipo: 'exito', texto: 'Cita cancelada/rechazada con éxito.' });
            cargarDatosPanel(); 
        } catch (error) {
            setMensaje({ tipo: 'error', texto: 'No se pudo procesar la cancelación.' });
        }
    };

    // Helper para formatear la hora
    const formatearHora = (fechaHoraString) => {
        const fechaObj = new Date(fechaHoraString);
        return fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' hrs';
    };

    return (
        <div className="max-w-6xl mx-auto mt-8 p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Encabezado Principal */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Panel de Control Médico</h1>
                    <p className="text-sm text-gray-500">Gestión dinámica basada en tu sesión activa.</p>
                </div>
                <button 
                    onClick={cargarDatosPanel}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors"
                >
                    Sincronizar Panel
                </button>
            </div>

            {/* Banner de Notificaciones */}
            {mensaje.texto && (
                <div className={`p-4 rounded-lg text-sm font-medium shadow-sm border ${
                    mensaje.tipo === 'exito' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                    {mensaje.texto}
                </div>
            )}

            {/* 1. SECCIÓN DE SOLICITUDES PENDIENTES */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                    Solicitudes por Confirmar
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">
                        {solicitudes.length}
                    </span>
                </h2> 

                {solicitudes.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                        No tienes solicitudes pendientes por el momento.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="p-3">Paciente</th>
                                    <th className="p-3">Contacto</th>
                                    <th className="p-3">Fecha y Hora Propuesta</th>
                                    <th className="p-3">Motivo</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {solicitudes.map((sol) => (
                                    <React.Fragment key={sol.idCita}>
                                        {/* Fila Principal (Interactiva al hacer clic en cualquier lado para expandir) */}
                                        <tr 
                                            className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                                            onClick={() => toggleExpandirCita(sol.idCita)}
                                        >
                                            <td className="p-3 font-semibold text-gray-800">
                                                {sol.paciente?.nombre} {sol.paciente?.apellidos}
                                                <span className="block text-xs font-normal text-gray-400">
                                                    Nac: {sol.paciente?.fechaNacimiento || 'No especificada'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="block text-gray-700 font-medium">📱 {sol.paciente?.telefono}</span>
                                                {sol.paciente?.correo && <span className="block text-xs text-gray-400">✉️ {sol.paciente?.correo}</span>}
                                            </td>
                                            <td className="p-3 text-gray-700 font-medium">
                                                📅 {sol.fechaHora.split('T')[0]} <br/>
                                                ⏰ {formatearHora(sol.fechaHora)}
                                            </td>
                                            <td className="p-3 text-gray-600 max-w-xs truncate" title={sol.motivo}>
                                                {sol.motivo}
                                            </td>
                                            <td className="p-3 text-center space-x-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleConfirmar(sol.idCita)}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded-md text-xs transition-colors shadow-xs"
                                                >
                                                    Confirmar
                                                </button>
                                                <button
                                                    onClick={() => handleCancelar(sol.idCita)}
                                                    className="bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-1.5 px-3 rounded-md text-xs transition-colors"
                                                >
                                                    Rechazar
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Fila Desplegable con Todos los Datos Ampliados */}
                                        {citaExpandidaId === sol.idCita && (
                                            <tr className="bg-blue-50/40">
                                                <td colSpan="5" className="p-4 border-t border-b border-blue-100">
                                                    <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-xs space-y-3">
                                                        <h4 className="text-sm font-bold text-blue-900 border-b pb-1.5 border-blue-50 flex justify-between">
                                                            <span>Información Detallada de la Solicitud</span>
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-sm uppercase font-mono">ID Cita: #{sol.idCita}</span>
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                            <div>
                                                                <p className="font-semibold text-gray-500 uppercase tracking-wider">Datos Personales</p>
                                                                <p className="text-sm font-medium text-gray-800 mt-1">Nombre: {sol.paciente?.nombre} {sol.paciente?.apellidos}</p>
                                                                <p className="text-sm font-medium text-gray-800">Cumpleaños: {sol.paciente?.fechaNacimiento}</p>
                                                                <p className="text-sm font-medium text-gray-800">ID Paciente: #{sol.paciente?.idPaciente}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-500 uppercase tracking-wider">Contacto Directo</p>
                                                                <p className="text-sm font-medium text-gray-800 mt-1">Teléfono: {sol.paciente?.telefono}</p>
                                                                <p className="text-sm font-medium text-gray-800">E-mail: {sol.paciente?.correo || 'No registrado'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-500 uppercase tracking-wider">Estado de Gestión</p>
                                                                <p className="text-sm font-medium text-gray-800 mt-1">Estatus Actual: <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-sm text-2xs">{sol.estado}</span></p>
                                                                <p className="text-sm font-medium text-gray-800">Fecha Registro Cita: {sol.fechaHora}</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-50 p-2.5 rounded text-xs border border-gray-100 mt-1">
                                                            <p className="font-semibold text-gray-600">Motivo Completo de la Consulta:</p>
                                                            <p className="text-gray-700 mt-0.5 italic">"{sol.motivo}"</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 2. SECCIÓN DE AGENDA DINÁMICA DIARIA */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Agenda Dinámica de Consultas</h2>
                        <p className="text-xs text-gray-400">Citas confirmadas del día.</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-600 uppercase">Ver Día:</label>
                        <input 
                            type="date" 
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={fechaFiltro}
                            onChange={(e) => setFechaFiltro(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <p className="text-sm text-gray-500 text-center py-6 animate-pulse">Cargando agenda...</p>
                ) : citasAgendadas.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500 font-medium">No hay citas confirmadas programadas para el {fechaFiltro}.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {citasAgendadas.map((cita) => (
                            <div key={cita.idCita} className="space-y-2">
                                <div 
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white border border-l-4 border-l-blue-600 border-gray-200 rounded-lg shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                                    onClick={() => toggleExpandirCita(cita.idCita)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-50 text-blue-700 font-bold px-3 py-2 rounded-lg text-center min-w-[80px]">
                                            <span className="block text-xs uppercase tracking-wider text-blue-500 font-semibold">Hora</span>
                                            <span className="text-sm">{formatearHora(cita.fechaHora).replace(' hrs', '')}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">
                                                {cita.paciente?.nombre} {cita.paciente?.apellidos}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                <span className="font-medium text-gray-600">Motivo:</span> {cita.motivo}
                                            </p>
                                            <div className="flex gap-4 mt-1 text-xs text-gray-400">
                                                <span>📱 {cita.paciente?.telefono}</span>
                                                <span>🎂 {cita.paciente?.fechaNacimiento}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleCancelar(cita.idCita); }}
                                        className="mt-3 sm:mt-0 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md border border-transparent hover:border-red-150 transition-colors"
                                    >
                                        Cancelar Cita
                                    </button>
                                </div>

                                {/* Ampliación de información para la agenda diaria */}
                                {citaExpandidaId === cita.idCita && (
                                    <div className="bg-white p-4 rounded-lg border border-l-4 border-l-blue-400 border-gray-200 text-xs space-y-2 mx-1 shadow-inner animate-fadeIn">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <p><strong>Correo del Paciente:</strong> {cita.paciente?.correo || 'No proporcionado'}</p>
                                            <p><strong>Identificador del Registro:</strong> Cita #{cita.idCita} / Paciente #{cita.paciente?.idPaciente}</p>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <p className="font-semibold text-gray-600">Detalles clínicos o motivo:</p>
                                            <p className="text-gray-700">{cita.motivo}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PanelDoctor;