const nunjucks = require('nunjucks');
const { Page, Widget,WidgetPage } = require('../models/schema');

nunjucks.configure({ autoescape: true });

async function renderPageBySlug(slug = 'home') {
  const page = await Page.findOne({ slug, isPublished: true })
    .populate('widgetPage');
  if (!page) throw new Error('الصفحة غير موجودة');

  // هات كل الصفحات (عشان نستخدمها في الهيدر)
  const allPages = await Page.find({ isPublished: true });

  // هيدر و فوتر ويدجتس
  const headerWidgets = await Widget.find({ type: 'site-header', published: true });
  const footerWidgets = await Widget.find({ type: 'site-footer', published: true });

  const headerHTML = await Promise.all(
    headerWidgets.map(widget =>
      nunjucks.renderString(widget.template, {
        ...(widget.data || {}),
        pages: allPages, 
      })
    )
  );

  // رندر محتوى الصفحة
  const widgetsSorted = page.widgetPage.sort((a, b) => (a.order || 0) - (b.order || 0));
  const widgetsHTML = await Promise.all(
    widgetsSorted.map(widget => nunjucks.renderString(widget.template, widget.data))
  );

  // رندر الفوتر
  const footerHTML = await Promise.all(
    footerWidgets.map(widget =>
      nunjucks.renderString(widget.template, widget.data)
    )
  );

  const pageContent = widgetsHTML.join('\n');

  const layoutTemplate = `
  <!DOCTYPE html>
  <html lang="ar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ title }}</title>
    <style>
      :root {
        --main-color: {{ mainColor | default('#7f1d1d') }};
        --secondary-color: {{ secondaryColor | default('#fcd34d') }};
        --font-family: {{ fontFamily | default('Arial, sans-serif') }};
      }
      body { font-family: var(--font-family); }
    </style> 
  </head>
  <body>
    <header>{{ header | safe }}</header>
    <main style="min-height: 100vh">{{ content | safe }}</main>
    <footer>{{ footer | safe }}</footer>
  </body>
  </html>
  `;

  return nunjucks.renderString(layoutTemplate, {
    title: page.title,
    content: pageContent,
    header: headerHTML.join('\n'),
    footer: footerHTML.join('\n'),
  });
}

module.exports = { renderPageBySlug };




/*********    رندر صفحة واحدة */


// const nunjucks = require('nunjucks');
// const path = require('path');
// const Widget = require('../models/Widget');
// const Template = require('../models/Template');

// nunjucks.configure(path.join(__dirname, '..', 'themes'), {
//   autoescape: true,
//   watch: false,
// });

// async function renderWidget(widget, extraContext = {}) {
//   const tpl = widget.template; 
//   const context = { ...(widget.data || {}), widget, ...extraContext };
//   return nunjucks.render(tpl, context);
// }

// async function renderPageBySlug(slug, options = {}) {
//   const Page = require('../models/Page');
//   const widgets = await Widget.find({ page: options.pageId }).sort({ order: 1 })
//   const htmlFragments = [];
//   for (const w of widgets) {
//     const frag = await renderWidget(w, options.context || {});
//     htmlFragments.push(frag);
//   }
//   const pageHtml = nunjucks.render('layout.njk', {
//     content: htmlFragments.join('\n'),
//     page: options.pageMeta || {}
//   });
//   return pageHtml;
// }

// module.exports = { renderWidget, renderPageBySlug };
