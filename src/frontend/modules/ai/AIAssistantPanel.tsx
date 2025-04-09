import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Sparkles,
  AlertCircle,
  HelpCircle,
  LineChart,
  Lightbulb,
  CheckCircle,
  Clock,
  BarChart,
  PieChart,
  Zap,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useAI } from "@/frontend/contexts/AIContext";
import { Badge } from "@/frontend/components/ui/badge";

interface AIAssistantPanelProps {
  onClose: () => void;
  currentSystem?: string;
  initialPrompt?: string;
}

type MessageType = {
  role: "user" | "assistant";
  content: string;
  type?:
    | "general"
    | "analysis"
    | "recommendation"
    | "help"
    | "error"
    | "success"
    | "insight"
    | "forecast";
  timestamp?: Date;
};

const AIAssistantPanel = ({
  onClose,
  currentSystem = "Dashboard",
  initialPrompt,
}: AIAssistantPanelProps) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";
  const { currentPrompt } = useAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant",
      content: isRTL
        ? `مرحباً! أنا مساعدك الذكي لوحدة ${currentSystem}. يمكنني مساعدتك في تحليل البيانات، تقديم التوصيات، حل المشكلات التقنية، تقديم رؤى تحليلية، توقع الاتجاهات المستقبلية، وأتمتة المهام المتكررة. يمكنك طلب تحليل للمبيعات، أو توصيات لتحسين الأداء، أو المساعدة في حل مشكلة، أو استكشاف فرص جديدة. ما الذي تحتاج مساعدة فيه اليوم؟`
        : `Hello! I'm your AI assistant for the ${currentSystem} module. I can help with data analysis, recommendations, troubleshooting, insights, forecasting trends, and automating repetitive tasks. You can ask for sales analysis, performance improvement recommendations, help with solving an issue, or exploring new opportunities. What do you need help with today?`,
      type: "general",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle initial prompt from context or props
  useEffect(() => {
    if (currentPrompt || initialPrompt) {
      const promptToUse = currentPrompt || initialPrompt;
      setInput(promptToUse || "");
      if (promptToUse) {
        // Auto-send the initial prompt
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "user", content: promptToUse },
          ]);

          // Simulate AI response
          setIsTyping(true);
          setTimeout(() => {
            const messageType = getMessageType(promptToUse);
            const responseContent = generateResponse(
              promptToUse,
              messageType,
              currentSystem,
              isRTL,
            );

            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: responseContent,
                type: messageType,
                timestamp: new Date(),
              },
            ]);
            setIsTyping(false);
          }, 1500);

          setInput("");
        }, 500);
      }
    }
  }, [currentPrompt, initialPrompt, currentSystem, isRTL]);

  const getMessageType = (text: string): MessageType["type"] => {
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes("error") ||
      lowerText.includes("issue") ||
      lowerText.includes("problem") ||
      lowerText.includes("خطأ") ||
      lowerText.includes("مشكلة") ||
      lowerText.includes("عطل") ||
      lowerText.includes("صعوبة") ||
      lowerText.includes("لا يعمل") ||
      lowerText.includes("فشل") ||
      lowerText.includes("معطل") ||
      lowerText.includes("توقف") ||
      lowerText.includes("خلل") ||
      lowerText.includes("عطل") ||
      lowerText.includes("مشاكل") ||
      lowerText.includes("أخطاء") ||
      lowerText.includes("صعوبات") ||
      lowerText.includes("مشكل") ||
      lowerText.includes("عطب") ||
      lowerText.includes("تعطل") ||
      lowerText.includes("إصلاح")
    ) {
      return "error";
    }
    if (
      lowerText.includes("analysis") ||
      lowerText.includes("analyze") ||
      lowerText.includes("trend") ||
      lowerText.includes("تحليل") ||
      lowerText.includes("اتجاه") ||
      lowerText.includes("احصائيات") ||
      lowerText.includes("بيانات") ||
      lowerText.includes("أرقام") ||
      lowerText.includes("مؤشرات") ||
      lowerText.includes("حلل") ||
      lowerText.includes("قارن") ||
      lowerText.includes("دراسة") ||
      lowerText.includes("إحصاء") ||
      lowerText.includes("تحليلات") ||
      lowerText.includes("مقارنة") ||
      lowerText.includes("تقرير") ||
      lowerText.includes("تقارير") ||
      lowerText.includes("أداء") ||
      lowerText.includes("إحصائيات") ||
      lowerText.includes("رسم بياني") ||
      lowerText.includes("تحليلي") ||
      lowerText.includes("قياسات") ||
      lowerText.includes("معدلات") ||
      lowerText.includes("نسب")
    ) {
      return "analysis";
    }
    if (
      lowerText.includes("recommend") ||
      lowerText.includes("suggestion") ||
      lowerText.includes("advice") ||
      lowerText.includes("توصية") ||
      lowerText.includes("اقتراح") ||
      lowerText.includes("نصيحة") ||
      lowerText.includes("اقترح") ||
      lowerText.includes("أفضل") ||
      lowerText.includes("ماذا تقترح") ||
      lowerText.includes("ما رأيك") ||
      lowerText.includes("أوصي") ||
      lowerText.includes("ينصح") ||
      lowerText.includes("أنصح") ||
      lowerText.includes("اقترح علي") ||
      lowerText.includes("ما هو الأفضل") ||
      lowerText.includes("توصيات") ||
      lowerText.includes("اقتراحات") ||
      lowerText.includes("نصائح") ||
      lowerText.includes("ماذا تنصح") ||
      lowerText.includes("ما هي خياراتي") ||
      lowerText.includes("ما تنصح به") ||
      lowerText.includes("ما هي النصيحة") ||
      lowerText.includes("ما هو اقتراحك") ||
      lowerText.includes("ما هي توصيتك") ||
      lowerText.includes("اقترح لي") ||
      lowerText.includes("أعطني نصيحة") ||
      lowerText.includes("أعطني اقتراح")
    ) {
      return "recommendation";
    }
    if (
      lowerText.includes("help") ||
      lowerText.includes("how to") ||
      lowerText.includes("guide") ||
      lowerText.includes("مساعدة") ||
      lowerText.includes("كيف") ||
      lowerText.includes("دليل") ||
      lowerText.includes("شرح") ||
      lowerText.includes("اشرح") ||
      lowerText.includes("علمني") ||
      lowerText.includes("طريقة") ||
      lowerText.includes("ساعدني") ||
      lowerText.includes("أرشدني") ||
      lowerText.includes("وضح لي") ||
      lowerText.includes("كيفية") ||
      lowerText.includes("تعليمات") ||
      lowerText.includes("استفسار") ||
      lowerText.includes("سؤال") ||
      lowerText.includes("استخدام") ||
      lowerText.includes("تشغيل") ||
      lowerText.includes("أريد معرفة") ||
      lowerText.includes("أرني") ||
      lowerText.includes("أخبرني") ||
      lowerText.includes("دلني") ||
      lowerText.includes("إرشاد") ||
      lowerText.includes("توجيه") ||
      lowerText.includes("تعلم") ||
      lowerText.includes("فهم") ||
      lowerText.includes("استخدم")
    ) {
      return "help";
    }
    if (
      lowerText.includes("success") ||
      lowerText.includes("complete") ||
      lowerText.includes("finished") ||
      lowerText.includes("نجاح") ||
      lowerText.includes("اكتمل") ||
      lowerText.includes("تم") ||
      lowerText.includes("أنجزت") ||
      lowerText.includes("ممتاز") ||
      lowerText.includes("رائع") ||
      lowerText.includes("إنجاز") ||
      lowerText.includes("أحسنت") ||
      lowerText.includes("جيد جدا") ||
      lowerText.includes("بنجاح") ||
      lowerText.includes("تهانينا") ||
      lowerText.includes("أحسنت") ||
      lowerText.includes("عمل جيد") ||
      lowerText.includes("مبروك") ||
      lowerText.includes("أكملت") ||
      lowerText.includes("انتهيت") ||
      lowerText.includes("أتممت") ||
      lowerText.includes("نجحت") ||
      lowerText.includes("تمام") ||
      lowerText.includes("جيد") ||
      lowerText.includes("إتمام")
    ) {
      return "success";
    }
    if (
      lowerText.includes("insight") ||
      lowerText.includes("discover") ||
      lowerText.includes("رؤية") ||
      lowerText.includes("اكتشاف") ||
      lowerText.includes("فهم") ||
      lowerText.includes("ملاحظة") ||
      lowerText.includes("استنتاج") ||
      lowerText.includes("لاحظت") ||
      lowerText.includes("أفكار") ||
      lowerText.includes("رؤى") ||
      lowerText.includes("نظرة عميقة") ||
      lowerText.includes("استبصار") ||
      lowerText.includes("ماذا تلاحظ") ||
      lowerText.includes("ملاحظات") ||
      lowerText.includes("اكتشفت") ||
      lowerText.includes("لاحظ") ||
      lowerText.includes("أفكار جديدة") ||
      lowerText.includes("معلومات مفيدة") ||
      lowerText.includes("بصيرة") ||
      lowerText.includes("تبصر") ||
      lowerText.includes("استكشاف") ||
      lowerText.includes("ما لاحظته") ||
      lowerText.includes("ما استنتجته") ||
      lowerText.includes("ما اكتشفته") ||
      lowerText.includes("تحليل عميق") ||
      lowerText.includes("فهم أعمق")
    ) {
      return "insight";
    }
    if (
      lowerText.includes("forecast") ||
      lowerText.includes("predict") ||
      lowerText.includes("future") ||
      lowerText.includes("توقع") ||
      lowerText.includes("تنبؤ") ||
      lowerText.includes("مستقبل") ||
      lowerText.includes("متى") ||
      lowerText.includes("سيحدث") ||
      lowerText.includes("المستقبلي") ||
      lowerText.includes("تخمين") ||
      lowerText.includes("استشراف") ||
      lowerText.includes("ما هي التوقعات") ||
      lowerText.includes("كيف سيكون") ||
      lowerText.includes("المستقبلية") ||
      lowerText.includes("تنبؤات") ||
      lowerText.includes("توقعات") ||
      lowerText.includes("ماذا سيحدث") ||
      lowerText.includes("المستقبل") ||
      lowerText.includes("الاتجاهات المستقبلية") ||
      lowerText.includes("استقراء") ||
      lowerText.includes("تقدير") ||
      lowerText.includes("تكهن") ||
      lowerText.includes("ما المتوقع") ||
      lowerText.includes("ما هو المتوقع") ||
      lowerText.includes("ما هي الاتجاهات") ||
      lowerText.includes("ما هو الاتجاه") ||
      lowerText.includes("ما هي التنبؤات") ||
      lowerText.includes("ما هو التنبؤ")
    ) {
      return "forecast";
    }
    return "general";
  };

  const generateResponse = (
    input: string,
    type: MessageType["type"],
    system: string,
    isRTL: boolean,
  ): string => {
    switch (type) {
      case "analysis":
        return isRTL
          ? `سأقوم بتحليل البيانات المتعلقة بـ ${system}. يمكنني مساعدتك في فهم الاتجاهات والأنماط الحالية، وتقديم رؤى مفصلة حول أداء عملك.

إليك بعض النقاط الرئيسية من التحليل الأولي:
• زيادة في معدل التحويل بنسبة 15% مقارنة بالشهر الماضي
• انخفاض في تكلفة الاكتساب بنسبة 8%
• زيادة في متوسط قيمة الطلب بنسبة 12%
• تحسن في معدل الاحتفاظ بالعملاء بنسبة 5%
• زيادة في عدد الزيارات من الهواتف المحمولة بنسبة 22%

هل ترغب في تحليل أعمق لأي من هذه النقاط؟ يمكنني تقديم توصيات محددة بناءً على هذه البيانات.`
          : `I'll analyze the data related to ${system}. I can help you understand current trends and patterns, and provide detailed insights about your business performance.

Here are some key points from the initial analysis:
• 15% increase in conversion rate compared to last month
• 8% decrease in acquisition cost
• 12% increase in average order value
• 5% improvement in customer retention rate
• 22% increase in mobile visits

Would you like a deeper analysis on any of these points? I can provide specific recommendations based on this data.`;
      case "recommendation":
        return isRTL
          ? `بناءً على بيانات ${system} الخاصة بك، أوصي بالنظر في الخيارات التالية: 

1. تحسين استراتيجيات التسويق لزيادة المبيعات
   • استهداف العملاء المحتملين بناءً على سلوك التصفح
   • تحسين محتوى البريد الإلكتروني للحملات
   • زيادة الاستثمار في قنوات التسويق ذات الأداء العالي
   • استخدام الذكاء الاصطناعي لتخصيص العروض حسب اهتمامات العملاء

2. تحسين إدارة المخزون لتقليل التكاليف
   • أتمتة عمليات إعادة الطلب
   • تحسين التنبؤ بالطلب
   • تقليل المخزون الزائد للمنتجات بطيئة الحركة
   • تطبيق نظام تتبع المخزون في الوقت الفعلي

3. تطوير برنامج ولاء العملاء لزيادة معدل الاحتفاظ
   • تقديم مكافآت مخصصة بناءً على سلوك الشراء
   • إنشاء نظام نقاط للمشتريات المتكررة
   • تقديم عروض حصرية للعملاء المخلصين
   • إطلاق برنامج الإحالة لتشجيع العملاء على جلب عملاء جدد

4. تحسين تجربة المستخدم على المنصة
   • تبسيط عملية الدفع لتقليل معدل التخلي عن سلة التسوق
   • تحسين سرعة تحميل الموقع للأجهزة المحمولة
   • إضافة خاصية الدردشة المباشرة لدعم العملاء

هل ترغب في معرفة المزيد عن أي من هذه التوصيات؟ يمكنني تقديم خطة تنفيذية مفصلة.`
          : `Based on your ${system} data, I recommend considering the following options:

1. Optimize marketing strategies to increase sales
   • Target potential customers based on browsing behavior
   • Improve email content for campaigns
   • Increase investment in high-performing marketing channels
   • Use AI to personalize offers based on customer interests

2. Improve inventory management to reduce costs
   • Automate reordering processes
   • Enhance demand forecasting
   • Reduce excess inventory for slow-moving products
   • Implement real-time inventory tracking system

3. Develop a customer loyalty program to increase retention rates
   • Offer personalized rewards based on purchase behavior
   • Create a points system for repeat purchases
   • Provide exclusive offers to loyal customers
   • Launch a referral program to encourage customers to bring new clients

4. Enhance user experience on the platform
   • Streamline checkout process to reduce cart abandonment
   • Improve mobile site loading speed
   • Add live chat feature for customer support

Would you like to know more about any of these recommendations? I can provide a detailed implementation plan.`;
      case "help":
        return isRTL
          ? `يمكنني مساعدتك في استخدام وحدة ${system}. إليك دليل سريع للميزات الرئيسية:

• لوحة المعلومات: عرض نظرة عامة على الأداء والمقاييس الرئيسية
• التقارير: إنشاء تقارير مخصصة وتصديرها بتنسيقات مختلفة
• الإعدادات: تخصيص تفضيلات العرض والإشعارات
• التحليلات: استكشاف البيانات التفصيلية واتجاهات الأداء
• الذكاء الاصطناعي: الحصول على توصيات وتحليلات ذكية
• التنبيهات: إعداد إشعارات للأحداث المهمة
• التكامل: ربط البيانات مع الأنظمة الأخرى

يمكنك أيضًا استخدام الأوامر التالية للتفاعل معي:
• "تحليل البيانات" - للحصول على تحليل للبيانات الحالية
• "اقترح تحسينات" - للحصول على توصيات لتحسين الأداء
• "كيفية استخدام..." - للحصول على شرح لميزة معينة

هل هناك ميزة معينة ترغب في معرفة المزيد عنها؟`
          : `I can help you use the ${system} module. Here's a quick guide to the main features:

• Dashboard: View an overview of performance and key metrics
• Reports: Create custom reports and export in various formats
• Settings: Customize display preferences and notifications
• Analytics: Explore detailed data and performance trends
• AI: Get intelligent recommendations and analyses
• Alerts: Set up notifications for important events
• Integration: Connect data with other systems

You can also use the following commands to interact with me:
• "Analyze data" - to get an analysis of current data
• "Suggest improvements" - to get recommendations for performance enhancement
• "How to use..." - to get an explanation of a specific feature

Is there a specific feature you'd like to know more about?`;
      case "error":
        return isRTL
          ? `أنا آسف لسماع أنك تواجه مشكلة في ${system}. دعنا نحاول حلها معًا.

الخطوات الشائعة لاستكشاف الأخطاء وإصلاحها:
1. تحديث الصفحة وإعادة المحاولة
2. التحقق من اتصالك بالإنترنت
3. مسح ذاكرة التخزين المؤقت للمتصفح
4. تسجيل الخروج وإعادة تسجيل الدخول
5. التأكد من تحديث المتصفح إلى أحدث إصدار
6. تعطيل أي إضافات قد تتعارض مع النظام

إذا كنت تواجه مشكلة محددة، يمكنني مساعدتك بشكل أفضل إذا قمت بتزويدي بالمعلومات التالية:
• وصف دقيق للمشكلة
• الخطوات التي أدت إلى المشكلة
• أي رسائل خطأ ظهرت
• الجهاز والمتصفح الذي تستخدمه

هل يمكنك تقديم مزيد من التفاصيل حول المشكلة التي تواجهها؟`
          : `I'm sorry to hear you're experiencing an issue with ${system}. Let's try to resolve it together.

Common troubleshooting steps:
1. Refresh the page and try again
2. Check your internet connection
3. Clear your browser cache
4. Log out and log back in
5. Make sure your browser is updated to the latest version
6. Disable any extensions that might interfere with the system

If you're facing a specific issue, I can help you better if you provide the following information:
• Precise description of the problem
• Steps that led to the issue
• Any error messages displayed
• Device and browser you're using

Can you provide more details about the problem you're facing?`;
      case "success":
        return isRTL
          ? `ممتاز! تم إكمال العملية بنجاح في وحدة ${system}.

إليك ملخص للإجراءات المتخذة:
• تم حفظ جميع التغييرات
• تم تحديث البيانات ذات الصلة
• تم تطبيق الإعدادات الجديدة
• تم تسجيل العملية في سجل النشاطات

الخطوات التالية المقترحة:
• مراجعة التغييرات للتأكد من دقتها
• إعلام أعضاء الفريق الآخرين بالتحديثات
• جدولة مراجعة دورية للنتائج

هل هناك أي شيء آخر ترغب في القيام به في وحدة ${system}؟`
          : `Excellent! The process has been successfully completed in the ${system} module.

Here's a summary of the actions taken:
• All changes have been saved
• Related data has been updated
• New settings have been applied
• The operation has been logged in the activity log

Suggested next steps:
• Review changes to ensure accuracy
• Inform other team members about the updates
• Schedule a periodic review of results

Is there anything else you'd like to do in the ${system} module?`;
      case "insight":
        return isRTL
          ? `بناءً على تحليل بيانات ${system} الخاصة بك، اكتشفت بعض الرؤى المثيرة للاهتمام:

• العملاء الذين يشترون المنتج A غالبًا ما يشترون أيضًا المنتج B (فرصة للبيع المتقاطع)
• أوقات الذروة للمبيعات هي بين الساعة 7-9 مساءً (فرصة لتحسين توقيت الحملات)
• 65% من العملاء يستخدمون الأجهزة المحمولة للتسوق (فرصة لتحسين تجربة الهاتف المحمول)
• العملاء الذين يقرؤون مراجعات المنتجات لديهم معدل تحويل أعلى بنسبة 30% (فرصة لإبراز المراجعات)
• المنتجات ذات الصور المتعددة تحقق مبيعات أعلى بنسبة 40% (فرصة لتحسين عرض المنتجات)

التوصيات بناءً على هذه الرؤى:
1. إنشاء حزم منتجات للعناصر المرتبطة غالبًا
2. جدولة الحملات الإعلانية خلال ساعات الذروة
3. تحسين تجربة التسوق عبر الهاتف المحمول
4. إبراز مراجعات العملاء بشكل أكثر وضوحًا
5. إضافة المزيد من الصور عالية الجودة للمنتجات

هل ترغب في استكشاف أي من هذه الرؤى بشكل أعمق؟`
          : `Based on analyzing your ${system} data, I've discovered some interesting insights:

• Customers who purchase Product A often also buy Product B (cross-selling opportunity)
• Peak sales times are between 7-9 PM (opportunity to optimize campaign timing)
• 65% of customers use mobile devices for shopping (opportunity to enhance mobile experience)
• Customers who read product reviews have a 30% higher conversion rate (opportunity to highlight reviews)
• Products with multiple images achieve 40% higher sales (opportunity to improve product presentation)

Recommendations based on these insights:
1. Create product bundles for frequently associated items
2. Schedule advertising campaigns during peak hours
3. Enhance mobile shopping experience
4. Make customer reviews more prominent
5. Add more high-quality images to products

Would you like to explore any of these insights deeper?`;
      case "forecast":
        return isRTL
          ? `بناءً على الاتجاهات الحالية في وحدة ${system}، إليك توقعاتي للأشهر الثلاثة القادمة:

• المبيعات: من المتوقع زيادة بنسبة 18% مع نمو قوي في فئة المنتجات الرقمية
• التكاليف: من المتوقع انخفاض بنسبة 7% مع تحسينات في كفاءة سلسلة التوريد
• رضا العملاء: من المتوقع تحسن بنسبة 12% مع إطلاق ميزات جديدة
• معدل التحويل: من المتوقع زيادة بنسبة 10% مع تحسينات واجهة المستخدم
• حركة المرور: من المتوقع زيادة بنسبة 25% نتيجة لاستراتيجيات التسويق الجديدة

العوامل المؤثرة في هذه التوقعات:
• موسمية المبيعات بناءً على بيانات السنوات السابقة
• اتجاهات السوق الحالية والمنافسة
• التغييرات المخطط لها في المنتجات والخدمات
• استراتيجيات التسويق والترويج القادمة

هل ترغب في رؤية توقعات مفصلة لأي من هذه المجالات؟ يمكنني أيضًا تقديم توصيات لتعزيز النتائج الإيجابية.`
          : `Based on current trends in the ${system} module, here are my forecasts for the next three months:

• Sales: Expected 18% increase with strong growth in the digital products category
• Costs: Expected 7% decrease with improvements in supply chain efficiency
• Customer satisfaction: Expected 12% improvement with the launch of new features
• Conversion rate: Expected 10% increase with UI improvements
• Traffic: Expected 25% increase due to new marketing strategies

Factors influencing these forecasts:
• Sales seasonality based on previous years' data
• Current market trends and competition
• Planned changes in products and services
• Upcoming marketing and promotion strategies

Would you like to see detailed forecasts for any of these areas? I can also provide recommendations to enhance positive outcomes.`;
      default:
        return isRTL
          ? `شكرًا لرسالتك حول "${input}". كيف يمكنني مساعدتك بشكل أفضل في وحدة ${system}؟

يمكنني:
• تقديم تحليلات للبيانات والأداء
• تقديم توصيات لتحسين النتائج
• المساعدة في استخدام الميزات المختلفة
• حل المشكلات التقنية
• تقديم رؤى وتوقعات مستقبلية
• إنشاء تقارير مخصصة
• أتمتة المهام المتكررة
• تحسين استراتيجيات التسويق

يمكنك استخدام الأوامر التالية:
• "تحليل" - للحصول على تحليل البيانات
• "توصيات" - للحصول على اقتراحات للتحسين
• "مساعدة" - للحصول على دليل استخدام
• "توقعات" - للحصول على تنبؤات مستقبلية

ما الذي تود أن أساعدك به اليوم؟`
          : `Thank you for your message about "${input}". How can I better assist you with the ${system} module?

I can:
• Provide analyses of data and performance
• Offer recommendations to improve results
• Help with using different features
• Solve technical issues
• Provide insights and future forecasts
• Create custom reports
• Automate repetitive tasks
• Improve marketing strategies

You can use the following commands:
• "Analysis" - to get data analysis
• "Recommendations" - to get improvement suggestions
• "Help" - to get usage guide
• "Forecast" - to get future predictions

What would you like me to help you with today?`;
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input, timestamp: new Date() },
    ]);

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const messageType = getMessageType(input);
      const responseContent = generateResponse(
        input,
        messageType,
        currentSystem,
        isRTL,
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responseContent,
          type: messageType,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);

    setInput("");
  };

  const getMessageIcon = (type?: MessageType["type"]) => {
    const marginClass = isRTL ? "ml-2" : "mr-2";
    switch (type) {
      case "analysis":
        return <LineChart className={`h-4 w-4 ${marginClass} text-blue-500`} />;
      case "recommendation":
        return (
          <Lightbulb className={`h-4 w-4 ${marginClass} text-amber-500`} />
        );
      case "help":
        return (
          <HelpCircle className={`h-4 w-4 ${marginClass} text-green-500`} />
        );
      case "error":
        return (
          <AlertCircle className={`h-4 w-4 ${marginClass} text-red-500`} />
        );
      case "success":
        return (
          <CheckCircle className={`h-4 w-4 ${marginClass} text-emerald-500`} />
        );
      case "insight":
        return <Zap className={`h-4 w-4 ${marginClass} text-indigo-500`} />;
      case "forecast":
        return (
          <BarChart className={`h-4 w-4 ${marginClass} text-violet-500`} />
        );
      default:
        return (
          <Sparkles className={`h-4 w-4 ${marginClass} text-purple-500`} />
        );
    }
  };

  const getMessageTypeLabel = (type?: MessageType["type"], isRTL: boolean) => {
    switch (type) {
      case "analysis":
        return isRTL ? "تحليل البيانات" : "Data Analysis";
      case "recommendation":
        return isRTL ? "توصية" : "Recommendation";
      case "help":
        return isRTL ? "مساعدة" : "Help";
      case "error":
        return isRTL ? "حل مشكلة" : "Troubleshooting";
      case "success":
        return isRTL ? "إنجاز ناجح" : "Success";
      case "insight":
        return isRTL ? "رؤية تحليلية" : "Insight";
      case "forecast":
        return isRTL ? "توقعات مستقبلية" : "Forecast";
      default:
        return isRTL ? "المساعد الذكي" : "AI Assistant";
    }
  };

  return (
    <div
      className="w-96 h-[500px] bg-card rounded-lg shadow-elevated border flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        fontFamily: isRTL ? "'Tajawal', sans-serif" : "inherit",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="p-4 border-b flex items-center justify-between bg-primary/5">
        <h3 className="font-medium flex items-center">
          <Sparkles
            className={cn("h-5 w-5 text-primary", isRTL ? "ml-2" : "mr-2")}
          />
          {isRTL
            ? `المساعد الذكي - ${currentSystem}`
            : `AI Assistant - ${currentSystem}`}
        </h3>
        <div className="flex items-center gap-1.5">
          <Badge
            variant="outline"
            className="text-xs bg-primary/10 text-primary"
          >
            {isRTL ? "ذكي" : "Smart"}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-semibold"
          >
            WMAI
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label={isRTL ? "إغلاق" : "Close"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
              )}
            >
              {message.role === "assistant" && (
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {getMessageIcon(message.type)}
                    <span
                      className="text-xs font-medium"
                      style={{
                        marginRight: isRTL ? "0" : "4px",
                        marginLeft: isRTL ? "4px" : "0",
                      }}
                    >
                      {getMessageTypeLabel(message.type, isRTL)}
                    </span>
                  </div>
                  {message.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              )}
              <div className="whitespace-pre-line">{message.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex items-center">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div
          className={cn(
            "flex items-center",
            isRTL ? "space-x-reverse space-x-2" : "space-x-2",
          )}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={
              isRTL
                ? `اكتب سؤالك حول ${currentSystem} هنا...`
                : `Type your question about ${currentSystem} here...`
            }
            className="flex-1 border rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={isRTL ? "أدخل سؤالك هنا" : "Enter your question here"}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={isTyping}
            className="flex-shrink-0 h-10 w-10"
            aria-label={isRTL ? "إرسال" : "Send"}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          {isRTL
            ? "اكتب 'مساعدة' للدليل، 'تحليل' للإحصائيات، 'توصيات' للاقتراحات، 'رؤى' للأفكار، 'توقعات' للتنبؤات، 'مشكلة' للمساعدة في حل المشاكل، أو 'نجاح' لتأكيد الإنجاز"
            : "Type 'help' for guidance, 'analysis' for analytics, 'recommendations' for suggestions, 'insights' for ideas, 'forecast' for predictions, 'issue' for troubleshooting, or 'success' to confirm completion"}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
