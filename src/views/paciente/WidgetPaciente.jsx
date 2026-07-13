import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para capturar el ID del médico desde la URL
import axios from 'axios';

const WidgetPaciente = () => {
    // Capturar el id del médico desde la URL (ejemplo: /agendar/:medicoId)
    const { medicoId } = useParams();

    // Estados para la información personal del paciente
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(''); // <-- Nuevo estado para fecha de nacimiento
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    
    // Estados para los datos de la cita
    const [motivo, setMotivo] = useState('');
    const [fecha, setFecha] = useState('');
    const [horaSeleccionada, setHoraSeleccionada] = useState('');
    
    // Estados de UI
    const [horariosLibres, setHorariosLibres] = useState([]);
    const [loadingHorarios, setLoadingHorarios] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    // Consultar horarios disponibles cuando cambia la fecha de la cita
    useEffect(() => {
        if (!fecha) {
            setHorariosLibres([]);
            return;
        }

        const cargarHorariosDisponibles = async () => {
            setLoadingHorarios(true);
            setHoraSeleccionada('');
            try {
                const response = await axios.get(`http://localhost:8080/api/citas/horarios-disponibles`, {
                    params: { 
                        fecha: fecha,
                        medicoId: medicoId // Enviamos el médico para filtrar sus horarios específicos
                    }
                });
                setHorariosLibres(response.data);
            } catch (error) {
                console.error("Error al obtener horarios:", error);
                setMensaje({ tipo: 'error', texto: 'No se pudieron obtener los horarios para este día.' });
            } finally {
                setLoadingHorarios(false);
            }
        };

        cargarHorariosDisponibles();
    }, [fecha, medicoId]);

    // Manejar el envío de la solicitud
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que se llenen todos los campos 
        if (!nombre || !apellidos || !fechaNacimiento || !telefono || !fecha || !horaSeleccionada || !motivo) {
            setMensaje({ tipo: 'error', texto: 'Por favor, llena todos los campos obligatorios y selecciona una hora.' });
            return;
        }

        // Combinar fecha y hora para el formato LocalDateTime esperado por Spring Boot
        const fechaHoraIso = `${fecha}T${horaSeleccionada}:00`;

        // Construimos el DTO con los datos de contacto directos mapeados al Backend
        const citaPublicaRequestDTO = {
            medicoId: parseInt(medicoId), // El doctor que recibirá la solicitud
            nombrePaciente: nombre,
            apellidosPaciente: apellidos,
            fechaNacimiento: fechaNacimiento, // 
            telefonoPaciente: telefono,
            correoPaciente: correo,
            fechaHora: fechaHoraIso,
            motivo: motivo
        };

        try {
            // Petición al flujo público del backend
            await axios.post('http://localhost:8080/api/citas/solicitar', citaPublicaRequestDTO);
            
            setMensaje({ 
                tipo: 'exito', 
                texto: '¡Solicitud enviada con éxito! El consultorio del doctor revisará tu propuesta y recibirás una confirmación por WhatsApp en breve.' 
            });
            
            // Limpiar todo el formulario tras el éxito
            setNombre('');
            setApellidos('');
            setFechaNacimiento(''); //
            setTelefono('');
            setCorreo('');
            setMotivo('');
            setFecha('');
            setHoraSeleccionada('');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Hubo un problema al procesar tu solicitud de cita.';
            setMensaje({ tipo: 'error', texto: errorMsg });
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Agendar Cita Médica</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Completa tus datos para solicitar un espacio en la agenda del médico.</p>

            {mensaje.texto && (
                <div className={`p-4 mb-5 rounded-lg text-sm font-medium ${
                    mensaje.tipo === 'exito' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Sección de Información Personal */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">1. Tus Datos de Contacto</h3>
                    
                    {/* Campos de Nombres y Apellidos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre(s) *</label>
                            <input 
                                type="text" 
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-700 bg-white"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej. Juan"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Apellidos *</label>
                            <input 
                                type="text" 
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-700 bg-white"
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                                placeholder="Ej. Pérez López"
                            />
                        </div>
                    </div>

                    {/* Fila para Fecha de Nacimiento y Teléfono */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de Nacimiento *</label>
                            <input 
                                type="date" 
                                required
                                // Evita que seleccionen una fecha futura para su nacimiento
                                max={new Date().toISOString().split('T')[0]} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-700 bg-white"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Teléfono WhatsApp *</label>
                            <input 
                                type="tel" 
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-700 bg-white"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="Ej. 5512345678"
                            />
                        </div>
                    </div>

                    {/* Fila Completa para Correo */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Correo Electrónico (Opcional)</label>
                        <input 
                            type="email" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-700 bg-white"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="juan@ejemplo.com"
                        />
                    </div>
                </div>

                {/* Detalles de la Consulta */}
                <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">2. Detalles de la Cita</h3>
                    
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Motivo de la Consulta *</label>
                        <textarea
                            rows="2"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-700"
                            placeholder="Describe brevemente el motivo médico o síntomas..."
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Selecciona el Día de la Cita *</label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]} // Evita registrar días anteriores al actual
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-700"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                </div>

                {/* Cuadrícula de Botones de Horarios */}
                {fecha && (
                    <div className="pt-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            3. Horarios Disponibles para el {fecha} *
                        </label>

                        {loadingHorarios ? (
                            <p className="text-xs text-gray-500 animate-pulse">Buscando espacios libres en la agenda...</p>
                        ) : horariosLibres.length === 0 ? (
                            <p className="text-sm text-amber-600 font-medium bg-amber-50 p-3 rounded-lg">
                                No hay horarios disponibles para este día. Por favor, selecciona otra fecha.
                            </p>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {horariosLibres.map((hora) => (
                                    <button
                                        key={hora}
                                        type="button"
                                        className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all duration-150 ${
                                            horaSeleccionada === hora
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-95'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                        onClick={() => setHoraSeleccionada(hora)}
                                    >
                                        {hora} hrs
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Botón de Envío */}
                <button
                    type="submit"
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={!nombre || !apellidos || !fechaNacimiento || !telefono || !fecha || !horaSeleccionada || !motivo}
                >
                    Solicitar Cita Médica
                </button>
            </form>
        </div>
    );
};

export default WidgetPaciente;