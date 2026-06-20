import FixedItem from './FixedItem.jsx';
import { VALORES_FIJOS } from '../utils/calculations.js';

export default function FixedValuesToggle({ isOpen, onToggle }) {
  return (
    <>
      <button className="fixed-values-toggle" type="button" onClick={onToggle}>
        <h3>Valores Fijos (No Modificables)</h3>
        <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      <div className={`fixed-values-content ${isOpen ? 'open' : ''}`}>
        <div className="fixed-values">
          <div className="fixed-grid">
            <FixedItem label="Impuesto bono social diario (€/día)" value={VALORES_FIJOS.bonoSocialDia.toFixed(3)} />
            <FixedItem label="Alquiler de equipos diario (€/día)" value={VALORES_FIJOS.alquilerEquiposDia.toFixed(3)} />
            <FixedItem label="IVA" value={`${VALORES_FIJOS.iva}%`} />
            <FixedItem label="Impuesto eléctrico" value={`${VALORES_FIJOS.impuestoElectrico}%`} />
          </div>
        </div>
      </div>
    </>
  );
}
