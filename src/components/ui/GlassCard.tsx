interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", hover = false }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${hover ? "glass-card-hover transition-colors duration-200" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
