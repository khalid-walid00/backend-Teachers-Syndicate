// helpers/options.js
const { Page, WidgetPage } = require("../models/schema");

async function getOptionsByTypeFromSchema(schema) {
    if (!schema || typeof schema !== "object") return {};

    const result = {};

    for (const key in schema) {
        const field = schema[key];
        if (!field || !field.type) continue;

        if (field.type === "pages") {
            const pages = await Page.find({}, { _id: 1, title: 1, slug: 1 })
                .lean()
             
            result[key] = pages;
        }

        if (field.type === "widgetPages") {
            const wPages = await WidgetPage.find({}, { _id: 1, title: 1 })
                .lean()
                .then(wPages => wPages.map(w => ({
                    label: w.title,
                    value: w._id
                })));
            result[key] = wPages;
        }
    }

    return result;
}

module.exports = {
    getOptionsByTypeFromSchema
};
