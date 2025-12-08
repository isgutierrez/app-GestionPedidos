import { useMemo, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button/Button';
import { useCart } from '../context/CartContext';
import { Navbar } from '../layout/Navbar';
import api from '../services/api';

const steps = [
  { label: 'Detalles del pedido' },
  { label: 'Datos' },
  { label: 'Pagos' }
];

const capitalize = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

const formatList = (list = []) =>
  list.length ? list.map(capitalize).join(', ') : 'Sin adicionales';

const buildCustomizationSummary = (customization = {}) => {
  if (!customization || typeof customization !== 'object') {
    return [];
  }

  const lines = [];

  if (customization.meat) {
    lines.push(`Carne seleccionada: ${capitalize(customization.meat)}`);
  }
  if (customization.sauce) {
    lines.push(`Salsa: ${capitalize(customization.sauce)}`);
  }
  if (Array.isArray(customization.extras)) {
    lines.push(`Adicionales: ${formatList(customization.extras)}`);
  }
  if (Array.isArray(customization.additions)) {
    lines.push(`Adiciones: ${formatList(customization.additions)}`);
  }

  return lines;
};

const buildPedidoPayload = (
  items,
  totalPrice,
  cliente,
  metodoPago,
  pagoLinea
) => ({
  total: totalPrice,
  cliente,
  metodoPago,
  pagoLinea,
  detalles: items.map((item) => ({
    productoId: item.productId ?? item.id,
    cantidad: item.quantity,
    precioUnitario: item.unitPrice,
    observaciones: buildCustomizationSummary(item.customization).join(' | ')
  }))
});

const FormInput = ({
  label,
  required,
  type = 'text',
  name,
  value,
  onChange,
  placeholder
}) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
    {label}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
    />
  </label>
);

const OrderSummary = ({ items, totalPrice }) => (
  <aside className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-fit space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Tu pedido</h3>
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.cartId} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center">
              {item.quantity}
            </span>
            <p className="text-sm text-gray-700">{item.title}</p>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {item.currency}
            {(item.unitPrice * item.quantity).toLocaleString('es-CO')}
          </p>
        </div>
      ))}
    </div>
    <hr className="my-4" />
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">Total</span>
      <span className="text-lg font-bold text-yellow-600">
        ${totalPrice.toLocaleString('es-CO')}
      </span>
    </div>
  </aside>
);

const Checkout = () => {
  const {
    items,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    paymentMethod: 'efectivo'
  });
  const [onlinePaymentOption, setOnlinePaymentOption] = useState('card');
  const [cardData, setCardData] = useState({
    cardType: 'visa',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [generatedOrderCode, setGeneratedOrderCode] = useState(null);

  const formattedTotal = useMemo(
    () => totalPrice.toLocaleString('es-CO'),
    [totalPrice]
  );

  const handleQuantityChange = (cartId, nextValue) => {
    updateQuantity(cartId, Math.max(1, nextValue));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (event) => {
    const { name, value } = event.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Por favor completa nombres y apellidos.');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Ingresa un número de celular.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Ingresa un correo electrónico.');
      return false;
    }
    return true;
  };

  const validateOnlinePayment = () => {
    if (onlinePaymentOption === 'pse') {
      return true;
    }

    if (!cardData.cardName.trim()) {
      setError('Ingresa el nombre en la tarjeta.');
      return false;
    }
    if (!cardData.cardNumber.trim()) {
      setError('Ingresa el número de la tarjeta.');
      return false;
    }
    if (!cardData.cardExpiry.trim()) {
      setError('Ingresa la fecha de expiración.');
      return false;
    }
    if (!cardData.cardCvv.trim()) {
      setError('Ingresa el CVV.');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!items.length) {
      setError('Tu carrito está vacío.');
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleSubmitOrder = async () => {
    if (currentStep === 1) {
      handleContinue();
      return;
    }

    if (currentStep === 2) {
      if (!validateForm()) {
        return;
      }

      setError(null);
      if (formData.paymentMethod === 'linea') {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
        setGeneratedOrderCode(
          Math.floor(100000 + Math.random() * 900000).toString()
        );
      }
      return;
    }

    if (!items.length) {
      setError('Tu carrito está vacío.');
      return;
    }

    if (formData.paymentMethod === 'linea' && !validateOnlinePayment()) {
      return;
    }

    if (formData.paymentMethod === 'efectivo') {
      setSuccess('Pedido pre-confirmado. Presenta el código en caja.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = buildPedidoPayload(
        items,
        totalPrice,
        {
          nombres: formData.firstName,
          apellidos: formData.lastName,
          telefono: formData.phone,
          email: formData.email
        },
        formData.paymentMethod,
        formData.paymentMethod === 'linea'
          ? {
              tipo: onlinePaymentOption,
              tarjeta:
                onlinePaymentOption === 'card'
                  ? {
                      emisor: cardData.cardType,
                      nombre: cardData.cardName,
                      numero: cardData.cardNumber,
                      expiracion: cardData.cardExpiry,
                      cvv: cardData.cardCvv
                    }
                  : null
            }
          : null
      );
      await api.post('pedidos', payload);
      setSuccess('¡Pedido registrado con éxito!');
      clearCart();
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      setError('No se pudo registrar el pedido. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToProducts = () => navigate('/');

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">Pago</h1>
          <div className="flex items-center justify-center gap-4 text-sm font-medium">
            {steps.map((step, index) => (
              <div className="flex items-center gap-4" key={step.label}>
                <div className="flex flex-col items-center">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep === index + 1
                        ? 'bg-red-600 text-white border-red-600'
                        : index + 1 < currentStep
                        ? 'bg-red-100 text-red-600 border-red-200'
                        : 'text-gray-400 border-gray-200'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`mt-2 ${
                      currentStep === index + 1
                        ? 'text-red-600'
                        : index + 1 < currentStep
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        {!items.length && !success && (
          <div className="bg-white p-8 rounded-3xl shadow text-center space-y-4">
            <p className="text-lg font-medium text-gray-700">
              Tu carrito está vacío.
            </p>
            <Button onClick={handleGoToProducts}>Explorar productos</Button>
          </div>
        )}

        {!!items.length && currentStep === 1 && (
          <>
            <section className="space-y-4">
              {items.map((item) => {
                const summary = buildCustomizationSummary(item.customization);
                return (
                  <article
                    key={item.cartId}
                    className="flex gap-4 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <div className="text-sm text-gray-500 space-y-1">
                        {summary.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:text-gray-900"
                        onClick={() =>
                          handleQuantityChange(item.cartId, item.quantity - 1)
                        }
                      >
                        –
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:text-gray-900"
                        onClick={() =>
                          handleQuantityChange(item.cartId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {item.currency}
                        {(item.unitPrice * item.quantity).toLocaleString('es-CO')}
                      </p>
                      <button
                        className="text-red-500 text-sm font-medium flex items-center gap-1 mt-2"
                        onClick={() => removeItem(item.cartId)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <footer className="bg-white rounded-3xl shadow px-6 py-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-600">
                  Total
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ${formattedTotal}
                </span>
              </div>
              <Button
                fullWidth
                size="lg"
                variant="dark"
                onClick={handleSubmitOrder}
                disabled={submitting}
              >
                {submitting ? 'Procesando...' : 'Continuar'}
              </Button>
            </footer>
          </>
        )}

        {!!items.length && currentStep === 2 && (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <section className="bg-white rounded-3xl shadow p-8 space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  label="Nombres *"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Nombres"
                />
                <FormInput
                  label="Apellidos *"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Apellidos"
                />
                <FormInput
                  label="Número de celular"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Número de celular"
                />
                <FormInput
                  label="Correo electrónico"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@email.com"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Selecciona el método de pago
                </p>
                <div className="space-y-3">
                  {[
                    { value: 'efectivo', label: 'Pago en efectivo' },
                    { value: 'linea', label: 'Pago en línea' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center justify-between border rounded-2xl px-4 py-3 cursor-pointer transition ${
                        formData.paymentMethod === option.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            formData.paymentMethod === option.value
                              ? 'border-red-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {formData.paymentMethod === option.value && (
                            <span className="w-2 h-2 rounded-full bg-red-600" />
                          )}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {option.label}
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={formData.paymentMethod === option.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <Button
                  fullWidth
                  size="lg"
                  variant="dark"
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                >
                  {submitting ? 'Procesando...' : 'Continuar'}
                </Button>
              </div>
            </section>

            <OrderSummary items={items} totalPrice={totalPrice} />
          </div>
        )}

        {!!items.length && currentStep === 3 && (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-6">
              <div className="bg-white rounded-3xl shadow p-6 space-y-4">
                <p className="text-lg font-semibold text-gray-900">
                  Pago en línea
                </p>
                <div className="space-y-3">
                  {[
                    { value: 'card', label: 'Pago con tarjeta' },
                    { value: 'pse', label: 'Pago con PSE' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center justify-between border rounded-2xl px-4 py-3 cursor-pointer transition ${
                        onlinePaymentOption === option.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            onlinePaymentOption === option.value
                              ? 'border-red-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {onlinePaymentOption === option.value && (
                            <span className="w-2 h-2 rounded-full bg-red-600" />
                          )}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {option.label}
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="onlinePayment"
                        value={option.value}
                        checked={onlinePaymentOption === option.value}
                        onChange={(event) =>
                          setOnlinePaymentOption(event.target.value)
                        }
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {onlinePaymentOption === 'card' ? (
                <div className="bg-red-600 rounded-3xl p-6 text-white space-y-5 shadow-lg">
                  <header className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">
                        Pago con tarjeta de crédito
                      </p>
                      <p className="text-sm text-red-100">
                        Ingresa los datos de tu tarjeta
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                        MasterCard
                      </span>
                      <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                        Visa
                      </span>
                    </div>
                  </header>

                  <label className="flex flex-col text-sm gap-1 font-medium text-red-50">
                    Tipo de tarjeta
                    <select
                      name="cardType"
                      value={cardData.cardType}
                      onChange={handleCardChange}
                      className="rounded-2xl px-4 py-2 text-gray-900"
                    >
                      <option value="visa">Visa</option>
                      <option value="mastercard">MasterCard</option>
                    </select>
                  </label>

                  <label className="flex flex-col text-sm gap-1 font-medium text-red-50">
                    Nombre en la tarjeta
                    <input
                      type="text"
                      name="cardName"
                      value={cardData.cardName}
                      onChange={handleCardChange}
                      placeholder="Nombre completo"
                      className="rounded-2xl px-4 py-2 text-gray-900"
                    />
                  </label>

                  <label className="flex flex-col text-sm gap-1 font-medium text-red-50">
                    Número de la tarjeta
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1111 2222 3333 4444"
                      className="rounded-2xl px-4 py-2 text-gray-900"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col text-sm gap-1 font-medium text-red-50">
                      Fecha de expiración
                      <input
                        type="text"
                        name="cardExpiry"
                        value={cardData.cardExpiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        className="rounded-2xl px-4 py-2 text-gray-900"
                      />
                    </label>
                    <label className="flex flex-col text-sm gap-1 font-medium text-red-50">
                      CVV
                      <input
                        type="password"
                        name="cardCvv"
                        value={cardData.cardCvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        className="rounded-2xl px-4 py-2 text-gray-900"
                      />
                    </label>
                  </div>

                  <div className="bg-white rounded-2xl p-4 text-gray-800 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${(totalPrice * 0.81).toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (19%)</span>
                      <span>${(totalPrice * 0.19).toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
                      <span>Total</span>
                      <span>${formattedTotal}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow p-6 space-y-6 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-lg font-semibold text-gray-900">
                      Pago con PSE
                    </p>
                    <div className="w-36 h-36 rounded-full flex items-center justify-center border-4 border-blue-100">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/8/8c/PSE_Logo.png"
                        alt="Logo PSE"
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Estamos procesando la transacción en la pasarela segura de
                    PSE. No cierres esta ventana hasta que el proceso finalice.
                  </p>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-blue-500 to-blue-300 animate-pulse" />
                    </div>
                    <p className="text-xs text-gray-400">
                      Estamos procesando la transacción
                    </p>
                  </div>
                </div>
              )}

              <Button
                fullWidth
                size="lg"
                variant="dark"
                onClick={handleSubmitOrder}
                disabled={submitting}
              >
                {submitting ? 'Procesando...' : 'Pagar'}
              </Button>
            </section>

            <OrderSummary items={items} totalPrice={totalPrice} />
          </div>
        )}

        {!!items.length && currentStep === 4 && (
          <div className="flex flex-col items-center gap-8">
            <div className="bg-white rounded-3xl shadow-2xl px-10 py-12 text-center space-y-4 max-w-xl">
              <h2 className="text-2xl font-bold text-gray-900">
                ¡Pedido pre-confirmado!
              </h2>
              <p className="text-gray-600">
                Por favor, acércate a la caja para realizar el pago del pedido
                con el siguiente número de orden y confirmarlo.
              </p>
              <div className="text-gray-900">
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  No. Orden
                </p>
                <p className="text-4xl font-bold">{generatedOrderCode}</p>
              </div>
            </div>
            <Button size="lg" onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
