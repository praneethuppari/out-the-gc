import { Link, useSearchParams } from "react-router-dom";
import { LoginForm } from "wasp/client/auth";
import { AuthLayout } from "../AuthLayout";

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AuthLayout>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl font-black mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Continue planning your trips
            </p>
          </div>

          {/* Form Section */}
          <div className="[&_form]:flex [&_form]:flex-col [&_form]:gap-4 [&_input]:bg-white/5 [&_input]:border [&_input]:border-white/20 [&_input]:!text-black [&_input[type='password']]:!text-black [&_input[type='text']]:!text-black [&_input[type='email']]:!text-black [&_input]:placeholder:text-gray-500 [&_input]:placeholder:opacity-60 [&_input]:rounded-lg [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:text-sm [&_input]:transition-all [&_input]:duration-200 [&_input]:focus:outline-none [&_input]:focus:ring-2 [&_input]:focus:ring-cyan-500/50 [&_input]:focus:border-cyan-500/50 [&_input]:focus:bg-white/10 [&_input]:focus:!text-black [&_input]:hover:border-white/30 [&_label]:text-gray-300 [&_label]:text-xs [&_label]:font-semibold [&_label]:mb-1.5 [&_label]:block [&_button]:bg-gradient-to-r [&_button]:from-cyan-500 [&_button]:to-purple-500 [&_button]:text-white [&_button]:font-bold [&_button]:rounded-lg [&_button]:px-5 [&_button]:py-2.5 [&_button]:text-sm [&_button]:hover:scale-[1.02] [&_button]:hover:shadow-lg [&_button]:hover:shadow-cyan-500/25 [&_button]:transition-all [&_button]:duration-200 [&_button]:w-full [&_button]:mt-1 [&_button]:order-[999] [&_form>div:has(button)]:order-[999] [&_p]:text-red-400 [&_p]:text-xs [&_p]:mt-1 [&_p]:font-medium [&_form>div:has([name='email'])]:order-1 [&_form>div:has([name='password'])]:order-2 [&_h1]:hidden [&_h2]:hidden [&_form>div]:flex [&_form>div]:flex-col">
            <LoginForm />
          </div>

          {/* Footer Links */}
          <div className="text-center pt-1 space-y-2">
            <div>
              <span className="text-xs text-gray-400">
                {"Don't have an account? "}
                <Link
                  to={redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/signup"}
                  className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 transition-all underline-offset-4 hover:underline"
                >
                  Go to signup
                </Link>
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400">
                {"Forgot your password? "}
                <Link
                  to="/request-password-reset"
                  className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 transition-all underline-offset-4 hover:underline"
                >
                  Reset it
                </Link>
              </span>
            </div>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}
