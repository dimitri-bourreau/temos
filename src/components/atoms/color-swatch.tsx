interface ColorSwatchProps {
  color: string;
  className?: string;
}

export function ColorSwatch({ color, className = "h-4 w-4" }: ColorSwatchProps) {
  return (
    <span
      className={`inline-block rounded-full ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}
