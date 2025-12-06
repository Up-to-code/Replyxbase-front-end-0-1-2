'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("Auth.Signup");
  const tLogin = useTranslations("Auth.Login");

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in with Google";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in with GitHub";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        console.error("Signup error details:", error);
        setError(error.message || t("error"));
        toast.error(error.message || t("error"));
      } else {
        toast.success(t("success"));
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Signup exception:", err);
      const errorMessage = err instanceof Error ? err.message : t("error");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h2>
        <p className="text-base text-slate-600">
          {t("subtitle")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full"
            icon={Github}
          >
            {tLogin("github")}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="me-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {tLogin("google")}
          </Button>
        </div>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t-2 border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">{tLogin("or")}</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="name"
              name="name"
              placeholder={t("namePlaceholder")}
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              id="email"
              name="email"
              placeholder={tLogin("emailPlaceholder")}
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              name="password"
              placeholder={tLogin("passwordPlaceholder")}
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              required
              minLength={8}
            />
            <p className="text-xs text-slate-500">Password must be at least 8 characters</p>
          </div>
          <Button 
            type="submit"
            variant="primary"
            disabled={isLoading}
            loading={isLoading}
            className="w-full"
          >
            {t("submit")}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="text-center text-sm text-slate-600 pt-4">
          {t("hasAccount")}{" "}
          <Link href="/login" className="font-medium text-[#005bbc] hover:text-[#004a9f] transition-colors">
            {t("signInLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}
