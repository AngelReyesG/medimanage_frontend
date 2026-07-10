import API from "../api/axios"; // Asegúrate de apuntar a tu instancia configurada de Axios

export const PacienteService = {
  // Obtener todos los pacientes
  getAll: async () => {
    const response = await API.get("/api/pacientes");
    return response.data;
  },

  // Buscar un paciente por ID
  getById: async (id) => {
    const response = await API.get(`/api/pacientes/${id}`);
    return response.data;
  },

  // Registrar un nuevo paciente
  crear: async (pacienteData) => {
    const response = await API.post("/api/pacientes", pacienteData);
    return response.data;
  },

  // Actualizar datos del paciente
  actualizar: async (id, pacienteData) => {
    const response = await API.put(`/api/pacientes/${id}`, pacienteData);
    return response.data;
  },

  // Eliminar (o dar de baja) un paciente
  eliminar: async (id) => {
    const response = await API.delete(`/api/pacientes/${id}`);
    return response.data;
  }
};