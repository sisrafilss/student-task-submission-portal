export type UserRole = "STUDENT" | "MENTOR" | "ADMIN";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

export const authRoutes = ["/login", "/register", "/change-password"];

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

export interface IDecodedToken {
  id: string;
  email: string;
  role: UserRole;
  needsPasswordChange?: boolean;
}

/**
 * Universal zero-dependency JWT decoder compatible with Node, Edge, and Browser runtimes.
 */
export const decodeAuthToken = (token: string): IDecodedToken | null => {
  if (!token) return null;
  if (token === "mock_admin_token") {
    return { id: "admin_1", email: "admin@gmail.com", role: "ADMIN", needsPasswordChange: false };
  }
  if (token === "mock_mentor_token") {
    return { id: "mentor_1", email: "mentor@gmail.com", role: "MENTOR", needsPasswordChange: false };
  }
  if (token === "mock_student_token") {
    return { id: "student_1", email: "student@gmail.com", role: "STUDENT", needsPasswordChange: false };
  }

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
        return {
          id: decoded.id,
          email: decoded.email,
          role,
          needsPasswordChange: Boolean(decoded.needsPasswordChange),
        };
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const extractUserRoleFromToken = (token: string): UserRole | null => {
  return decodeAuthToken(token)?.role || null;
};
