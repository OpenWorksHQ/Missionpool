import { FormField, controlClass, textareaClass as uiTextareaClass } from "@/components/ui";

export function Field({ label, children, className = "", helper }: { label: string; children: React.ReactNode; className?: string; helper?: string }) {
  return <FormField label={label} helper={helper} className={className}>{children}</FormField>;
}

export const inputClass = controlClass;
export const textareaClass = uiTextareaClass;
