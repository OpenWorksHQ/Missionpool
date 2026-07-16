import { GhostButton, PrimaryButton, SecondaryButton, ButtonLink as UiButtonLink } from "@/components/ui";

export function ButtonLink({ href, children, variant = "primary", className = "" }: { href: string; children: React.ReactNode; variant?: "primary" | "dark" | "secondary" | "pale" | "ghost"; className?: string }) {
  const mapped = variant === "dark" ? "primary" : variant === "pale" ? "pale" : variant === "ghost" ? "ghost" : variant;
  return <UiButtonLink href={href} variant={mapped} className={className}>{children}</UiButtonLink>;
}

export function ActionButton({ children, variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "dark" | "secondary" | "pale" | "ghost" }) {
  if (variant === "secondary" || variant === "pale") return <SecondaryButton {...props} className={className}>{children}</SecondaryButton>;
  if (variant === "ghost") return <GhostButton {...props} className={className}>{children}</GhostButton>;
  return <PrimaryButton {...props} className={className}>{children}</PrimaryButton>;
}
