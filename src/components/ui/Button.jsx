export default function Button({
  children,
  onClick,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="app-button"
    >
      {children}
    </button>
  );
}