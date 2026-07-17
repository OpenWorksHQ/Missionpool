"use client";  

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "@/components/forms";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Card, IconButton, PageContainer, PrimaryButton, TextInput } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Demo mode: Supabase env vars are not set, so you are using the seeded local account.");
      router.push("/profile");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else router.push("/profile");
  }

  return (
    <AuthShell>
      <form onSubmit={submit}>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Welcome back</p>
        <h1 className="mt-2 text-4xl font-black text-navy">Log in to Mission Pool</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Use Supabase email/password auth when configured, or continue with the local demo account.</p>
        <div className="mt-7 grid gap-4">
          <Field label="Email">
            <TextInput name="email" type="email" required placeholder="you@example.com" />
          </Field>
          <Field label="Password">
            <div className="relative">
              <TextInput name="password" type={showPassword ? "text" : "password"} required placeholder="Enter your password" className="pr-12" />
              <IconButton label={showPassword ? "Hide password" : "Show password"} className="absolute right-1 top-1 h-10 w-10" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </IconButton>
            </div>
          </Field>
        </div>
        {message ? <p className="mt-5 rounded-2xl border border-line bg-[#f7fafc] px-4 py-3 text-sm font-bold text-navy">{message}</p> : null}
        <PrimaryButton className="mt-6 w-full" type="submit">Log in</PrimaryButton>
        <p className="mt-6 text-center text-sm font-semibold text-muted">No account? <Link className="font-black text-navy underline decoration-line underline-offset-4" href="/signup">Sign up</Link></p>
      </form>
    </AuthShell>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer className="grid min-h-[calc(100vh-68px)] place-items-center py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-line bg-white shadow-[0_28px_90px_rgba(7,17,31,0.10)] md:grid-cols-[1fr_0.8fr]">
        <Card className="rounded-none border-0 p-7 shadow-none md:p-10">{children}</Card>
        <div className="hidden bg-[#eaf7ef] p-10 md:flex md:flex-col md:justify-between">
          <div className="rounded-full bg-white/70 px-4 py-2 text-sm font-black text-navy shadow-sm">Mission-based social network</div>
          <div>
            <h2 className="text-3xl font-black leading-tight text-navy">Join missions. Find your people. Build something real.</h2>
            <p className="mt-4 text-sm leading-6 text-[#3f4a59]">Profiles, pools, updates, outcomes, and messages come together around shared goals.</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
