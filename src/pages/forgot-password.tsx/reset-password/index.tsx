import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/services";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import bg_image from "@/assets/images/doctor-bg.jpg";
import app_logo from "@/assets/images/freshfit_logo.png";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

const schema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const forgot_password_token = location.state?.forgot_password_token;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add state for password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  useEffect(() => {
    if (!forgot_password_token) {
      navigate("/forgot-password");
      toast.error(
        "Please follow the password reset process from the beginning",
        {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        }
      );
    }
  }, [forgot_password_token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: { newPassword: string }) => {
    setError(null);
    setLoading(true);
    try {
      await authService.resetPassword({
        forgot_password_token,
        password: data.newPassword,
        confirm_password: data.newPassword,
      });
      toast.success("Password reset successful!", {
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });
      navigate("/login");
    } catch (error: any) {
      setError("An error occurred. Please try again.");
      console.error("Reset password error:", error);
      toast.error("An error occurred. Please try again.", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
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
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-center text-sm mb-4">
            Please enter your new password
          </p>

          <div className="flex flex-col gap-y-1 w-full">
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                {...register("newPassword")}
                className="text-slate-900 rounded-md pr-10 min-w-72"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-500" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-500" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-y-1 w-full">
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="text-slate-900 rounded-md pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-500" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-500" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordPage;
