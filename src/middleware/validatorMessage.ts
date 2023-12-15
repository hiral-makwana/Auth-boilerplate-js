import { isCelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';

interface CustomErrorMessages {
    [key: string]: {
        [validationType: string]: string;
    };
}

const HandleErrorMessage = async (err: any, req: Request, res: Response, next: NextFunction) => {
    try {
        if (isCelebrateError(err)) {
            let errorBody: any = {}
            if (err.details.get('body')) {
                errorBody = err.details.get('body');
            } else if (err.details.get('query')) {
                errorBody = err.details.get('query');
            } else if (err.details.get('headers')) {
                errorBody = err.details.get('headers');
            }
            if (errorBody.details && errorBody.details.length > 0) {
                const firstError = errorBody.details[0];
                const errorKey = firstError.context.key;
                const validationType = firstError.type;
                const errorMessage = firstError.message;

                // Check if custom error messages were provided
                const customMessages: CustomErrorMessages = req.body.messages || {};
                if (customMessages[errorKey] && customMessages[errorKey][validationType]) {
                    return res.status(400).send({ status: false, message: customMessages[errorKey][validationType] });
                } else if (customMessages[validationType]) {
                    return res.status(400).send({ status: false, message: customMessages[validationType] });
                } else {
                    // Fallback to Celebrate error message
                    return res.status(400).send({ status: false, message: errorMessage });
                }
            }

        }
    } catch (e: any) {
        return res.status(400).send({ status: false, message: e.message })
    }
}

export default HandleErrorMessage