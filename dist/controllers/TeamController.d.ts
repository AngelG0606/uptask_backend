import type { Request, Response } from 'express';
export declare class TeamController {
    static findMemberByEmail: (req: Request, res: Response) => Promise<void>;
    static getProjectTeam: (req: Request, res: Response) => Promise<void>;
    static addMemberById: (req: Request, res: Response) => Promise<void>;
    static removeTeamMember: (req: Request, res: Response) => Promise<void>;
}
