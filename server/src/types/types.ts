import type { Request } from "express";

export interface JwtPayload {
    id: string;
    role: string;
}

export type AuthRequest = Request & { user?: JwtPayload };
