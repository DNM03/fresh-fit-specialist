import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { authService } from "@/services";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import bg_image from "@/assets/images/doctor-bg.jpg";
import app_logo from "@/assets/images/freshfit_logo.png";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const schema = z.object({
  otp: z.string().length(4, { message: "OTP must be exactly 4 digits" }),
});

function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      toast.error("Please enter your email first", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    }
  }, [email, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: { otp: string }) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.verifyOtpCode({
        email,
        otp_code: data.otp,
      });
      toast.success("OTP verified successfully!", {
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });
      navigate("/forgot-password/reset-password", {
        state: { forgot_password_token: response.data.forgot_password_token },
      });
    } catch (error: any) {
      setError("Invalid OTP. Please try again.");
      toast.error("Invalid OTP. Please try again.", {
        style: {
          background: "#cc3131",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success("New OTP sent to your email!", {
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Failed to resend OTP", {
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
          <h1 className="text-2xl font-bold">Verify OTP</h1>
          <p className="text-center text-sm mb-4">
            Please enter the verification code sent to{" "}
            <span className="font-semibold">{email}</span>
          </p>

          <div className="flex flex-col gap-y-1 w-full items-center">
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <InputOTP
                  maxLength={4}
                  value={field.value}
                  onChange={field.onChange}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="h-12 w-12 border-slate-700 text-slate-900 text-xl"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-12 w-12 border-slate-700 text-slate-900 text-xl"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-12 w-12 border-slate-700 text-slate-900 text-xl"
                    />
                    <InputOTPSlot
                      index={3}
                      className="h-12 w-12 border-slate-700 text-slate-900 text-xl"
                    />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.otp && (
              <p className="text-red-500 mt-2">{errors.otp.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            style={{ width: "100%" }}
            disabled={loading}
            className="mt-2"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleResendOtp}
            disabled={loading}
            className="w-full"
          >
            Resend OTP
          </Button>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="text-slate-900 relative group"
            >
              Back to Forgot Password
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] rounded-full bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtpPage;
