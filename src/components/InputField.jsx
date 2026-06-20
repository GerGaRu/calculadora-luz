export default function InputField({ id, label, value, onChange, step = '1', min = '0', placeholder }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        type="number"
        id={id}
        name={id}
        value={value}
        step={step}
        min={min}
        placeholder={placeholder}
        onChange={(event) => onChange(id, event.target.value)}
      />
    </div>
  );
}
