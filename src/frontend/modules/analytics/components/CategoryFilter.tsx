import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  return (
    <Select
      value={selectedCategory || "all"}
      onValueChange={(value) =>
        onCategoryChange(value === "all" ? undefined : value)
      }
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={isRTL ? "اختر فئة" : "Select category"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          {isRTL ? "جميع الفئات" : "All Categories"}
        </SelectItem>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
