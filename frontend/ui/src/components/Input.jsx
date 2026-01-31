export default function Input({ label, hint, className = "", ...props }) {
  return (
    <div className={`inputWrap ${className}`}>
      {label && <div className="label">{label}</div>}
      <input className="input" {...props} />
      {hint && <div className="muted">{hint}</div>}
    </div>
  );
}
