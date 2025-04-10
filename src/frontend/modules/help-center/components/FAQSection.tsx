import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/frontend/components/ui/accordion";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { getAllFAQs, getFAQCategories } from "@/frontend/services/faqService";
import { FAQ, FAQCategory } from "@/frontend/types/faq";
import { AlertCircle, Loader2 } from "lucide-react";

interface FAQSectionProps {
  searchQuery?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ searchQuery = "" }) => {
  const { direction, language } = useLanguage();
  const isRTL = direction === "rtl";
  const currentLang = isRTL ? "ar" : "en";

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch FAQs and categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch FAQs
        const faqsData = await getAllFAQs(currentLang);
        setFaqs(faqsData);

        // Fetch unique categories
        const categoryIds = await getFAQCategories(currentLang);

        // Create category objects with localized names
        const categoryObjects: FAQCategory[] = categoryIds.map((id) => ({
          id,
          name: getCategoryName(id, isRTL),
        }));

        setCategories(categoryObjects);
      } catch (err) {
        console.error("Error fetching FAQ data:", err);
        setError(
          isRTL
            ? "حدث خطأ أثناء تحميل الأسئلة الشائعة. يرجى المحاولة مرة أخرى لاحقًا."
            : "An error occurred while loading FAQs. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentLang, isRTL]);

  // Helper function to get localized category names
  const getCategoryName = (categoryId: string, isRTL: boolean): string => {
    const categoryMap: Record<string, { en: string; ar: string }> = {
      general: { en: "General", ar: "عام" },
      account: { en: "Account", ar: "الحساب" },
      store: { en: "Store", ar: "المتجر" },
      marketing: { en: "Marketing", ar: "التسويق" },
      accounting: { en: "Accounting", ar: "المحاسبة" },
      "customer-service": { en: "Customer Service", ar: "خدمة العملاء" },
    };

    return categoryMap[categoryId]
      ? isRTL
        ? categoryMap[categoryId].ar
        : categoryMap[categoryId].en
      : categoryId; // Fallback to the ID if no mapping exists
  };

  // Filter FAQs based on search query and active category
  useEffect(() => {
    if (faqs.length === 0) return;

    let filtered = faqs;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(lowerCaseQuery) ||
          faq.answer.toLowerCase().includes(lowerCaseQuery),
      );
    }

    if (activeCategory) {
      filtered = filtered.filter((faq) => faq.category === activeCategory);
    }

    setFilteredFAQs(filtered);
  }, [searchQuery, activeCategory, faqs]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">
          {isRTL ? "جاري التحميل..." : "Loading..."}
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {isRTL ? "حدث خطأ" : "Error"}
        </h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge
          variant={activeCategory === null ? "default" : "outline"}
          className="cursor-pointer text-sm py-2 px-4"
          onClick={() => setActiveCategory(null)}
        >
          {isRTL ? "الكل" : "All"}
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className="cursor-pointer text-sm py-2 px-4"
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>

      {filteredFAQs.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">
            {isRTL ? "لم يتم العثور على نتائج" : "No results found"}
          </h3>
          <p className="text-muted-foreground">
            {isRTL
              ? "حاول استخدام كلمات مفتاحية مختلفة أو تصفح جميع الأسئلة الشائعة"
              : "Try using different keywords or browse all FAQs"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQSection;
