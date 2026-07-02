import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function Login() {
    const [credentials, setCredentials] = useState({email: "", password: ""})
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const response = await API.post('/api/auth/login', credentials)
            const token = response.data.token; 

            if(token) {
                localStorage.setItem("token", token)
                console.log("¡Login exitoso! Token guardado.")
                navigate("/dashboard")
            }
        } catch (err) {
            console.error(err)
            setError("Credenciales inválidas o error de conexión con el servidor.")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-950">
            MediManage
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Ingresa a tu panel de control médico
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Usuario</label>
              <input
                name="email"
                type="email"
                required
                className="relative block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="ejemplo_medico"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Contraseña</label>
              <input
                name="password"
                type="password"
                required
                className="relative block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
    )
}

export default Login