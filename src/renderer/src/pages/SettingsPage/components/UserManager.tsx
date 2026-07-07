import { useUserStore } from "@renderer/store/userStore";

export const UserManager: React.FC = () => {
  const { currentUserId, selectUser, users } = useUserStore();

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Profiles</h2>
          <p className="mt-1 text-sm leading-6 text-white/55">
            Switch between accounts already connected on this device.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70">
          {users.length}
        </span>
      </div>

      {users.length > 0 ? (
        <div className="flex flex-col gap-3">
          {users.map((user) => {
            const isCurrent = user.id === currentUserId;
            const initials = user.username.slice(0, 2).toUpperCase();

            return (
              <button
                key={user.id}
                className={
                  isCurrent
                    ? "flex items-center gap-3 rounded-md border border-[#E8C97E]/40 bg-[#E8C97E]/15 p-3 text-left"
                    : "flex items-center gap-3 rounded-md border border-white/10 bg-black/20 p-3 text-left transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                }
                onClick={() => selectUser(user.id)}
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt=""
                    className="size-10 rounded-full object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <span className="grid size-10 place-items-center rounded-full bg-white/10 text-sm font-semibold text-white">
                    {initials}
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-white">{user.username}</span>
                  <span className="block text-sm text-white/45">
                    {isCurrent ? "Current profile" : "Available profile"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-white/15 bg-black/20 px-4 py-6 text-center text-sm text-white/45">
          No accounts are connected yet.
        </div>
      )}
    </section>
  );
};
