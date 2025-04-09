# دليل إعداد مشروع Wemarka WMAI

## متطلبات النظام

- Node.js (الإصدار 18.0.0 أو أحدث)
- npm (الإصدار 8.0.0 أو أحدث)
- محرر نصوص أو بيئة تطوير متكاملة (VS Code موصى به)

## خطوات الإعداد

### 1. تثبيت الأدوات الأساسية

```bash
# تثبيت Node.js و npm
# قم بزيارة https://nodejs.org وتثبيت أحدث إصدار LTS

# التحقق من التثبيت
node --version
npm --version
```

### 2. استنساخ المشروع

```bash
# استنساخ المستودع
git clone https://github.com/your-organization/wemarka-wmai.git
cd wemarka-wmai
```

### 3. تثبيت التبعيات

```bash
npm install
```

### 4. إعداد المتغيرات البيئية

قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع وأضف المتغيرات البيئية اللازمة:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_api_base_url
```

### 5. تشغيل خادم التطوير

```bash
npm run dev
```

سيتم تشغيل التطبيق على `http://localhost:5173` افتراضياً.

## هيكل المشروع

```
src/
├── components/       # مكونات واجهة المستخدم القابلة لإعادة الاستخدام
├── modules/          # وحدات النظام المختلفة
├── lib/              # أدوات وخدمات مساعدة
├── types/            # تعريفات TypeScript
├── stories/          # قصص Storybook للمكونات
└── tempobook/        # ملفات خاصة بمنصة Tempo
```

## أوامر مفيدة

```bash
# تشغيل خادم التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# معاينة نسخة الإنتاج محلياً
npm run preview

# تشغيل فحص الأخطاء
npm run lint
```

## الخطوات التالية

بعد إعداد المشروع بنجاح، يمكنك البدء في تطوير الميزات المختلفة باتباع خطة التطوير الموضحة في ملف `development-plan.md`.

## حل المشكلات الشائعة

### مشكلة: فشل تثبيت التبعيات

**الحل**: جرب حذف مجلد `node_modules` وملف `package-lock.json` ثم أعد تشغيل `npm install`.

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### مشكلة: أخطاء في خادم التطوير

**الحل**: تأكد من تثبيت جميع التبعيات وإعداد المتغيرات البيئية بشكل صحيح. جرب إعادة تشغيل خادم التطوير.

```bash
npm run dev
```

### مشكلة: أخطاء TypeScript

**الحل**: تأكد من توافق إصدار TypeScript مع الإصدارات الأخرى من التبعيات. قد تحتاج إلى تحديث ملف `tsconfig.json`.
