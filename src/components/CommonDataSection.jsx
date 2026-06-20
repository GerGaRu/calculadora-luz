import InputField from './InputField.jsx'
import SectionHeader from './SectionHeader.jsx'
import FixedValuesToggle from './FixedValuesToggle.jsx'
import { TIPO_TARIFA } from '../utils/calculations.js'

export default function CommonDataSection({
  form,
  onInputChange,
  fixedValuesOpen,
  onToggleFixedValues,
}) {
  const isTarifaPorTramos = form.tipoTarifaB === TIPO_TARIFA.TRAMOS

  return (
    <section className="section">
      <SectionHeader icon="📊" title="Datos sobre tu consumo del mes" />

      <div className="input-grid">
        {isTarifaPorTramos ? (
          <div className="info-box info-box-full">
            Has elegido una tarifa por tramos. En este caso, el consumo total se
            calculará sumando el consumo en punta, llano y valle que introduzcas
            en “Tu Tarifa Actual”.
          </div>
        ) : (
          <InputField
            id="consumo"
            label="Consumo estimado (kWh/mes)"
            value={form.consumo}
            step="1"
            min="0"
            placeholder="Ej: 300"
            onChange={onInputChange}
          />
        )}

        <InputField
          id="dias"
          label="Número de días del periodo"
          value={form.dias}
          step="1"
          min="1"
          placeholder="Ej: 30"
          onChange={onInputChange}
        />

        <InputField
          id="p1"
          label="Potencia contratada P1 (kW)"
          value={form.p1}
          step="0.01"
          min="0"
          placeholder="Ej: 3.45"
          onChange={onInputChange}
        />

        <InputField
          id="p2"
          label="Potencia contratada P2 (kW)"
          value={form.p2}
          step="0.01"
          min="0"
          placeholder="Ej: 3.45"
          onChange={onInputChange}
        />
      </div>

      <FixedValuesToggle
        isOpen={fixedValuesOpen}
        onToggle={onToggleFixedValues}
      />
    </section>
  )
}
