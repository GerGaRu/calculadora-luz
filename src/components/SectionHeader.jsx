export default function SectionHeader({ icon, title }) {
  return (
    <div className="section-header">
      <div className="section-icon">{icon}</div>
      <h2>{title}</h2>
    </div>
  );
}
