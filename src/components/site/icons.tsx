import { Droplets, Footprints, Gem, Shirt, Sofa, WashingMachine, Wind } from "lucide-react";

const map = {
  wash: WashingMachine,
  dryclean: Shirt,
  iron: Wind,
  couture: Gem,
  sneakers: Footprints,
  home: Sofa,
} as const;

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name as keyof typeof map] ?? Shirt;
  return <Icon className={className} aria-hidden />;
}

export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-xl bg-gold text-night ${className}`} aria-hidden>
      <Droplets className="size-[55%]" />
    </span>
  );
}
