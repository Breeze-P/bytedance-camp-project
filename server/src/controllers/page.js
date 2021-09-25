import {Page} from '../model/page.js';

export class PageController {
    async pages() {
        return Page.findAll();
    }

    async createPage(payload) {
        const newPage = await Page.create({
            baseid: payload.baseid,
            icon: payload.icon
        });
    }

    async deletePage(pageid) {
        await Page.destroy({
            where: {
                pageid
            }
        });
    }
}
