export default function Toast({ message, visible }) {
  return (
    <div className={`success-toast ${visible ? 'show' : ''}`}>
      ✓ {message}
    </div>
  );
}
