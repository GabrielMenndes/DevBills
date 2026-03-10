import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icone?: ReactNode;
  hover?: boolean;
  glowEffect?: boolean;
  glowEffectYellow?: boolean;
  glowEffectRed?: boolean;
  className?: string;
}

const Card = ({
  children,
  className = "",
  glowEffect = false,
  glowEffectYellow = false,
  glowEffectRed = false,
  hover = false,
  icone,
  subtitle,
  title,
}: CardProps) => {
  return (
    <div
      className={`bg-gray-900 rounded-xl cursor-pointer border border-gray-700 p-6 shadow-md transition-all
          ${hover ? "hover:border-primary-500 hover:shadow-lg hover:-translate-y-0.5" : ""}
          ${glowEffect ? "glow" : ""}
          ${glowEffectYellow ? "glowYellow" : ""}
          ${glowEffectRed ? "glowRed" : ""}
          ${className}
          `}
    >
      {(title || icone) && (
        <div className="flex items-center space-x-3 mb-4">
          {icone && (
            <div className="p-2 bg-primary-500/10 rounded-xl flex items-center justify-center">
              {icone}
            </div>
          )}

          {(title || subtitle) && (
            <div>
              {title && <h2 className="text-lg font-medium">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;
