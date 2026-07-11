import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import API from "../services/api";
import ModalCita from "../components/ModalCita";
import ModalDetalleCita from "../components/ModalDetalleCita";

function Citas() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombreMedico, setNombreMedico] = useState("");
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const obtenerCitas = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/citas");
      
      const citasMapeadas = response.data.map((cita) => {
        let backgroundColor = "#3b82f6"; 
        if (cita.estado === "COMPLETADA") backgroundColor = "#10b981"; 
        if (cita.estado === "CANCELADA") backgroundColor = "#ef4444"; 

        if (cita.usuario && !nombreMedico) {
          setNombreMedico(`${cita.usuario.nombre} ${cita.usuario.apellido || ""}`);
        }

        return {
          id: cita.idCita,
          start: cita.fechaHora, 
          title: `${cita.paciente?.nombre || "Paciente"} - ${cita.motivo}`,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          extendedProps: {
            estado: cita.estado,
            paciente: `${cita.paciente?.nombre || ""} ${cita.paciente?.apellido || cita.paciente?.apellidos || ""}`,
            // ADICIÓN: Mapeamos el id del paciente para vincularlo al Selector del ModalCita
            pacienteId: cita.paciente?.idPaciente || "",
            motivo: cita.motivo
          }
        };
      });

      setEvents(citasMapeadas);
      setError("");
    } catch (err) {
      console.error("Error al obtener citas para el calendario:", err);
      setError("No se pudo sincronizar la agenda médica.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCitas();
    
    const usuarioLogueado = localStorage.getItem("usuario"); 
    if (usuarioLogueado) {
      const user = JSON.parse(usuarioLogueado);
      setNombreMedico(`${user.nombre} ${user.apellido || ""}`);
    }
  }, []);

  const handleEventClick = (info) => {
    const { paciente, estado, motivo, pacienteId } = info.event.extendedProps;

    setCitaSeleccionada({
      id: info.event.id,
      start: info.event.startStr,
      paciente,
      pacienteId, // Pasamos el ID al estado de selección
      estado,
      motivo
    });

    setIsDetalleOpen(true);
  };

  // ADICIÓN: Función puente para abrir el ModalCita en modo edición
  const handleGestionarCita = () => {
    setIsDetalleOpen(false); // Cierra la vista de detalle
    setIsModalOpen(true);    // Abre el formulario de edición
  };

  // ADICIÓN: Limpieza de estados al cerrar el formulario de creación/edición
  const handleCloseModalCita = () => {
    setIsModalOpen(false);
    setCitaSeleccionada(null); // Evita que se quede el registro pegado
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Agenda Médica {nombreMedico && <span className="text-blue-600 font-medium">| Dr. {nombreMedico}</span>}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">Consulta y gestiona tus horarios de consultas en tiempo real.</p>
        </div>
        <button
          onClick={() => {
            setCitaSeleccionada(null); // Asegura modo creación
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors w-full sm:w-auto text-center"
        >
          + Agendar Cita
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm font-medium">
            Sincronizando agenda interactiva...
          </div>
        ) : (
          <div className="prose max-w-none">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "", 
                right: "dayGridMonth,timeGridWeek,timeGridDay"
              }}
              locale="es"
              buttonText={{
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día"
              }}
              events={events}
              eventClick={handleEventClick}
              editable={false}
              selectable={true}
              slotMinTime="07:00:00"
              slotMaxTime="21:00:00"
              allDaySlot={false}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                meridiem: false,
                hour12: false
              }}
              height="auto"
            />
          </div>
        )}
      </div>

      {/* CORRECCIÓN: Vinculación de props de edición y control de cierre */}
      <ModalCita
        isOpen={isModalOpen}
        onClose={handleCloseModalCita}
        onCitaCreada={obtenerCitas}
        citaAEditar={citaSeleccionada} 
      />

      {/* CORRECCIÓN: Conexión de la función onGestionar */}
      <ModalDetalleCita
        isOpen={isDetalleOpen}
        onClose={() => setIsDetalleOpen(false)}
        cita={citaSeleccionada}
        onGestionar={handleGestionarCita} 
      />
      
    </div>
  );
}

export default Citas;