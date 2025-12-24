import SideModelDrawer from "../../../components/ui/SideModelDrawer";
import { useGetLoginHistoryQuery } from "../../../redux/user/userAPI";

const LoginHistoryModal = ({ isOpen, user, onClose }) => {
  const { data, isLoading } = useGetLoginHistoryQuery(user?.AppUserId, { skip: !user });

  return (
    <SideModelDrawer isOpen={isOpen} onClose={onClose} width="w-[30rem]" headerText="Login History">
      <div className="p-6">
        {isLoading && <div>Loading...</div>}
        {data?.Data?.length === 0 && <div className="text-gray-500">No login history found.</div>}
        <div className="flex flex-col gap-4">
          {data?.Data?.map((log, idx) => (
            <div key={idx} className="border bg-white dark:bg-boxdark dark:border-strokedark p-4 rounded-lg shadow-sm text-sm">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-black dark:text-white">Date:</span>
                <span>{log.LoginDate}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-black dark:text-white">IP:</span>
                <span>{log.IPAddress}</span>
              </div>
              <div className="mb-1">
                <span className="font-semibold text-black dark:text-white block">Device:</span>
                <span className="text-gray-600 dark:text-gray-400">{log.DeviceInfo}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold text-black dark:text-white">Status:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${log.Status === 'Success' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                  {log.Status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SideModelDrawer>
  );
};

export default LoginHistoryModal;