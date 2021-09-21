enum OS {
  ANDROID = 'android',
  IOS = 'ios',
  OTHER = 'other',
}

interface UserAgentRes {
  isInApp: boolean;
  os: OS;
}

export const userAgentChecker = (): UserAgentRes => {
  const ua = navigator.userAgent || navigator.vendor;
  let isInApp: boolean = false;
  let os: OS = OS.OTHER;

  if (/beeshop/i.test(ua) || /shopee/i.test(ua)) {
    isInApp = true;
  }

  if (isInApp) {
    if (/android/i.test(ua)) {
      os = OS.ANDROID;
    } else if (/iPad|iPhone|iPod/i.test(ua)) {
      os = OS.IOS;
    }
  }
  return { isInApp, os };
};

export const isOnMobileApp = (): boolean => userAgentChecker().isInApp;

export const getAppPath = (url: string): string => {
  const a = { paths: [{ webNav: { url } }] };
  const b = btoa(JSON.stringify(a));
  return `home?navRoute=${encodeURIComponent(b)}`;
};
