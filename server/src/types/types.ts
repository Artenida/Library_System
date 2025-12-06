import type { Request } from "express";

export interface JwtPayload {
    user_id: string;
    role: string;
}

export type AuthRequest = Request & { user?: JwtPayload };
