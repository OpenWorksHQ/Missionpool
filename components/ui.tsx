import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { Search, X } from "lucide-react";

export function PageContainer({ children, className = "", size = "default" }: { children: React.ReactNode; className?: string; size?: "default" | "narrow" | "wide" }) {
  return <div className={clsx("container-shell mp-page", size === "narrow" && "mp-page-narrow", size === "wide" && "mp-page-wide", className)}>{children}</div>;
}

export function SectionHeader({ eyebrow, title, text, action, className = "" }: { eyebrow?: string; title: string; text?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("mp-section-header", className)}>
      <div>
        {eyebrow ? <p className="mp-eyebrow">{eyebrow}</p> : null}
        <h1 className="mp-page-title">{title}</h1>
        {text ? <p className="mp-page-copy">{text}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

const buttonBase = "focus-ring mp-button";
const buttonStyles = {
  primary: "mp-button-primary",
  secondary: "mp-button-secondary",
  ghost: "mp-button-ghost",
  pale: "mp-button-pale"
};

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={clsx(buttonBase, buttonStyles.primary, props.className)} type={props.type ?? "button"} />;
}

export function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={clsx(buttonBase, buttonStyles.secondary, props.className)} type={props.type ?? "button"} />;
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={clsx(buttonBase, buttonStyles.ghost, props.className)} type={props.type ?? "button"} />;
}

export function ButtonLink({ href, children, variant = "primary", className = "" }: { href: string; children: React.ReactNode; variant?: keyof typeof buttonStyles; className?: string }) {
  return (
    <Link className={clsx(buttonBase, buttonStyles[variant], className)} href={href}>
      {children}
    </Link>
  );
}

export function IconButton({ label, children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
      <button {...props} aria-label={label} className={clsx("focus-ring mp-icon-button", className)} type={props.type ?? "button"}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("mp-card", className)}>{children}</div>;
}

export function FormField({ label, helper, children, className = "" }: { label: string; helper?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={clsx("mp-field", className)}>
      <span>{label}</span>
      {children}
      {helper ? <span className="text-xs font-semibold leading-5 text-muted">{helper}</span> : null}
    </label>
  );
}

export const controlClass = "focus-ring mp-control";
export const textareaClass = "focus-ring mp-control mp-textarea";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(controlClass, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx(textareaClass, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={clsx(controlClass, "appearance-none bg-[linear-gradient(45deg,transparent_50%,#07111f_50%),linear-gradient(135deg,#07111f_50%,transparent_50%)] bg-[length:6px_6px,6px_6px] bg-[position:calc(100%-20px)_21px,calc(100%-14px)_21px] bg-no-repeat pr-10", props.className)} />;
}

export function SearchInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={clsx("mp-search-input", className)}>
      <Search size={18} />
      <input {...props} />
    </label>
  );
}

export function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "dark" | "green" | "blue" | "amber" }) {
  const tones = {
    neutral: "mp-status-neutral",
    dark: "mp-status-dark",
    green: "mp-status-green",
    blue: "mp-status-blue",
    amber: "mp-status-amber"
  };
  return <span className={clsx("mp-status-pill", tones[tone])}>{children}</span>;
}

export function AvatarStack({ profiles, size = 32, max = 5 }: { profiles: Array<{ id: string; name: string; avatarUrl: string }>; size?: number; max?: number }) {
  return (
    <div className="mp-avatar-stack">
      {profiles.slice(0, max).map((profile) => (
        <Image key={profile.id} className="rounded-full border-2 border-white object-cover shadow-sm" src={profile.avatarUrl} alt={profile.name} width={size} height={size} />
      ))}
    </div>
  );
}

export function TabBar<T extends string>({ tabs, active, onChange }: { tabs: readonly T[]; active: T; onChange: (tab: T) => void }) {
  return (
    <div className="mp-tabbar">
      {tabs.map((tab) => (
        <button key={tab} className={clsx("focus-ring mp-tab", active === tab && "mp-tab-active")} type="button" onClick={() => onChange(tab)}>
          {tab}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <Card className="border-dashed p-10 text-center">
      <h2 className="text-xl font-black text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{text}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return <div className="rounded-[22px] border border-line bg-white p-8 text-sm font-black text-muted shadow-[0_18px_50px_rgba(7,17,31,0.06)]">{label}</div>;
}

export function Toast({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
      <span>{children}</span>
      {onClose ? <IconButton label="Dismiss" className="h-8 w-8 border-emerald-200 bg-emerald-50" onClick={onClose}><X size={15} /></IconButton> : null}
    </div>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/35 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-navy">{title}</h2>
          <IconButton label="Close modal" onClick={onClose}><X size={18} /></IconButton>
        </div>
        <div className="mt-5">{children}</div>
      </Card>
    </div>
  );
}
