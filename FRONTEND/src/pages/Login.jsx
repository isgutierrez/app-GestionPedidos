import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button/Button";
import { Navbar } from "../layout/Navbar";
import { loginUser } from "../services/authService";
import comboPerroImage from "../assets/img/combo_perro.jpeg";
import comboHamburguesaImage from "../assets/img/combo_hamburguesa.webp";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const { data } = await loginUser({
        correo: form.email,
        contrasena: form.password,
      });
      localStorage.setItem("authUser", JSON.stringify(data));
      setFeedback({
        type: "success",
        message: data?.mensaje || "Sesión iniciada correctamente.",
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.mensaje ||
          "Credenciales inválidas. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <section className="relative bg-[#20110b] text-white overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1/3 opacity-70 pointer-events-none">
          <img
            src={comboHamburguesaImage}
            alt="Combo"
            className="h-full w-full object-cover object-left"
          />
        </div>
        <div className="absolute inset-y-0 right-0 w-1/3 opacity-70 pointer-events-none">
          <img
            src={comboPerroImage}
            alt="Combo"
            className="h-full w-full object-cover object-right"
          />
        </div>

        <div className="relative max-w-xl mx-auto px-4 py-20">
          <div className="bg-white rounded-[32px] shadow-2xl px-8 py-12 text-gray-900">
            <h1 className="text-center text-3xl font-bold mb-6">
              Inicia sesión
            </h1>

            {feedback && (
              <div
                className={`mb-6 text-center rounded-2xl px-4 py-3 ${
                  feedback.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                Correo
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@gmail.com"
                  required
                  className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                Contraseña
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </label>

              <Button
                variant="dark"
                size="lg"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
