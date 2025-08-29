const { WidgetCategory, Widget } = require("../../../models/schema");
const slugify = require("slugify");

const createWidgetCategory = async (req, res) => {
  try {
    const { title, description, icon, widgets } = req.body;

    if (!title) {
      return res.status(400).json({ message: "العنوان (title) مطلوب" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const existingCategory = await WidgetCategory.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: "هذا العنوان مستخدم بالفعل، الرجاء تغييره" });
    }
    const HasWidget = await Widget.findOne({ category: widgets })
    if (HasWidget) {
      return res.status(400).json({ message: "الويدجت غير موجود" });
    }
    const widgetCategory = await WidgetCategory.create({
      title,
      slug,
      description: description || "",
      icon: icon || "",
      widgets: [],
    });

    res.sendSuccess(widgetCategory, "تم إنشاء فئة الويجت بنجاح");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ في الخادم", error: err.message });
  }
};

module.exports = {
  createWidgetCategory,
};
