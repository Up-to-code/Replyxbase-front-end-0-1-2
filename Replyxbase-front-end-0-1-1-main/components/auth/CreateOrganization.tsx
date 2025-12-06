'use client';

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { checkSlugAvailability } from '@/app/actions';
import { useDebounce } from 'use-debounce';

export function CreateOrganization() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [debouncedSlug] = useDebounce(slug, 500);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [slugError, setSlugError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const t = useTranslations("Auth.CreateOrganization");

  React.useEffect(() => {
    const checkSlug = async () => {
      if (!debouncedSlug) {
        setIsSlugAvailable(null);
        setSlugError('');
        return;
      }

      setIsCheckingSlug(true);
      setSlugError('');
      
      const result = await checkSlugAvailability(debouncedSlug);
      
      setIsCheckingSlug(false);
      setIsSlugAvailable(result.available);
      
      if (!result.available && result.error) {
        setSlugError(t(result.error));
      }
    };

    checkSlug();
  }, [debouncedSlug, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSlugAvailable) return;
    
    setLoading(true);
    setError('');

    try {
      await authClient.organization.create({
        name,
        slug,
      }, {
        onSuccess: () => {
            setSuccess(true);
            setTimeout(() => {
                router.refresh();
            }, 1500);
        },
        onError: (ctx) => {
            setError(ctx.error.message);
            setLoading(false);
        }
      });
    } catch {
      setError(t("error"));
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <Card className="overflow-hidden relative">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-16 px-8 text-center"
              >
                <div className="mb-6 rounded-full bg-green-50 border-2 border-green-200 p-3 text-green-600">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {t("success")}
                </h3>
                <p className="text-slate-600">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <CardHeader className="text-center">
                  <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#005bbc]/10 border-2 border-[#005bbc]/20 text-[#005bbc]">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {t("title")}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {t("subtitle")}
                  </p>
                </CardHeader>

                {/* Form */}
                <CardContent>
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                          {t("nameLabel")}
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder={t("namePlaceholder")}
                          value={name}
                          onChange={(e) => {
                              setName(e.target.value);
                              // Auto-generate slug from name if slug is empty or matches previous auto-gen
                              const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                              setSlug(newSlug);
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                          {t("slugLabel")}
                        </label>
                        <div className="relative">
                          <Input
                            id="slug"
                            name="slug"
                            type="text"
                            required
                          error={slugError}
                            placeholder={t("slugPlaceholder")}
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className={isSlugAvailable ? "border-green-500 focus:border-green-500" : ""}
                          />
                          {isCheckingSlug && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Spinner size="sm" />
                            </div>
                          )}
                        </div>
                        <div className="min-h-[20px]">
                          {slugError ? (
                            <p className="text-xs text-red-600">{slugError}</p>
                          ) : isSlugAvailable ? (
                            <p className="text-xs text-green-600">{t("slugAvailable")}</p>
                          ) : (
                            <p className="text-xs text-slate-500">{t("slugDescription")}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="error" onClose={() => setError('')}>
                        {error}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading || !isSlugAvailable || isCheckingSlug}
                      loading={loading}
                      className="w-full"
                      icon={ArrowRight}
                    >
                      {t("submit")}
                    </Button>
                  </form>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
        
        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          {t("terms")}
        </p>
      </motion.div>
    </div>
  );
}
