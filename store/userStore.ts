export type IUserInfo = {
  nickname?: string;
  email?: string;
  userId?: string;
}

export interface IUserStore {
  userInfo: IUserInfo,
  setUserInfo: (value: IUserInfo) => void;
}

const userStore = (): IUserStore => {
  return {
    userInfo: {},
    setUserInfo: function (value) {
      this.userInfo = value;
    }
  }
}

export default userStore;