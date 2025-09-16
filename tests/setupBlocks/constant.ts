export type UserRole = "client" | "vendor";
export const ACTIVE_BACKEND: "quality-api" | "qa-api" = "qa-api"; // Change backend here

// export function USERS(target: "quality-api" | "qa-api", role: UserRole) {
export function USERS(role) {
  if (ACTIVE_BACKEND === "qa-api") {
    if (role === "client") {
      return {
        FRONT_END: "https://client-main.preview.procol.tech/",
        BACKEND_INSTANCE: "qa-api",
        LOGIN_METHOD: "phone",
        USER_MOBILE: "1000000104",
        OTP: "987321"
      };
    } else {
      return {
        FRONT_END: "https://vendor-main.preview.procol.tech/",
        BACKEND_INSTANCE: "qa-api",
        LOGIN_METHOD: "phone",
        USER_MOBILE: "1000000312",
        OTP: "987321"
      };
    }
  }
  if (ACTIVE_BACKEND === "quality-api") {
    if (role === "client") {
      return {
        FRONT_END: "https://client-feat-rfq-grid-migration.preview.procol.tech/",
        BACKEND_INSTANCE: "quality-api",
        LOGIN_METHOD: "phone",
        USER_MOBILE: "7009009001",
        OTP: "987321"
      };
    } else {
      return {
        FRONT_END: "https://vendor-test-best-q.preview.procol.tech/",
        BACKEND_INSTANCE: "quality-api",
        LOGIN_METHOD: "phone",
        USER_MOBILE: "1000000312",
        OTP: "987321"
      };
    }
  }

  throw new Error(`Invalid target (${ACTIVE_BACKEND}) or role`);
}

export const TEST_TIMEOUT = 180000;


