import KoaRouter from 'koa-router';
import {PageController} from '../controllers/page.js';
const pageRoute = new KoaRouter({
    prefix: '/api/page'
});


pageRoute.get('/', async function (ctx) {
    const data = await new PageController().pages();
    ctx.body = {
        data,
        message: 'ok'
    };
});

pageRoute.post('/', async function(ctx) {
    const payload = ctx.request.body;
    await new PageController().createPage(payload);
    ctx.body = {
        message: 'ok'
    };
});


pageRoute.delete('/:id', async function(ctx) {
    const pageid=ctx.request.body;
    if (isNaN(pageid)) {
        ctx.statusCode = 400;
        ctx.body = {
            message: 'id must be number',
        };
    } else {
        await new PageController().deletePage(pageid);
        ctx.body = {
            message: 'ok'
        }
    }
});


export {
    pageRoute 
}
