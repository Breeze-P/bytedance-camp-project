import combineRouters from 'koa-combine-routers';
import { baseRoute } from './base.js';
import {pageRoute} from './page.js'
const router = combineRouters(baseRoute,pageRoute);

export default router;
