import { useForm } from "react-hook-form";
import SideModelDrawer from "../../../components/ui/SideModelDrawer";
import InputField from "../../../components/form/input/InputField";
import { useResetPasswordMutation } from "../../../redux/user/userAPI";
import toaster from "../../../components/toster";

const ResetPasswordModal = ({ isOpen, user, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (data) => {
    try {
      await resetPassword({ userId: user?.AppUserId, newPassword: data.NewPassword }).unwrap();
      toaster.success("Password reset successfully");
      reset();
      onClose();
    } catch {
      toaster.error("Failed to reset password");
    }
  };

  return (
    <SideModelDrawer isOpen={isOpen} onClose={onClose} width="w-[30rem]" headerText="Reset Password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="h-full grow p-6 flex flex-col gap-5">
          <InputField
            type="password"
            labelName="New Password"
            placeholder="Enter new password"
            {...register("NewPassword", { required: "New password is required" })}
            error={!!errors.NewPassword}
            errorMsg={errors.NewPassword?.message as string}
          />
        </div>
        <div className="flex items-center justify-end gap-3 py-5 px-6 shadow-2xl border-t border-stroke dark:border-strokedark bg-white dark:bg-boxdark">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
            disabled={isLoading || isSubmitting}
          >
            Reset
          </button>
        </div>
      </form>
    </SideModelDrawer>
  );
};

export default ResetPasswordModal;