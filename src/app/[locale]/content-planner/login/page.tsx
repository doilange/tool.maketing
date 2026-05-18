"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/content-planner/supabase/client";
import { Button } from "@/components/content-planner/ui/button";
import { Input } from "@/components/content-planner/ui/input";
import { Label } from "@/components/content-planner/ui/label";
import { Card, CardContent } from "@/components/content-planner/ui/card";


export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/content-planner");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setInfo("Check your email to confirm your account, then sign in.");
        setMode("signin");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 planner-theme"
      style={{
        background: `
          radial-gradient(1100px 600px at 0% 0%, #e9d5ff 0%, transparent 60%),
          radial-gradient(900px 500px at 100% 0%, #fbcfe8 0%, transparent 55%),
          radial-gradient(900px 500px at 100% 100%, #fed7aa 0%, transparent 55%),
          radial-gradient(700px 400px at 0% 100%, #bfdbfe 0%, transparent 55%),
          linear-gradient(180deg, #fbf7ff 0%, #ffffff 100%)
        `,
      }}
    >
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="text-xl font-bold text-slate-800">Content Planner</div>
        </div>
        <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-semibold text-slate-800 mb-1">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              {mode === "signin"
                ? "Sign in to your marketing workspace"
                : "Start planning your content with your team"}
            </p>
            <form onSubmit={onSubmit} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <Label>Full name</Label>
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
              )}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">
                  {error}
                </div>
              )}
              {info && (
                <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                  {info}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
            <div className="mt-4 text-sm text-center text-slate-500">
              {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
              <button
                type="button"
                className="text-violet-600 font-medium hover:underline"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
