import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

type ROLES = ["ADMIN", "BARBER", "CLIENT"];

export const Roles = (...roles: ROLES) => SetMetadata(ROLES_KEY, roles);
