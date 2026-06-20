import SectionHeader from './SectionHeader.jsx';
import { formatearEuros, formatearPorcentaje } from '../utils/calculations.js';

function ResultItem({ label, value, total = false }) {
  return (
    <div className="result-item">
      <span className="result-label">{label}</span>
      <span className={`result-value ${total ? 'total-value' : ''}`}>{value}</span>
    </div>
  );
}

function ResultCard({ type, icon, title, result }) {
  const otros = result.bonoSocialTotal + result.alquilerTotal;
  const impuestos = result.impElectrico + result.impIva;

  return (
    <article className={`result-card result-card-${type}`}>
      <h3>
        <span>{icon}</span>
        {title}
      </h3>
      <ResultItem label="Término de energía" value={formatearEuros(result.terminoEnergia)} />
      <ResultItem label="Término de potencia" value={formatearEuros(result.terminoPotencia)} />
      <ResultItem label="Otros conceptos fijos" value={formatearEuros(otros)} />
      <ResultItem label="Impuestos totales" value={formatearEuros(impuestos)} />
      <ResultItem label="TOTAL MENSUAL" value={formatearEuros(result.total)} total />
    </article>
  );
}

function Comparison({ comparison, onShareWhatsApp, onCopyLink }) {
  const { diferenciaAbsoluta, diferenciaRelativa, octopusEsMasBarata, usuarioEsMasBarata } = comparison;

  if (usuarioEsMasBarata) {
    return (
      <div className="comparison comparison-cheaper">
        <div className="comparison-icon">✅</div>
        <h3>Tu Tarifa es más económica</h3>
        <div className="comparison-amount">{formatearEuros(Math.abs(diferenciaAbsoluta))}/mes</div>
        <div className="comparison-percentage">Ahorro del {formatearPorcentaje(Math.abs(diferenciaRelativa))}</div>
        <p>Tu tarifa actual es mejor que Octopus Relax. ¡Mantén tu tarifa!</p>
      </div>
    );
  }

  if (octopusEsMasBarata) {
    return (
      <div className="comparison comparison-cheaper">
        <div className="comparison-icon">🐙</div>
        <h3>Octopus Relax es más económico</h3>
        <div className="comparison-amount">{formatearEuros(diferenciaAbsoluta)}/mes</div>
        <div className="comparison-percentage">Ahorrarías un {formatearPorcentaje(diferenciaRelativa)}</div>
        <p>Con Octopus Relax ahorrarías dinero cada mes. ¡Es una mejor opción!</p>
        <p className="comparison-cta-text">
          Puedes contratar la tarifa "Octopus Relax" y llevarte 50€ de ahorro en tu factura en el siguiente enlace:
        </p>
        <a
          href="https://share.octopusenergy.es/lucky-violin-424"
          target="_blank"
          rel="noopener noreferrer"
          className="comparison-link"
        >
          🎁 Contratar Octopus Relax y obtener 50€ de descuento →
        </a>
        <div className="share-buttons">
          <button className="share-btn" type="button" onClick={onShareWhatsApp}>
            📱 Compartir por WhatsApp
          </button>
          <button className="share-btn" type="button" onClick={onCopyLink}>
            🔗 Copiar enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="comparison">
      <div className="comparison-icon">⚖️</div>
      <h3>Ambas tarifas tienen el mismo coste</h3>
      <div className="comparison-amount">0 €/mes</div>
      <div className="comparison-percentage">Sin diferencia</div>
      <p>Las dos tarifas resultan en el mismo coste mensual.</p>
    </div>
  );
}

export default function Results({ results, onShareWhatsApp, onCopyLink }) {
  if (!results) return null;

  return (
    <div className="results">
      <section className="section">
        <SectionHeader icon="📈" title="Resultados del Cálculo" />

        <div className="results-grid">
          <ResultCard type="a" icon="🐙" title="Octopus Relax" result={results.octopus} />
          <ResultCard type="b" icon="💼" title="Tu Tarifa" result={results.usuario} />
        </div>

        <Comparison
          comparison={results.comparison}
          onShareWhatsApp={onShareWhatsApp}
          onCopyLink={onCopyLink}
        />
      </section>
    </div>
  );
}
