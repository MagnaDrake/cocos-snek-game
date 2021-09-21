export interface ILoginOptions {
  hidePopup: 0 | 1; // 0: don't hide (android only) | 1: hide
  redirectPath: string; // path used by android to go to after the login is successful
  redirectTab: 0 | 1; // 0: sign up | 1: sign in
}

export enum LoginRespStatus {
  FAILED = 0,
  SUCCESS = 1,
  CANCELED = 2,
}

export type LoginCallback = (status: { status: LoginRespStatus }) => void;
export type LoginT = (options: ILoginOptions, callback?: LoginCallback) => void;

type TConfigurePageParam = {
  title?: string,
  showNavbar: boolean,
}
export type TConfigurePage = (config: TConfigurePageParam) => void;
