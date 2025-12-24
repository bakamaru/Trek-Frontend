import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useAddUserMutation, useUpdateUserMutation, useGetUserByIdQuery, useGetRolesQuery } from "../../../redux/user/userAPI";
import toaster from "../../../components/toster";
import InputField from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import CreatableSelect from "react-select/creatable";
import ComponentCard from "../../../components/common/ComponentCard";

const defaultValues = {
  FirstName: "",
  LastName: "",
  Email: "",
  UserName: "",
  PhoneNumber: "",
  Address: "",
  DOB: "",
  Gender: "",
  IsActive: true,
  OrganizationId: "",
  RoleIds: [],
  Password: "",
};

const FormUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [userId, setUserId] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  const { data: roleData } = useGetRolesQuery({ offset: 1, limit: 1000 });
  const roles = roleData?.Data || [];

  const { data: userData, isSuccess } = useGetUserByIdQuery(userId, { skip: !isEditMode || userId === 0 });

  const [addUser, { isLoading: adding }] = useAddUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      setUserId(parseInt(id, 10));
    } else {
      setIsEditMode(false);
      setUserId(0);
      reset(defaultValues);
    }
  }, [id, reset]);

  useEffect(() => {
    if (isSuccess && userData && userData.Data) {
      const user = userData.Data;
      reset({
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        UserName: user.UserName,
        PhoneNumber: user.PhoneNumber,
        Address: user.Address,
        DOB: user.DOB ? new Date(user.DOB).toISOString().split('T')[0] : "",
        Gender: user.Gender,
        IsActive: user.IsActive,
        OrganizationId: user.OrganizationId,
        RoleIds: user.Roles ? user.Roles.map((r: any) => r.Id) : [],
        Password: "",
      });
    }
  }, [userData, isSuccess, reset]);


  const onSubmit = async (data: any) => {
    try {
      if (Array.isArray(data.RoleIds) && data.RoleIds.length > 0 && typeof data.RoleIds[0] === 'object' && data.RoleIds[0].value) {
        data.RoleIds = data.RoleIds.map((r: any) => r.value);
      }

      if (isEditMode) {
        await updateUser({ ...data, AppUserId: userId }).unwrap();
        toaster.success("User updated");
      } else {
        await addUser(data).unwrap();
        toaster.success("User added");
      }
      navigate("/admin/user");
    } catch (error) {
      toaster.error("Failed to save user");
    }
  };

  const roleOptions = roles.map((r: any) => ({ value: r.Id, label: r.Name }));
  const selectedRoles = watch("RoleIds");

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ComponentCard title={isEditMode ? "Edit User" : "Add User"}>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                type="text"
                id="firstName"
                labelName="First Name"
                placeholder="First Name"
                {...register("FirstName", { required: "First Name is required" })}
                error={!!errors.FirstName}
                errorMsg={errors.FirstName?.message as string}
              />
              <InputField
                type="text"
                id="lastName"
                labelName="Last Name"
                placeholder="Last Name"
                {...register("LastName", { required: "Last Name is required" })}
                error={!!errors.LastName}
                errorMsg={errors.LastName?.message as string}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                type="email"
                id="email"
                labelName="Email"
                placeholder="Email"
                {...register("Email", { required: "Email is required" })}
                error={!!errors.Email}
                errorMsg={errors.Email?.message as string}
              />
              <InputField
                type="text"
                id="userName"
                labelName="Username"
                placeholder="Username"
                {...register("UserName", { required: "Username is required" })}
                error={!!errors.UserName}
                errorMsg={errors.UserName?.message as string}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                type="text"
                id="phone"
                labelName="Phone"
                placeholder="Phone"
                {...register("PhoneNumber", { required: "Phone is required" })}
                error={!!errors.PhoneNumber}
                errorMsg={errors.PhoneNumber?.message as string}
              />
              <InputField
                type="date"
                id="dob"
                labelName="DOB"
                placeholder="YYYY-MM-DD"
                {...register("DOB")}
                error={!!errors.DOB}
                errorMsg={errors.DOB?.message as string}
              />
            </div>

            <InputField
              type="text"
              id="address"
              labelName="Address"
              placeholder="Address"
              {...register("Address")}
              error={!!errors.Address}
              errorMsg={errors.Address?.message as string}
            />

            <InputField
              type="text"
              id="gender"
              labelName="Gender"
              placeholder="Gender"
              {...register("Gender")}
              error={!!errors.Gender}
              errorMsg={errors.Gender?.message as string}
            />


            <div>
              <label className="mb-2.5 block text-black dark:text-white">Roles</label>
              <Controller
                name="RoleIds"
                control={control}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    isMulti
                    options={roleOptions}
                    value={roleOptions.filter((opt: any) =>
                      Array.isArray(selectedRoles)
                        ? selectedRoles.some((r: any) => r === opt.value || r.value === opt.value)
                        : []
                    )}
                    onChange={(val) => field.onChange(Array.isArray(val) ? [...val] : [])}
                    placeholder="Select roles"
                    isClearable
                    classNamePrefix="react-select"
                    className="react-select-container"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: state.isFocused ? '#3C50E0' : '#E2E8F0',
                        boxShadow: state.isFocused ? '0 0 0 1px #3C50E0' : 'none',
                        '&:hover': {
                          borderColor: state.isFocused ? '#3C50E0' : '#E2E8F0'
                        },
                        padding: '2px',
                        borderRadius: '0.5rem',
                        backgroundColor: 'transparent'
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999
                      })
                    }}
                  />
                )}
              />
            </div>

            {!isEditMode && (
              <InputField
                type="password"
                id="password"
                labelName="Password"
                placeholder="Password"
                {...register("Password", { required: "Password is required" })}
                error={!!errors.Password}
                errorMsg={errors.Password?.message as string}
                isRequired
              />
            )}

            <div className="flex items-center gap-4">
              <Checkbox label="Active" {...register("IsActive")} id="isActive" />
            </div>
          </div>
        </ComponentCard>

        <div className="mt-3 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/user")}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
            disabled={adding || updating || isSubmitting}
          >
            {isEditMode ? "Update User" : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormUser;