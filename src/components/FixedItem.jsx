export default function FixedItem({ label, value }) {
  return (
    <div className="fixed-item">
      <span className="fixed-label">{label}</span>
      <span className="fixed-value">{value}</span>
    </div>
  );
}
