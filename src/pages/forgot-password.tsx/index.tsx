import bg_image from "@/assets/images/doctor-bg.jpg";
import app_logo from "@/assets/images/freshfit_logo.png";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/services";
import { useState } from "react";
import { toast } from "sonner";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email({ message: "Invalid email format" }),
      })
    ),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    setError(null);
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      toast.success("Password reset email sent. Please check your inbox.");
      navigate("/forgot-password/verify-otp", { state: { email: data.email } });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError("No account found with this email address.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Password reset request error:", error);
      toast.error("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-slate-900 bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${bg_image})` }}
    >
      <div className="rounded-xl bg-slate-200/50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
        <form
          className="flex flex-col items-center text-[#176219] gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <img src={app_logo} width={150} height={150} alt="App logo" />
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-center text-sm mb-4">
            Enter your email address and we'll send you a verification code to
            reset your password.
          </p>

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <div className="flex flex-col gap-y-1 w-full">
                <Input
                  placeholder="Enter email"
                  className="text-slate-900 rounded-md min-w-72"
                  value={value}
                  onChange={onChange}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
            )}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </Button>

          <div className="text-sm">
            <Link to="/login" className="text-slate-900 relative group">
              Back to Login
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] rounded-full bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
