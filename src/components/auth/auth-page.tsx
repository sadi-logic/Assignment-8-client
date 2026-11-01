"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  ImageIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  SparklesIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/BrandLogo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";
type FieldName = "name" | "email" | "photoUrl" | "password";
type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  return value;
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-4">
      <path
        fill="#FFC107"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
      />
      <path
        fill="#FF3D00"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#4CAF50"
        d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"
      />
      <path
        fill="#1976D2"
        d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"
      />
    </svg>
  );
}

function validateForm(
  mode: AuthMode,
  name: string,
  email: string,
  photoUrl: string,
  password: string
): FieldErrors {
  const errors: FieldErrors = {};

  if (mode === "register" && !name.trim()) {
    errors.name = "Enter your full name.";
  }
  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (mode === "register" && photoUrl.trim()) {
    try {
      const url = new URL(photoUrl.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.photoUrl = "Enter a valid HTTP or HTTPS photo URL.";
      }
    } catch {
      errors.photoUrl = "Enter a valid photo URL.";
    }
  }
  if (!password) {
    errors.password = "Enter your password.";
  } else if (mode === "register") {
    if (password.length < 6) {
      errors.password = "Use at least 6 characters.";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Add at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Add at least one lowercase letter.";
    }
  }

  return errors;
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isPending } = useAuth();
  const intendedRoute = getSafeRedirect(searchParams.get("callbackUrl"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!isPending && user) {
      router.replace(intendedRoute);
    }
  }, [intendedRoute, isPending, router, user]);

  function updateField(field: FieldName, value: string) {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "photoUrl") setPhotoUrl(value);
    if (field === "password") setPassword(value);
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setFormError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const validationErrors = validateForm(mode, name, email, photoUrl, password);
    setErrors(validationErrors);
    setFormError("");
    if (Object.keys(validationErrors).length > 0) return;

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      if (isRegister) {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          image: photoUrl.trim() || undefined,
        });
        if (result.error) {
          throw new Error(result.error.message || "Unable to create your account.");
        }
        toast.success("Your account was created successfully.");
        router.replace("/login");
        return;
      }

      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });
      if (result.error) {
        throw new Error(result.error.message || "Unable to log in.");
      }
      router.replace(intendedRoute);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setFormError("");

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: isRegister ? "/" : intendedRoute,
      });
      if (result.error) {
        throw new Error(
          result.error.message ||
            "Google sign-in is unavailable. Check that Google OAuth is configured."
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to continue with Google.";
      setFormError(message);
      toast.error(message);
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  const hasMinimumLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const callbackQuery =
    intendedRoute === "/"
      ? ""
      : `?callbackUrl=${encodeURIComponent(intendedRoute)}`;

  if (isPending || user) {
    return (
      <main className="flex min-h-[calc(100svh-4rem)] flex-1 items-center justify-center">
        <span
          className="size-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary"
          role="status"
          aria-label="Loading your account"
        />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[calc(100svh-4rem)] flex-1 items-center justify-center overflow-hidden bg-muted/30 px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-36 size-96 rounded-full bg-blue-400/10 blur-3xl"
      />

      <div className="relative w-full max-w-[28rem]">
        <div className="mb-6 flex justify-center">
          <BrandLogo />
        </div>
        <Card className="overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur">
          <CardHeader className="items-center space-y-3 px-6 pb-2 pt-8 text-center sm:px-9 sm:pt-10">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
              {isRegister ? (
                <SparklesIcon className="size-6" aria-hidden="true" />
              ) : (
                <LockKeyholeIcon className="size-6" aria-hidden="true" />
              )}
            </span>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {isRegister ? "Create an Account" : "Log in to your Account"}
              </CardTitle>
              <CardDescription className="mx-auto max-w-sm text-sm leading-relaxed">
                {isRegister
                  ? "Join us and discover the perfect workspace for your next project."
                  : "Log in to your account to continue exploring and booking studios."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-7 pt-6 sm:px-9">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full gap-3 rounded-xl font-medium transition-colors hover:bg-muted/70"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <GoogleMark />
              )}
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-medium text-muted-foreground">
                or continue with email
              </span>
              <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {formError ? (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
                >
                  {formError}
                </div>
              ) : null}

              {isRegister ? (
                <div className="space-y-2">
                  <Label htmlFor="auth-name">Full name</Label>
                  <div className="relative">
                    <UserRoundIcon
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="auth-name"
                      autoComplete="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(event) => updateField("name", event.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "auth-name-error" : undefined}
                      className="h-11 rounded-xl pl-10"
                    />
                  </div>
                  {errors.name ? (
                    <p id="auth-name-error" className="text-xs text-destructive">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="auth-email">Email address</Label>
                <div className="relative">
                  <MailIcon
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => updateField("email", event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "auth-email-error" : undefined}
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
                {errors.email ? (
                  <p id="auth-email-error" className="text-xs text-destructive">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              {isRegister ? (
                <div className="space-y-2">
                  <Label htmlFor="auth-photo">Photo URL <span className="font-normal text-muted-foreground">(optional)</span></Label>
                  <div className="relative">
                    <ImageIcon
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="auth-photo"
                      type="url"
                      inputMode="url"
                      placeholder="https://example.com/photo.jpg"
                      value={photoUrl}
                      onChange={(event) => updateField("photoUrl", event.target.value)}
                      aria-invalid={Boolean(errors.photoUrl)}
                      aria-describedby={errors.photoUrl ? "auth-photo-error" : undefined}
                      className="h-11 rounded-xl pl-10"
                    />
                  </div>
                  {errors.photoUrl ? (
                    <p id="auth-photo-error" className="text-xs text-destructive">
                      {errors.photoUrl}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="auth-password">Password</Label>
                  {!isRegister ? (
                    <a
                      href="#"
                      onClick={(event) => event.preventDefault()}
                      className="text-xs font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  ) : null}
                </div>
                <div className="relative">
                  <LockKeyholeIcon
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    placeholder={isRegister ? "Create a password" : "Enter your password"}
                    value={password}
                    onChange={(event) => updateField("password", event.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={[
                      errors.password ? "auth-password-error" : null,
                      isRegister ? "auth-password-requirements" : null,
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined}
                    className="h-11 rounded-xl pl-10 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p id="auth-password-error" className="text-xs text-destructive">
                    {errors.password}
                  </p>
                ) : null}
                {isRegister ? (
                  <ul
                    id="auth-password-requirements"
                    aria-live="polite"
                    className="grid gap-1 pt-1 text-xs text-muted-foreground sm:grid-cols-3"
                  >
                    {[
                      { label: "6+ characters", valid: hasMinimumLength },
                      { label: "Uppercase letter", valid: hasUppercase },
                      { label: "Lowercase letter", valid: hasLowercase },
                    ].map(({ label, valid }) => (
                      <li
                        key={label}
                        className={cn(
                          "flex items-center gap-1.5",
                          valid && "text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {valid ? (
                          <CheckIcon className="size-3.5" aria-hidden="true" />
                        ) : (
                          <XIcon className="size-3.5 opacity-50" aria-hidden="true" />
                        )}
                        {label}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <Button
                type="submit"
                className="h-11 w-full gap-2 rounded-xl font-semibold shadow-sm shadow-primary/15 transition-transform hover:-translate-y-px"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
                    {isRegister ? "Creating account..." : "Logging in..."}
                  </>
                ) : (
                  <>
                    {isRegister ? "Create account" : "Log in"}
                    <ArrowRightIcon className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-border/60 bg-muted/20 px-6 py-5 text-sm sm:px-9">
            <p className="text-muted-foreground">
              {isRegister ? "Already have an account?" : "New to StudioSpace?"}{" "}
              <Link
                href={isRegister ? `/login${callbackQuery}` : `/register${callbackQuery}`}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "h-auto p-0 font-semibold"
                )}
              >
                {isRegister ? "Log in" : "Create an account"}
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Find a space where your next great idea can take shape.
        </p>
      </div>
    </main>
  );
}
