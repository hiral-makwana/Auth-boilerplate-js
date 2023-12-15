import { Request, Response, NextFunction } from 'express';
declare const HandleErrorMessage: (err: any, req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export default HandleErrorMessage;
