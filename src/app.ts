import { createModel } from './models/index'
import createRoutes from './routers/index.route'
import { getModels } from './helper/utils'
//import { updateSwaggerBasePath } from './docs/swagger'
import swaggerRoute from './routers/swaggerRoute';
import { updateEmailConfig, initEmail } from './helper/emailConfig';
import { createUploader } from './helper/mediaUpload';
import { profileUpload } from './controller/user.controller';

export { createModel, getModels, createRoutes, swaggerRoute, updateEmailConfig, initEmail, createUploader, profileUpload }