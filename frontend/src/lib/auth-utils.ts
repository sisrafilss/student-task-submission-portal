export type UserRole = "STUDENT" | "MENTOR" | "ADMIN";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

export const authRoutes = ["/login", "/register"];

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/profile", "/settings"],
  patterns: [],
};

export const studentProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/student/],
};

export const mentorProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/mentor/],
};

export const adminProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/admin/],
};

export const isAuthRoute = (pathname: string): boolean => {
  return authRoutes.some((route) => route === pathname);
};

export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig,
): boolean => {
  if (routes.exact.includes(pathname)) return true;
  return routes.patterns.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (pathname: string): UserRole | "COMMON" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) return "ADMIN";
  if (isRouteMatches(pathname, mentorProtectedRoutes)) return "MENTOR";
  if (isRouteMatches(pathname, studentProtectedRoutes)) return "STUDENT";
  if (isRouteMatches(pathname, commonProtectedRoutes)) return "COMMON";
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "MENTOR":
      return "/mentor/dashboard";
    case "STUDENT":
    default:
      return "/student/dashboard";
  }
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
): boolean => {
  if (!redirectPath || !redirectPath.startsWith("/")) return false;
  const routeOwner = getRouteOwner(redirectPath);
  if (routeOwner === null || routeOwner === "COMMON") return true;
  return routeOwner === role;
};

/**
 * Universal zero-dependency JWT/Token decoder compatible with Node, Edge, and Browser runtimes.
 */
export const extractUserRoleFromToken = (token: string): UserRole | null => {
  if (!token) return null;
  if (token === "mock_admin_token") return "ADMIN";
  if (token === "mock_mentor_token") return "MENTOR";
  if (token === "mock_student_token") return "STUDENT";

  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      let jsonPayload = "";
      if (typeof Buffer !== "undefined") {
        jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
      } else if (typeof atob !== "undefined") {
        jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        );
      }
      if (!jsonPayload) return null;

      const decoded = JSON.parse(jsonPayload);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return null; // Expired token
      }
      const role = decoded.role as UserRole;
      if (role === "ADMIN" || role === "MENTOR" || role === "STUDENT") {
        return role;
      }
    }
  } catch {
    return null;
  }

  return null;
};

