import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import CommonDataSection from './components/CommonDataSection.jsx'
import { OctopusTariffCard, UserTariffCard } from './components/TariffCards.jsx'
import Results from './components/Results.jsx'
import Toast from './components/Toast.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'
import {
  TARIFA_OCTOPUS_RELAX,
  VALORES_FIJOS,
  TIPO_TARIFA,
  calcularComparativa,
  calcularTarifa,
  toNumber,
  validarNumeros,
} from './utils/calculations.js'

const DEFAULT_FORM = {
  consumo: '300',
  dias: '30',
  p1: '3.45',
  p2: '3.45',

  precioP1B: '0.093',
  precioP2B: '0.093',
  precioEnergiaB: '0.1154',
  cuotaFijaB: '0',

  tipoTarifaB: TIPO_TARIFA.FIJA,

  consumoPuntaB: '',
  consumoLlanoB: '',
  consumoValleB: '',

  precioEnergiaPuntaB: '',
  precioEnergiaLlanoB: '',
  precioEnergiaValleB: '',
}

const URL_PARAM_TO_FIELD = {
  consumo: 'consumo',
  dias: 'dias',
  p1: 'p1',
  p2: 'p2',

  precio_p1_b: 'precioP1B',
  precio_p2_b: 'precioP2B',
  precio_energia_b: 'precioEnergiaB',
  cuota_fija_b: 'cuotaFijaB',

  tipo_tarifa_b: 'tipoTarifaB',

  consumo_punta_b: 'consumoPuntaB',
  consumo_llano_b: 'consumoLlanoB',
  consumo_valle_b: 'consumoValleB',

  precio_energia_punta_b: 'precioEnergiaPuntaB',
  precio_energia_llano_b: 'precioEnergiaLlanoB',
  precio_energia_valle_b: 'precioEnergiaValleB',
}

function getInitialForm() {
  if (typeof window === 'undefined') return DEFAULT_FORM

  const params = new URLSearchParams(window.location.search)
  const initialForm = { ...DEFAULT_FORM }

  Object.entries(URL_PARAM_TO_FIELD).forEach(([paramName, fieldName]) => {
    if (params.has(paramName)) {
      initialForm[fieldName] = params.get(paramName) ?? DEFAULT_FORM[fieldName]
    }
  })

  return initialForm
}

function parseForm(form) {
  const tipoTarifaB =
    form.tipoTarifaB === TIPO_TARIFA.TRAMOS
      ? TIPO_TARIFA.TRAMOS
      : TIPO_TARIFA.FIJA

  return {
    tipoTarifaB,

    consumo: toNumber(form.consumo),
    dias: toNumber(form.dias),
    p1: toNumber(form.p1),
    p2: toNumber(form.p2),

    precioP1B: toNumber(form.precioP1B),
    precioP2B: toNumber(form.precioP2B),
    precioEnergiaB: toNumber(form.precioEnergiaB),
    cuotaFijaB: toNumber(form.cuotaFijaB),

    consumoPuntaB: toNumber(form.consumoPuntaB),
    consumoLlanoB: toNumber(form.consumoLlanoB),
    consumoValleB: toNumber(form.consumoValleB),

    precioEnergiaPuntaB: toNumber(form.precioEnergiaPuntaB),
    precioEnergiaLlanoB: toNumber(form.precioEnergiaLlanoB),
    precioEnergiaValleB: toNumber(form.precioEnergiaValleB),
  }
}

export default function App() {
  const [form, setForm] = useState(getInitialForm)
  const [fixedValuesOpen, setFixedValuesOpen] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const resultsRef = useRef(null)

  const latestComparison = useMemo(() => results?.comparison ?? null, [results])

  function handleInputChange(fieldName, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value,
    }))
  }

  function calculate(nextForm = form, shouldScroll = true) {
    setError('')

    const numericForm = parseForm(nextForm)

    const valoresAValidar = [
      numericForm.dias,
      numericForm.p1,
      numericForm.p2,
      numericForm.precioP1B,
      numericForm.precioP2B,
      numericForm.cuotaFijaB,
    ]

    if (numericForm.tipoTarifaB === TIPO_TARIFA.FIJA) {
      valoresAValidar.push(numericForm.consumo, numericForm.precioEnergiaB)
    }

    if (numericForm.tipoTarifaB === TIPO_TARIFA.TRAMOS) {
      valoresAValidar.push(
        numericForm.consumoPuntaB,
        numericForm.consumoLlanoB,
        numericForm.consumoValleB,
        numericForm.precioEnergiaPuntaB,
        numericForm.precioEnergiaLlanoB,
        numericForm.precioEnergiaValleB,
      )
    }

    if (!validarNumeros(valoresAValidar) || numericForm.dias < 1) {
      setResults(null)
      setError(
        'Por favor, introduce valores numéricos válidos. Los importes no pueden ser negativos y los días deben ser al menos 1.',
      )
      return
    }

    const consumoTotalComparado =
      numericForm.tipoTarifaB === TIPO_TARIFA.TRAMOS
        ? numericForm.consumoPuntaB +
          numericForm.consumoLlanoB +
          numericForm.consumoValleB
        : numericForm.consumo

    const baseValues = {
      dias: numericForm.dias,
      p1: numericForm.p1,
      p2: numericForm.p2,
      bonoSocialDia: VALORES_FIJOS.bonoSocialDia,
      alquilerEquiposDia: VALORES_FIJOS.alquilerEquiposDia,
      iva: VALORES_FIJOS.iva,
      impuestoElectrico: VALORES_FIJOS.impuestoElectrico,
    }

    const octopus = calcularTarifa({
      ...baseValues,
      tipoTarifa: TIPO_TARIFA.FIJA,
      consumo: consumoTotalComparado,
      precioP1: TARIFA_OCTOPUS_RELAX.precioP1,
      precioP2: TARIFA_OCTOPUS_RELAX.precioP2,
      precioEnergia: TARIFA_OCTOPUS_RELAX.precioEnergia,
      cuotaFija: TARIFA_OCTOPUS_RELAX.cuotaFija,
    })

    const usuario = calcularTarifa({
      ...baseValues,
      tipoTarifa: numericForm.tipoTarifaB,

      consumo: consumoTotalComparado,

      consumoPunta: numericForm.consumoPuntaB,
      consumoLlano: numericForm.consumoLlanoB,
      consumoValle: numericForm.consumoValleB,

      precioP1: numericForm.precioP1B,
      precioP2: numericForm.precioP2B,

      precioEnergia: numericForm.precioEnergiaB,

      precioEnergiaPunta: numericForm.precioEnergiaPuntaB,
      precioEnergiaLlano: numericForm.precioEnergiaLlanoB,
      precioEnergiaValle: numericForm.precioEnergiaValleB,

      cuotaFija: numericForm.cuotaFijaB,
    })

    const comparison = calcularComparativa(octopus, usuario)
    setResults({ octopus, usuario, comparison })

    if (shouldScroll) {
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      })
    }
  }

  const params = new URLSearchParams({
    consumo: form.consumo,
    dias: form.dias,
    p1: form.p1,
    p2: form.p2,

    precio_p1_b: form.precioP1B,
    precio_p2_b: form.precioP2B,
    precio_energia_b: form.precioEnergiaB,
    cuota_fija_b: form.cuotaFijaB,

    tipo_tarifa_b: form.tipoTarifaB,

    consumo_punta_b: form.consumoPuntaB,
    consumo_llano_b: form.consumoLlanoB,
    consumo_valle_b: form.consumoValleB,

    precio_energia_punta_b: form.precioEnergiaPuntaB,
    precio_energia_llano_b: form.precioEnergiaLlanoB,
    precio_energia_valle_b: form.precioEnergiaValleB,
  })

  function showToast(message) {
    setToastMessage(message)
    setToastVisible(true)

    window.setTimeout(() => {
      setToastVisible(false)
    }, 3000)
  }

  function shareWhatsApp() {
    if (!latestComparison) return

    const ahorro = latestComparison.diferenciaAbsoluta
    const porcentaje = latestComparison.diferenciaRelativa
    const url = generateUrlWithParams()
    const message =
      `🐙 ¡Puedo ahorrar ${ahorro.toFixed(2)}€/mes (${porcentaje.toFixed(2)}%) cambiándome a Octopus Relax!\n\n` +
      `Comprueba cuánto puedes ahorrar tú también:\n${url}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  async function copyLink() {
    const url = generateUrlWithParams()

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        showToast('Enlace copiado al portapapeles')
        return
      }

      const textArea = document.createElement('textarea')
      textArea.value = url
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const copied = document.execCommand('copy')
      document.body.removeChild(textArea)

      if (!copied) throw new Error('No se pudo copiar automáticamente.')
      showToast('Enlace copiado al portapapeles')
    } catch {
      window.alert(
        `No se pudo copiar automáticamente. Copia este enlace manualmente:\n\n${url}`,
      )
    }
  }

  useEffect(() => {
    calculate(getInitialForm(), false)
    // Sólo se ejecuta al cargar para imitar el comportamiento del HTML original.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Header />

      <main className="container">
        <ErrorMessage message={error} />

        <CommonDataSection
          form={form}
          onInputChange={handleInputChange}
          fixedValuesOpen={fixedValuesOpen}
          onToggleFixedValues={() => setFixedValuesOpen((current) => !current)}
        />

        <div className="tariffs-container">
          <OctopusTariffCard />
          <UserTariffCard form={form} onInputChange={handleInputChange} />
        </div>

        <button
          className="calculate-btn"
          type="button"
          onClick={() => calculate()}
        >
          Calcular Comparativa
        </button>

        <div ref={resultsRef}>
          <Results
            results={results}
            onShareWhatsApp={shareWhatsApp}
            onCopyLink={copyLink}
          />
        </div>
      </main>

      <Toast message={toastMessage} visible={toastVisible} />
    </>
  )
}
