import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SignupForm } from "wasp/client/auth";
import { AuthLayout } from "../AuthLayout";

export function SignupPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  useEffect(() => {
    // Set confirmPassword input type to password after form renders
    const setPasswordType = () => {
      const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
      if (confirmPasswordInput && confirmPasswordInput.type !== 'password') {
        confirmPasswordInput.type = 'password';
      }
    };

    // Set immediately and also after a short delay to catch dynamic rendering
    setPasswordType();
    const timeoutId = setTimeout(setPasswordType, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AuthLayout>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl font-black mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Create A New Account
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Start planning trips that actually happen
            </p>
          </div>

          {/* Form Section */}
          <div className="[&_form]:flex [&_form]:flex-col [&_form]:gap-4 [&_input]:bg-white/5 [&_input]:border [&_input]:border-white/20 [&_input]:!text-black [&_input[type='password']]:!text-black [&_input[type='text']]:!text-black [&_input[type='email']]:!text-black [&_input]:placeholder:text-gray-500 [&_input]:placeholder:opacity-60 [&_input]:rounded-lg [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:text-sm [&_input]:transition-all [&_input]:duration-200 [&_input]:focus:outline-none [&_input]:focus:ring-2 [&_input]:focus:ring-cyan-500/50 [&_input]:focus:border-cyan-500/50 [&_input]:focus:bg-white/10 [&_input]:focus:!text-black [&_input]:hover:border-white/30 [&_label]:text-gray-300 [&_label]:text-xs [&_label]:font-semibold [&_label]:mb-1.5 [&_label]:block [&_button]:bg-gradient-to-r [&_button]:from-cyan-500 [&_button]:to-purple-500 [&_button]:text-white [&_button]:font-bold [&_button]:rounded-lg [&_button]:px-5 [&_button]:py-2.5 [&_button]:text-sm [&_button]:hover:scale-[1.02] [&_button]:hover:shadow-lg [&_button]:hover:shadow-cyan-500/25 [&_button]:transition-all [&_button]:duration-200 [&_button]:w-full [&_button]:mt-1 [&_button]:order-[999] [&_form>div:has(button)]:order-[999] [&_p]:text-red-400 [&_p]:text-xs [&_p]:mt-1 [&_p]:font-medium [&_form>div:has([name='email'])]:order-1 [&_form>div:has([name='username'])]:order-2 [&_form>div:has([name='password'])]:order-3 [&_form>div:has([name='confirmPassword'])]:order-4 [&_h1]:hidden [&_h2]:hidden [&_form>div]:flex [&_form>div]:flex-col">
            <SignupForm
              additionalFields={[
                {
                  name: "username",
                  type: "input",
                  label: "Username",
                  validations: {
                    required: "Username is required",
                    minLength: {
                      value: 6,
                      message: "Username must be at least 6 characters long",
                    },
                  },
                },
                {
                  name: "confirmPassword",
                  type: "input",
                  label: "Confirm Password",
                  validations: {
                    required: "Please confirm your password",
                    validate: (value: string, formValues: Record<string, unknown>) => {
                      const password = (formValues.password as string) || '';
                      if (value !== password) {
                        return "Passwords do not match";
                      }
                      return true;
                    },
                  },
                },
              ]}
            />
          </div>

          {/* Footer Link */}
          <div className="text-center pt-1">
            <span className="text-xs text-gray-400">
              {"Already have an account? "}
              <Link
                to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 transition-all underline-offset-4 hover:underline"
              >
                Go to login
              </Link>
            </span>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}
