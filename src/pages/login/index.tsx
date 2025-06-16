import bg_image from "@/assets/images/doctor-bg.jpg";
import app_logo from "@/assets/images/freshfit_logo.png";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authService } from "@/services";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react"; // Import the eye icons

function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Add state for password visibility

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async (
    data
  ) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data.email, data.password);
      if (response.result.role !== 2) {
        toast.error("You are not authorized to access this application.", {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        });
        return;
      }
      console.log("Login successful", response);
      toast.success("Login successful", {
        style: {
          background: "#3ac76b",
          color: "#fff",
        },
      });
      navigate("/");
    } catch (error: any) {
      let errorMsg = "Email or password is incorrect. Please try again.";
      if (error.response?.status === 401) {
        errorMsg = "Email or password is incorrect. Please try again.";
      } else if (error.response?.status === 429) {
        errorMsg = "Too many attempts. Please try again later.";
      } else if (error.response?.status === 403) {
        errorMsg = "This account is banned. Please contact support.";
      } else {
        errorMsg = "An unexpected error occurred. Please try again later.";
      }
      console.error("Login error:", error.response?.status);
      toast.error(
        errorMsg || "Email or password is incorrect. Please try again.",
        {
          style: {
            background: "#cc3131",
            color: "#fff",
          },
        }
      );
    } finally {
      setIsLoading(false);
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
          <img src={app_logo} width={200} height={200} alt="App logo" />
          <h1 className="text-3xl font-bold">Login</h1>
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
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <div className="flex flex-col gap-y-1 w-full">
                <div className="relative">
                  <Input
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    className="text-slate-900 rounded-md pr-10"
                    value={value}
                    onChange={onChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
            )}
          />
          <div className="flex flex-row items-center justify-between w-full">
            <div></div>
            <div className="inline-block">
              <Link to="/forgot-password" className="text-sm relative group">
                Forgot password
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] rounded-full bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
          <Button type="submit" style={{ width: "100%" }} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
