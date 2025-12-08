import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button/Button";
import { Navbar } from "../layout/Navbar";
import { registerUser } from "../services/authService";
import comboPerroImage from "../assets/img/combo_perro.jpeg";
import comboHamburguesaImage from "../assets/img/combo_hamburguesa.webp";

const initialFormState = {
  firstName: "",
  secondName: "",
  firstLastName: "",
  secondLastName: "",
  documentType: "Cedula",
  documentNumber: "",
  email: "",
  birthDate: "",
};

const InputField = ({ label, required, ...rest }) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
    <span className="flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </span>
    <input
      className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
      required={required}
      {...rest}
    />
  </label>
);

const Register = () => {
  const [form, setForm] = useState(initialFormState);
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
      const fullName = [
        form.firstName,
        form.secondName,
        form.firstLastName,
        form.secondLastName,
      ]
        .filter(Boolean)
        .join(" ");

      await registerUser({
        correo: form.email,
        nombre: fullName,
        contrasena: form.documentNumber,
        rol: "CLIENTE",
      });
      setFeedback({
        type: "success",
        message: "Usuario registrado correctamente. Puedes iniciar sesión ahora.",
      });
      setForm(initialFormState);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.mensaje ||
          "No se pudo completar el registro. Intenta nuevamente.",
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
        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-[32px] shadow-2xl px-8 py-10">
            <h1 className="text-center text-3xl font-bold text-gray-900 mb-8">
              Registro
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

            <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
              <InputField
                label="Primer Nombre"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Primer Nombre"
                required
              />
              <InputField
                label="Segundo Nombre"
                name="secondName"
                value={form.secondName}
                onChange={handleChange}
                placeholder="Segundo Nombre"
              />

              <InputField
                label="Primer Apellido"
                name="firstLastName"
                value={form.firstLastName}
                onChange={handleChange}
                placeholder="Primer Apellido"
                required
              />
              <InputField
                label="Segundo Apellido"
                name="secondLastName"
                value={form.secondLastName}
                onChange={handleChange}
                placeholder="Segundo Apellido"
              />

              <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                Tipo Documento
                <select
                  name="documentType"
                  value={form.documentType}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Cedula">Cédula</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Cedula extranjeria">Cédula de extranjería</option>
                </select>
              </label>

              <InputField
                label="Número de Documento"
                name="documentNumber"
                value={form.documentNumber}
                onChange={handleChange}
                placeholder="Número de Documento"
                required
              />

              <InputField
                label="Correo"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@gmail.com"
              />

              <InputField
                label="Fecha de Nacimiento"
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleChange}
                placeholder="dd/mm/aaaa"
              />

              <div className="md:col-span-2 pt-2">
                <Button
                  fullWidth
                  size="lg"
                  variant="dark"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "Registrar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
