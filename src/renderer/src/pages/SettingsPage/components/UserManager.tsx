import { useUserStore } from "@renderer/store/userStore";

export const UserManager: React.FC = () => {
  const { users } = useUserStore();

  return (
    <div className="flex max-w-md flex-col gap-2 px-6 py-4">
      <span className="text-lg font-semibold">Users:</span>
      <div>
        {users.map((user) => (
          <div key={user.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={user.picture} alt="User" className="h-8 w-8 rounded-full" />
              <span>{user.username}</span>
            </div>
            <div className="flex flex-col">
              <span>Token:</span>
              <input
                className="rounded-md border border-white bg-transparent px-2 py-1"
                value={user.token}
              />
            </div>
            <div className="flex flex-col">
              <span>Refresh Token:</span>
              <input
                className="rounded-md border border-white bg-transparent px-2 py-1"
                value={user.refreshToken}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
