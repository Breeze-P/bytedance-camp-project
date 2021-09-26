import KoaRouter from 'koa-router';
import {BaseController} from '../controllers/base.js';
import fetch from 'node-fetch'
globalThis.fetch = fetch

const baseRoute = new KoaRouter({
    prefix: '/api/base'
});

baseRoute.get('/', async function (ctx) {
    const data = await fetch("https://qc9rmq.fn.thelarkcloud.com/getProjectList").then(
        res => res.json()
    ).then(
        data => data.projectList
    ).catch((e) => {
        console.log(e);
    });

    ctx.set("Content-Type","application/json");
    ctx.body = {
        data,
        message: 'ok'
    };
    ctx.body=JSON.stringify(ctx.body);
});

baseRoute.post('/', async function(ctx, next) {
    console.log('post online');
    const payload = ctx.request.body;

    const result = await fetch("https://qc9rmq.fn.thelarkcloud.com/insertProject",
        {method: 'POST', headers: {'content-type': 'application/json'}, body: payload})
    ctx.body = {
        data: result._id,
        message: 'ok'
    };

    return ctx.body;
});


baseRoute.put('/:id', async function(ctx) {
    const id = Number(ctx.params.id);
    const payload = ctx.request.body;
    if (isNaN(id)) {
        ctx.statusCode = 400;
        ctx.body = {
            message: 'id must be number',
        };
    } else {
        await new BaseController().updateBase(id, payload);
        ctx.body = {
            message: 'ok'
        }
    }
});

baseRoute.delete('/:id', async function(ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) {
        ctx.statusCode = 400;
        ctx.body = {
            message: 'id must be number',
        };
    } else {
        await new BaseController().deleteBase(id);
        ctx.body = {
            message: 'ok'
        }
    }
});


export {
    baseRoute
}
