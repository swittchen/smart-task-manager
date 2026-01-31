export default function Button({ variant = "default", className = "", children, ...props }) {
  const v =
    variant === "primary" ? "btn btnPrimary" :
    variant === "danger" ? "btn btnDanger" :
    variant === "ghost"  ? "btn btnGhost"  :
    "btn";

  return (
    <button className={`${v} ${className}`} {...props}>
      {children}
    </button>
  );
}
