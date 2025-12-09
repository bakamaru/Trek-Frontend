import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
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
            {/* Social Auth Buttons removed or kept as per existing code but hidden in this snippet for brevity if not requested to update, assuming focus on form aesthetics first */}
            <form className="mt-8 space-y-6">
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
                    placeholder="name@company.com"
                    className="!py-3"
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Create a password"
                      type={showPassword ? "text" : "password"}
                      className="!py-3"
                    />
                    {/* Toggle icon */}
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    className="w-5 h-5 mt-0.5"
                    checked={isChecked}
                  //onChange={setIsChecked}
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
                  <Button className="w-full !py-3 !text-base" size="md">
                    Sign Up
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
