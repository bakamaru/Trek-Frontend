import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useSignupMutation } from "../../redux/user/userAPI";
import AuthHelper from "../../utils/AuthHelper";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (!isChecked) {
      setFormError("You must agree to the Terms and Conditions.");
      return;
    }
    setFormError("");

    try {
      const result = await signup({
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Password: password,
      }).unwrap();

      if (result.IsSuccess && result.Data?.User?.Token) {
        const userInfo = AuthHelper.SetNewLogin(result.Data.User.Token);

        // Redirect logic similar to SignIn
        if (Array.isArray(userInfo.role)) {
          if ((userInfo.role as string[]).includes("SuperAdmin")) {
            navigate("/admin/superadmin/dashboard");
          } else if ((userInfo.role as string[]).includes("Admin")) {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        } else if (userInfo.role === "SuperAdmin") {
          navigate("/superadmin/dashboard");
        } else if (userInfo.role === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setFormError(result.Message || "Registration failed.");
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      setFormError(
        error?.data?.Message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h2 className="mb-2 text-2xl font-bold text-blue-600 dark:text-white sm:text-3xl">
              Create Account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join us to start your journey.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      className="!py-3"
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="!py-3"
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="!py-3"
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  {/* <div className="relative"> */}
                  <Input
                    placeholder="Create a password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="!py-3"
                  />
                  {formError && (
                    <p className="mt-2 text-sm text-red-500">{formError}</p>
                  )}
                  {/* Toggle icon */}
                  {/* </div> */}
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    className="w-5 h-5 mt-0.5"
                    checked={isChecked}
                    onChange={(e: any) => setIsChecked(e.target.checked)}
                  />
                  <p className="inline-block text-sm text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      Terms and Conditions
                    </span>
                    {" "}and our{" "}
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                    .
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button className="w-full !py-3 !text-base" size="md" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account? {" "}
                <Link
                  to="/signin"
                  className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
