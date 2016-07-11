export const setToken = (token: string) => {
  window.sessionStorage.setItem("user_token", token);
};

export const getToken = () => {
  return window.sessionStorage.getItem("user_token");
};

export const setMyProfile = (user: any) => {
  window.localStorage.setItem("my_profile", user);
};

export const getMyProfile = () => {
  return window.localStorage.getItem("my_profile");
};
