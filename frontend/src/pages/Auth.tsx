import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { toast } from "sonner";
import { Loader2, ArrowLeft, GraduationCap, BookOpen, Users, Award, Mail } from "lucide-react";
import { getGraphqlUrl } from "@/lib/env";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@apollo/client/react";
import { GOOGLE_LOGIN, VERIFY_2FA, SETUP_2FA, REQUEST_EMAIL_OTP, VERIFY_EMAIL_OTP } from "@/lib/graphql/mutations";

type AuthMode = "login" | "signup";

const features = [
  { icon: GraduationCap, text: "Access world-class courses" },
  { icon: BookOpen, text: "Learn at your own pace" },
  { icon: Users, text: "Get mentored by experts" },
  { icon: Award, text: "Earn recognized certificates" },
];

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });

  // 2FA State
  const [requires2FA, setRequires2FA] = useState(false);
  const [requires2FASetup, setRequires2FASetup] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [twoFactorData, setTwoFactorData] = useState<{ qrCodeDataUrl: string, secret: string } | null>(null);
  const [useEmailOTP, setUseEmailOTP] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  // Forgot Password State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const { login, signup, user, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [googleLoginMutation] = useMutation(GOOGLE_LOGIN);
  const [verify2FAMutation] = useMutation(VERIFY_2FA);
  const [setup2FAMutation] = useMutation(SETUP_2FA);
  const [requestEmailOTPMutation] = useMutation(REQUEST_EMAIL_OTP);
  const [verifyEmailOTPMutation] = useMutation(VERIFY_EMAIL_OTP);

  // If already logged in, redirect to portal
  if (user) {
    const roleRedirects = {
      student: "/portal/student",
      trainer: "/portal/trainer",
      admin: "/portal/admin",
      super_admin: "/portal/super-admin",
    };
    navigate(roleRedirects[user.role], { replace: true });
    return null;
  }

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      if (!token) throw new Error("No credential received from Google");

      setIsLoading(true);
      const { data } = await googleLoginMutation({
        variables: { token }
      });

      const { token: backendToken, user: userData } = (data as any).googleLogin;

      loginWithToken(backendToken, userData);
      toast.success("Successfully signed in with Google!");

      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/portal/student";
      navigate(from, { replace: true });

    } catch (error: any) {
      console.error("Google Login Error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const graphqlUrl = getGraphqlUrl();

      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation RequestPasswordReset($email: String!) {
              requestPasswordReset(email: $email)
            }
          `,
          variables: {
            email: resetEmail
          }
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setResetSent(true);
      toast.success("If an account exists, a reset link has been sent.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        const response = await login(formData.email, formData.password);
        
        if (response?.requires2FA) {
          setRequires2FA(true);
          toast.info("Two-Factor Authentication Required");
          setIsLoading(false);
          return;
        }

        if (response?.requires2FASetup) {
          setRequires2FASetup(true);
          // Auto-trigger setup
          const { data } = await setup2FAMutation();
          if ((data as any)?.setup2FA) {
            setTwoFactorData((data as any).setup2FA);
          }
          toast.info("Administrator 2FA Setup Required");
          setIsLoading(false);
          return;
        }

        toast.success("Welcome back!");
      } else {
        if (!formData.fullName.trim()) {
          throw new Error("Please enter your full name");
        }
        await signup({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
        });
        toast.success("Account created successfully!");
      }

      // Navigate to the intended page or default portal
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/portal/student";
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (useEmailOTP) {
        const { data } = await verifyEmailOTPMutation({
          variables: { email: formData.email, code: totpCode }
        });
        response = (data as any)?.verifyEmailOTP;
      } else {
        const { data } = await verify2FAMutation({
          variables: { code: totpCode }
        });
        response = (data as any)?.verify2FA;
      }

      if (response?.token) {
        loginWithToken(response.token, response.user);
        toast.success("Identity verified successfully!");
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/portal/student";
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestEmailOTP = async () => {
    setIsSendingOTP(true);
    try {
      await requestEmailOTPMutation({
        variables: { email: formData.email }
      });
      setUseEmailOTP(true);
      toast.success("Verification code sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setIsSendingOTP(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-accent/10" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-16">
              <span className="text-accent text-3xl font-bold">≪</span>
              <span className="font-heading text-2xl font-semibold text-card-foreground tracking-wide">
                CODEMANDE
              </span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="font-heading text-4xl lg:text-5xl font-medium text-card-foreground mb-6 leading-tight">
                The Future of
                <span className="text-gradient-gold block">African Tech Education</span>
              </h1>
              <p className="text-card-foreground/70 text-lg max-w-md">
                Join thousands of learners building real-world skills through project-based learning
                and mentorship from industry experts.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-card-foreground/80"
              >
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </motion.div>

          <div className="text-card-foreground/50 text-sm">
            © {new Date().getFullYear()} CODEMANDE. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-accent text-2xl font-bold">≪</span>
              <span className="font-heading text-xl font-semibold text-foreground tracking-wide">
                CODEMANDE
              </span>
            </Link>
          </div>

          {/* Back to Home */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {isForgotPassword ? (
            // Forgot Password View
            <div>
              <div className="mb-8">
                <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground mb-2">
                  Forgot Password
                </h2>
                <p className="text-muted-foreground">
                  {resetSent
                    ? "Check your email for the reset link."
                    : "Enter your email to receive a password reset link."}
                </p>
              </div>

              {resetSent ? (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                    We've sent a password reset link to <strong>{resetEmail}</strong>.
                    Please check your inbox (and spam folder) and click the link to reset your password.
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setResetSent(false);
                      setIsForgotPassword(false);
                      setMode("login");
                    }}
                  >
                    Back to Sign In
                  </Button>
                  <Button
                    variant="link"
                    className="w-full text-sm text-muted-foreground"
                    onClick={() => setResetSent(false)}
                  >
                    Didn't receive the email? Try again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email Address</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : requires2FA ? (
            // 2FA Verification View
            <div>
              <div className="mb-6">
                <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground mb-2">
                  {useEmailOTP ? "Email Verification" : "Security Verification"}
                </h2>
                <p className="text-muted-foreground">
                  {useEmailOTP 
                    ? `Enter the 6-digit code sent to ${formData.email}`
                    : "Enter the 6-digit code from your authenticator app to continue."}
                </p>
              </div>

              <form onSubmit={handle2FAVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="totpCode">Verification Code</Label>
                  <Input
                    id="totpCode"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                    required
                    className="h-14 text-center text-3xl tracking-[0.3em] font-mono bg-accent/5 border-accent/20 focus:border-accent"
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => {
                    setRequires2FA(false);
                    setTotpCode("");
                    setUseEmailOTP(false);
                  }}
                >
                  Back to Sign In
                </Button>
              </form>

              {!useEmailOTP && (
                <div className="mt-8 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground mb-4">Can't access your app?</p>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-accent/20 hover:bg-accent/5"
                    onClick={handleRequestEmailOTP}
                    disabled={isSendingOTP}
                  >
                    {isSendingOTP ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin text-accent" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2 text-accent" />
                    )}
                    Receive code via Email
                  </Button>
                </div>
              )}
            </div>
          ) : requires2FASetup ? (
            // 2FA Setup View
            <div>
              <div className="mb-6">
                <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground mb-2">
                  Enable Admin 2FA
                </h2>
                <p className="text-muted-foreground text-sm">
                  Administrator accounts must use Two-Factor Authentication. Scan this QR code with Google Authenticator or Authy.
                </p>
              </div>

              <div className="space-y-6">
                {twoFactorData ? (
                  <div className="flex flex-col items-center gap-6 p-6 bg-accent/5 rounded-2xl border border-accent/10">
                    <img
                      src={twoFactorData.qrCodeDataUrl}
                      alt="2FA QR Code"
                      className="w-48 h-48 rounded-lg border-4 border-white shadow-xl"
                    />
                    <div className="text-center space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Setup Key</p>
                      <code className="px-4 py-1.5 bg-background rounded-lg text-accent font-mono text-sm border border-border shadow-sm block">
                        {twoFactorData.secret}
                      </code>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  </div>
                )}

                <form onSubmit={handle2FAVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Confirm with 6-digit Code</Label>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                      required
                      className="h-12 text-center text-xl tracking-[0.2em] font-mono"
                    />
                  </div>
                  <Button type="submit" variant="gold" className="w-full h-12" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Activate & Continue"}
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            // Login/Signup View
            <>
              <div className="mb-8">
                <h2 className="font-heading text-2xl lg:text-3xl font-medium text-foreground mb-2">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="text-muted-foreground">
                  {mode === "login"
                    ? "Sign in to continue your learning journey"
                    : "Start your journey with CODEMANDE today"}
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-muted rounded-lg p-1 mb-8">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${mode === "login"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${mode === "signup"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Jean Baptiste"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required={mode === "signup"}
                      className="h-12"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>

                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+250 790 706 170"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="h-12"
                  />
                </div>

                {mode === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-sm text-accent hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {mode === "login" ? "Signing in..." : "Creating account..."}
                    </>
                  ) : (
                    mode === "login" ? "Sign In" : "Create Account"
                  )}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center w-full [&>div]:w-full [&>div]:flex [&>div]:justify-center">
                <GoogleLogin 
                  onSuccess={handleGoogleLogin} 
                  onError={() => toast.error("Google Login Failed")}
                  useOneTap={false}
                  size="large"
                  theme="outline"
                  shape="rectangular"
                  text="signin_with"
                />
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
