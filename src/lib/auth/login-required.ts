export const LOGIN_REQUIRED_MESSAGE = "请先登录";
export const LOGIN_REQUIRED_PARAM = "loginRequired";

const AUTH_ROUTE_PREFIXES = ["/login", "/register"];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function buildLoginRequiredUrl(redirectTo?: string) {
  const params = new URLSearchParams({
    [LOGIN_REQUIRED_PARAM]: "1",
  });

  if (redirectTo) {
    params.set("redirectTo", redirectTo);
  }

  return `/login?${params.toString()}`;
}

export function redirectToLoginRequired() {
  if (typeof window === "undefined") {
    return;
  }

  const currentUrl = new URL(window.location.href);

  if (isAuthRoute(currentUrl.pathname)) {
    return;
  }

  const redirectTo = `${currentUrl.pathname}${currentUrl.search}`;
  window.location.replace(buildLoginRequiredUrl(redirectTo));
}
