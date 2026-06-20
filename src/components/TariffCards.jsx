import FixedItem from './FixedItem.jsx'
import InputField from './InputField.jsx'
import { TARIFA_OCTOPUS_RELAX } from '../utils/calculations.js'

export function OctopusTariffCard() {
  return (
    <article className="tariff-card tariff-a">
      <h2>
        Tarifa de Octopus Relax (sin IVA)
        <span className="tariff-badge badge-a">Predefinida</span>
      </h2>

      <div className="fixed-values">
        <h3>Valores Predefinidos</h3>
        <div className="fixed-grid">
          <FixedItem
            label="Precio potencia P1"
            value={`${TARIFA_OCTOPUS_RELAX.precioP1.toFixed(3)} €/kW/día`}
          />
          <FixedItem
            label="Precio potencia P2"
            value={`${TARIFA_OCTOPUS_RELAX.precioP2.toFixed(3)} €/kW/día`}
          />
          <FixedItem
            label="Precio energía"
            value={`${TARIFA_OCTOPUS_RELAX.precioEnergia.toFixed(3)} €/kWh`}
          />
          <FixedItem
            label="Cuota fija"
            value={`${TARIFA_OCTOPUS_RELAX.cuotaFija} €/mes`}
          />
        </div>
      </div>
    </article>
  )
}

export function UserTariffCard({ form, onInputChange }) {
  const isTarifaPorTramos = form.tipoTarifaB === 'tramos'

  return (
    <article className="tariff-card tariff-b">
      <h2>
        Tu Tarifa Actual (sin IVA)
        <span className="tariff-badge badge-b">Personalizada</span>
      </h2>

      <div className="tariff-type-tabs">
        <button
          type="button"
          className={
            form.tipoTarifaB === 'fija' ? 'tariff-tab active' : 'tariff-tab'
          }
          onClick={() => onInputChange('tipoTarifaB', 'fija')}
        >
          Precio fijo 24h
        </button>

        <button
          type="button"
          className={
            form.tipoTarifaB === 'tramos' ? 'tariff-tab active' : 'tariff-tab'
          }
          onClick={() => onInputChange('tipoTarifaB', 'tramos')}
        >
          Precio por tramos
        </button>
      </div>

      <div className="input-grid">
        <InputField
          id="precioP1B"
          label="Precio potencia P1 (€/kW/día)"
          value={form.precioP1B}
          step="0.001"
          min="0"
          placeholder="Ej: 0.097"
          onChange={onInputChange}
        />

        <InputField
          id="precioP2B"
          label="Precio potencia P2 (€/kW/día)"
          value={form.precioP2B}
          step="0.001"
          min="0"
          placeholder="Ej: 0.027"
          onChange={onInputChange}
        />

        {isTarifaPorTramos ? (
          <>
            <InputField
              id="consumoPuntaB"
              label="Consumo punta (kWh)"
              value={form.consumoPuntaB}
              step="1"
              min="0"
              placeholder="Ej: 80"
              onChange={onInputChange}
            />

            <InputField
              id="precioEnergiaPuntaB"
              label="Precio energía punta (€/kWh)"
              value={form.precioEnergiaPuntaB}
              step="0.001"
              min="0"
              placeholder="Ej: 0.180"
              onChange={onInputChange}
            />

            <InputField
              id="consumoLlanoB"
              label="Consumo llano (kWh)"
              value={form.consumoLlanoB}
              step="1"
              min="0"
              placeholder="Ej: 120"
              onChange={onInputChange}
            />

            <InputField
              id="precioEnergiaLlanoB"
              label="Precio energía llano (€/kWh)"
              value={form.precioEnergiaLlanoB}
              step="0.001"
              min="0"
              placeholder="Ej: 0.130"
              onChange={onInputChange}
            />

            <InputField
              id="consumoValleB"
              label="Consumo valle (kWh)"
              value={form.consumoValleB}
              step="1"
              min="0"
              placeholder="Ej: 100"
              onChange={onInputChange}
            />

            <InputField
              id="precioEnergiaValleB"
              label="Precio energía valle (€/kWh)"
              value={form.precioEnergiaValleB}
              step="0.001"
              min="0"
              placeholder="Ej: 0.090"
              onChange={onInputChange}
            />
          </>
        ) : (
          <InputField
            id="precioEnergiaB"
            label="Precio energía 24h (€/kWh)"
            value={form.precioEnergiaB}
            step="0.001"
            min="0"
            placeholder="Ej: 0.122"
            onChange={onInputChange}
          />
        )}

        <InputField
          id="cuotaFijaB"
          label="Cuota fija mensual (€/mes)"
          value={form.cuotaFijaB}
          step="0.01"
          min="0"
          placeholder="Ej: 0"
          onChange={onInputChange}
        />
      </div>
    </article>
  )
}
