export default function Card({ children, style = {} }) {
  return (
    <div className="app-card" style={style}>
      {children}
    </div>
  );
}