import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUser {
  id: number;
  username: string;
  picture?: string;
  token?: string;
  refreshToken?: string;
}

interface IUserStore {
  currentUserId?: number;
  users: IUser[];
  selectUser: (userId: number) => void;
  addUser: (user: IUser) => void;
  removeUser: (username: number) => void;
  updateUserToken: (userId: number, token: string, refreshToken?: string) => void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    (set) => ({
      currentUser: undefined,
      users: [],
      selectUser: (userId) => set({ currentUserId: userId }),
      addUser: (user) => {
        const userExists = useUserStore.getState().users.some((u) => u.id === user.id);

        if (userExists) {
          set((state) => ({
            users: state.users.map((u) => {
              if (u.id === user.id) {
                return user;
              }
              return u;
            }),
          }));
        } else {
          set((state) => ({ users: [...state.users, user] }));
        }

        set({ currentUserId: user.id });
      },
      removeUser: (userId) =>
        set((state) => ({ users: state.users.filter((user) => user.id !== userId) })),
      updateUserToken: (userId, token, refreshToken) =>
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === userId) {
              return { ...user, token, refreshToken };
            }
            return user;
          }),
        })),
    }),
    { name: "user" },
  ),
);

export const useCurrentUser = () =>
  useUserStore((state) => {
    if (state.currentUserId) {
      return state.users.find((user) => user.id === state.currentUserId);
    }
    return undefined;
  });

export const getCurrentUser = () => {
  return useUserStore
    .getState()
    .users.find((user) => user.id === useUserStore.getState().currentUserId);
};
