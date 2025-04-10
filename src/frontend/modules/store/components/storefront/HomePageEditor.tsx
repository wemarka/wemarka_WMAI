import { useState, useEffect, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Separator } from "@/frontend/components/ui/separator";
import { useToast } from "@/frontend/components/ui/use-toast";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import {
  PlusCircle,
  Trash2,
  MoveVertical,
  Settings,
  Eye,
  Save,
  Undo2,
  Redo2,
  Upload,
  Globe,
  Palette,
  Check,
  Loader2,
} from "lucide-react";
import ThemeSettings, {
  ThemeSettings as ThemeSettingsType,
} from "./ThemeSettings";

// Define section types
interface Section {
  id: string;
  type: string;
  title: string;
  content: any;
  settings?: any;
}

// Define layout interface
interface Layout {
  id: string;
  user_id: string;
  name: string;
  sections: Section[];
  theme_settings?: ThemeSettingsType;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Sample sections for initial state
const initialSections: Section[] = [
  {
    id: "hero-section",
    type: "hero",
    title: "Hero Banner",
    content: {
      heading: "Welcome to Your Store",
      subheading: "Discover amazing products at great prices",
      buttonText: "Shop Now",
      backgroundImage:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80",
    },
  },
  {
    id: "featured-products",
    type: "products",
    title: "Featured Products",
    content: {
      heading: "Featured Products",
      productIds: ["1", "2", "3", "4"],
    },
  },
  {
    id: "testimonials",
    type: "testimonials",
    title: "Customer Testimonials",
    content: {
      heading: "What Our Customers Say",
      testimonials: [
        { id: "1", author: "John Doe", text: "Great products and service!" },
        {
          id: "2",
          author: "Jane Smith",
          text: "Fast shipping and excellent quality.",
        },
      ],
    },
  },
];

// Default theme settings
const defaultThemeSettings: ThemeSettingsType = {
  colors: {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#8b5cf6",
    background: "#ffffff",
    text: "#1f2937",
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
    size: "medium",
  },
  layout: {
    containerWidth: "1200px",
    spacing: "medium",
    borderRadius: "medium",
    useShadows: true,
  },
};

// Available section templates that can be added
const sectionTemplates = [
  {
    type: "hero",
    title: "Hero Banner",
    icon: "🖼️",
    description: "Large banner with heading, subheading and call to action",
  },
  {
    type: "products",
    title: "Product Grid",
    icon: "🛍️",
    description: "Display a grid of products",
  },
  {
    type: "testimonials",
    title: "Testimonials",
    icon: "💬",
    description: "Customer reviews and testimonials",
  },
  {
    type: "text",
    title: "Text Block",
    icon: "📝",
    description: "Rich text content area",
  },
  {
    type: "image-text",
    title: "Image with Text",
    icon: "🖼️",
    description: "Image alongside text content",
  },
  {
    type: "newsletter",
    title: "Newsletter Signup",
    icon: "📧",
    description: "Email subscription form",
  },
];

interface HomePageEditorProps {
  layoutId?: string;
  isRTL?: boolean;
}

const HomePageEditor = ({ layoutId, isRTL = false }: HomePageEditorProps) => {
  const { toast } = useToast();
  const { direction, language } = useLanguage();
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [activeTab, setActiveTab] = useState("editor");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [layoutName, setLayoutName] = useState("Home Page");
  const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(
    layoutId || null,
  );
  const [themeSettings, setThemeSettings] =
    useState<ThemeSettingsType>(defaultThemeSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [availableLayouts, setAvailableLayouts] = useState<Layout[]>([]);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Auto-save timer
  const autoSaveTimerRef = useRef<number | null>(null);

  // Load available layouts
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        const { data, error } = await supabase
          .from("homepage_layouts")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        if (data) setAvailableLayouts(data);
      } catch (error) {
        console.error("Error fetching layouts:", error);
      }
    };

    fetchLayouts();
  }, []);

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  // Save layout to Supabase
  const saveLayout = useCallback(
    async (isDraft = true) => {
      setIsSaving(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) {
          throw new Error("User not authenticated");
        }

        const layoutData = {
          name: layoutName,
          sections: sections,
          theme_settings: themeSettings,
          user_id: userData.user.id,
        };

        let result;
        if (currentLayoutId) {
          // Update existing layout
          result = await supabase
            .from("homepage_layouts")
            .update({
              sections: layoutData.sections,
              name: layoutData.name,
              theme_settings: layoutData.theme_settings,
              updated_at: new Date().toISOString(),
            })
            .eq("id", currentLayoutId)
            .select()
            .single();
        } else {
          // Create new layout
          result = await supabase
            .from("homepage_layouts")
            .insert({
              name: layoutData.name,
              sections: layoutData.sections,
              theme_settings: layoutData.theme_settings,
              user_id: layoutData.user_id,
              is_published: false,
            })
            .select()
            .single();

          if (result.data) {
            setCurrentLayoutId(result.data.id);
          }
        }

        if (result.error) {
          throw result.error;
        }

        setLastSaved(new Date());

        if (!isDraft) {
          // Show success message for manual saves
          toast({
            title:
              language === "ar"
                ? "تم الحفظ بنجاح"
                : "Layout saved successfully",
            description: new Date().toLocaleTimeString(),
          });
        } else {
          // Show subtle message for auto-saves
          toast({
            title: language === "ar" ? "تم الحفظ مؤقتًا" : "Draft saved",
            description: new Date().toLocaleTimeString(),
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error saving layout:", error);
        toast({
          title: language === "ar" ? "خطأ في الحفظ" : "Error saving layout",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [currentLayoutId, layoutName, sections, themeSettings, toast, language],
  );

  // Publish layout
  const publishLayout = async () => {
    if (!currentLayoutId) {
      await saveLayout(false);
    }

    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from("homepage_layouts")
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq("id", currentLayoutId);

      if (error) throw error;

      setIsPublished(true);
      setShowPublishDialog(false);

      toast({
        title:
          language === "ar"
            ? "تم النشر بنجاح"
            : "Layout published successfully",
        description:
          language === "ar"
            ? "أصبح التخطيط الخاص بك متاحًا الآن على موقعك"
            : "Your layout is now live on your site",
      });
    } catch (error) {
      console.error("Error publishing layout:", error);
      toast({
        title: language === "ar" ? "خطأ في النشر" : "Error publishing layout",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Auto-save effect
  useEffect(() => {
    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }

    // Set a new timer for auto-save (10 seconds)
    autoSaveTimerRef.current = window.setTimeout(() => {
      if (sections.length > 0) {
        saveLayout(true); // true = isDraft
      }
    }, 10000);

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [sections, themeSettings, saveLayout]);

  // Load layout from Supabase
  useEffect(() => {
    const loadLayout = async () => {
      if (currentLayoutId) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("homepage_layouts")
            .select("*")
            .eq("id", currentLayoutId)
            .single();

          if (error) throw error;
          if (data) {
            setSections(data.sections || initialSections);
            setLayoutName(data.name || "Home Page");
            setThemeSettings(data.theme_settings || defaultThemeSettings);
            setIsPublished(data.is_published || false);
            setLastSaved(new Date(data.updated_at));
          }
        } catch (error) {
          console.error("Error loading layout:", error);
          toast({
            title:
              language === "ar"
                ? "خطأ في تحميل التخطيط"
                : "Error loading layout",
            description: (error as Error).message,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadLayout();
  }, [currentLayoutId, toast, language]);

  // Add a new section
  const addSection = (templateType: string) => {
    const template = sectionTemplates.find((t) => t.type === templateType);
    if (!template) return;

    const newSection: Section = {
      id: `${templateType}-${Date.now()}`,
      type: templateType,
      title: template.title,
      content: {},
    };

    setSections([...sections, newSection]);
  };

  // Remove a section
  const removeSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
    if (selectedSectionId === id) {
      setSelectedSectionId(null);
    }
  };

  // Select a section for editing
  const selectSection = (id: string) => {
    setSelectedSectionId(id);
    setActiveTab("settings");
  };

  // Handle theme settings change
  const handleThemeSettingsChange = (newSettings: ThemeSettingsType) => {
    setThemeSettings(newSettings);
  };

  // Load a different layout
  const loadLayout = async (layoutId: string) => {
    setCurrentLayoutId(layoutId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-medium">
            {language === "ar" ? "جاري تحميل التخطيط..." : "Loading layout..."}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen" dir={direction}>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {language === "ar" ? "محرر الصفحة الرئيسية" : "Home Page Editor"}
            </h1>
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                {language === "ar" ? "آخر حفظ:" : "Last saved:"}{" "}
                {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("preview")}
            >
              <Eye
                className={`${direction === "ltr" ? "mr-2" : "ml-2"} h-4 w-4`}
              />
              {language === "ar" ? "معاينة" : "Preview"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPublishDialog(true)}
              disabled={isSaving || isPublishing}
            >
              <Globe
                className={`${direction === "ltr" ? "mr-2" : "ml-2"} h-4 w-4`}
              />
              {isPublished
                ? language === "ar"
                  ? "تم النشر"
                  : "Published"
                : language === "ar"
                  ? "نشر"
                  : "Publish"}
            </Button>
            <Button
              size="sm"
              onClick={() => saveLayout(false)}
              disabled={isSaving}
            >
              <Save
                className={`${direction === "ltr" ? "mr-2" : "ml-2"} h-4 w-4`}
              />
              {isSaving
                ? language === "ar"
                  ? "جاري الحفظ..."
                  : "Saving..."
                : language === "ar"
                  ? "حفظ التغييرات"
                  : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="layoutName">
            {language === "ar" ? "اسم التخطيط" : "Layout Name"}
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="layoutName"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder={
                language === "ar" ? "أدخل اسم التخطيط" : "Enter layout name"
              }
              className="max-w-md"
            />
            {availableLayouts.length > 0 && (
              <div className="flex-shrink-0">
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onChange={(e) => loadLayout(e.target.value)}
                  value={currentLayoutId || ""}
                >
                  <option value="">
                    {language === "ar" ? "اختر تخطيطًا" : "Select a layout"}
                  </option>
                  {availableLayouts.map((layout) => (
                    <option key={layout.id} value={layout.id}>
                      {layout.name}{" "}
                      {layout.is_published
                        ? language === "ar"
                          ? "(منشور)"
                          : "(Published)"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor">
              {language === "ar" ? "المحرر" : "Editor"}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {language === "ar" ? "إعدادات القسم" : "Section Settings"}
            </TabsTrigger>
            <TabsTrigger value="theme">
              {language === "ar" ? "إعدادات السمة" : "Theme Settings"}
            </TabsTrigger>
            <TabsTrigger value="preview">
              {language === "ar" ? "معاينة" : "Preview"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Left sidebar - Section templates */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>
                    {language === "ar" ? "إضافة أقسام" : "Add Sections"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sectionTemplates.map((template) => (
                      <Button
                        key={template.type}
                        variant="outline"
                        className="w-full justify-start text-left"
                        onClick={() => addSection(template.type)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span className="mr-2">{template.icon}</span>
                        {template.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Main content - Sections list */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>
                    {language === "ar" ? "أقسام الصفحة" : "Page Sections"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {sections.length === 0 ? (
                            <div className="text-center p-8 border border-dashed rounded-lg">
                              <p className="text-muted-foreground">
                                {language === "ar"
                                  ? "أضف أقسامًا من اللوحة اليسرى"
                                  : "Add sections from the left panel"}
                              </p>
                            </div>
                          ) : (
                            sections.map((section, index) => (
                              <Draggable
                                key={section.id}
                                draggableId={section.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`border rounded-lg p-3 bg-card flex justify-between items-center ${selectedSectionId === section.id ? "ring-2 ring-primary" : ""}`}
                                  >
                                    <div className="flex items-center">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="mr-2 cursor-move"
                                      >
                                        <MoveVertical size={16} />
                                      </div>
                                      <span>{section.title}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          selectSection(section.id)
                                        }
                                      >
                                        <Settings size={16} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          removeSection(section.id)
                                        }
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedSectionId
                    ? `${language === "ar" ? "تعديل" : "Edit"} ${sections.find((s) => s.id === selectedSectionId)?.title}`
                    : language === "ar"
                      ? "اختر قسمًا للتعديل"
                      : "Select a section to edit"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedSectionId ? (
                  <p className="text-muted-foreground">
                    {language === "ar"
                      ? "الرجاء اختيار قسم من المحرر لتعديل إعداداته"
                      : "Please select a section from the editor to modify its settings"}
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p>
                      {language === "ar"
                        ? "لوحة الإعدادات للقسم المحدد ستظهر هنا"
                        : "Settings panel for the selected section will be implemented here"}
                    </p>
                    <Separator />
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("editor")}
                    >
                      {language === "ar"
                        ? "العودة إلى المحرر"
                        : "Back to Editor"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <ThemeSettings
              settings={themeSettings}
              onChange={handleThemeSettingsChange}
              onReset={() => setThemeSettings(defaultThemeSettings)}
            />
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "ar" ? "معاينة الصفحة" : "Page Preview"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded-lg p-4 min-h-[400px]"
                  style={{
                    backgroundColor: themeSettings.colors.background,
                    color: themeSettings.colors.text,
                    fontFamily: themeSettings.fonts.body,
                    borderRadius:
                      themeSettings.layout.borderRadius === "small"
                        ? "0.25rem"
                        : themeSettings.layout.borderRadius === "medium"
                          ? "0.5rem"
                          : "1rem",
                    boxShadow: themeSettings.layout.useShadows
                      ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                      : "none",
                  }}
                >
                  {sections.length === 0 ? (
                    <p className="text-center">
                      {language === "ar"
                        ? "لا توجد أقسام لعرضها. أضف بعض الأقسام في المحرر."
                        : "No sections to display. Add some sections in the editor."}
                    </p>
                  ) : (
                    <div className="space-y-8">
                      {sections.map((section) => (
                        <div key={section.id} className="border-b pb-8">
                          <h2
                            className="text-xl font-bold mb-2"
                            style={{ fontFamily: themeSettings.fonts.heading }}
                          >
                            {section.title}
                          </h2>
                          <div className="text-muted-foreground">
                            {section.type === "hero" && (
                              <div
                                className="relative h-64 rounded overflow-hidden flex items-center justify-center"
                                style={{
                                  backgroundImage: `url(${section.content?.backgroundImage})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              >
                                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                                <div className="relative text-white text-center p-6">
                                  <h3 className="text-2xl font-bold mb-2">
                                    {section.content?.heading}
                                  </h3>
                                  <p className="mb-4">
                                    {section.content?.subheading}
                                  </p>
                                  <button
                                    className="px-4 py-2 rounded"
                                    style={{
                                      backgroundColor:
                                        themeSettings.colors.primary,
                                    }}
                                  >
                                    {section.content?.buttonText || "Shop Now"}
                                  </button>
                                </div>
                              </div>
                            )}

                            {section.type === "products" && (
                              <div>
                                <h3 className="text-xl font-medium mb-4">
                                  {section.content?.heading}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  {Array.isArray(section.content?.productIds) &&
                                    section.content.productIds.map(
                                      (id: string) => (
                                        <div
                                          key={id}
                                          className="border rounded p-2"
                                        >
                                          <div className="bg-gray-100 h-32 mb-2 flex items-center justify-center">
                                            <span className="text-gray-400">
                                              Product Image
                                            </span>
                                          </div>
                                          <p className="font-medium">
                                            Product {id}
                                          </p>
                                          <p className="text-sm">$99.99</p>
                                        </div>
                                      ),
                                    )}
                                </div>
                              </div>
                            )}

                            {section.type === "testimonials" && (
                              <div>
                                <h3 className="text-xl font-medium mb-4">
                                  {section.content?.heading}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {Array.isArray(
                                    section.content?.testimonials,
                                  ) &&
                                    section.content.testimonials.map(
                                      (testimonial: any) => (
                                        <div
                                          key={testimonial.id}
                                          className="border rounded p-4"
                                        >
                                          <p className="italic mb-2">
                                            "{testimonial.text}"
                                          </p>
                                          <p className="font-medium text-right">
                                            — {testimonial.author}
                                          </p>
                                        </div>
                                      ),
                                    )}
                                </div>
                              </div>
                            )}

                            {section.type !== "hero" &&
                              section.type !== "products" &&
                              section.type !== "testimonials" && (
                                <div className="p-4 border border-dashed rounded flex items-center justify-center h-32">
                                  <p>{section.type} section preview</p>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("editor")}
                  >
                    {language === "ar" ? "العودة إلى المحرر" : "Back to Editor"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Publish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "ar" ? "نشر التخطيط" : "Publish Layout"}
            </DialogTitle>
            <DialogDescription>
              {language === "ar"
                ? "هل أنت متأكد أنك تريد نشر هذا التخطيط؟ سيصبح مرئيًا للزوار على موقعك."
                : "Are you sure you want to publish this layout? It will become visible to visitors on your site."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <h3 className="font-medium mb-2">{layoutName}</h3>
              <p className="text-sm text-muted-foreground">
                {language === "ar"
                  ? `${sections.length} قسم، آخر تحديث: ${lastSaved?.toLocaleString() || "لم يتم الحفظ بعد"}`
                  : `${sections.length} sections, last updated: ${lastSaved?.toLocaleString() || "Not saved yet"}`}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
            >
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={publishLayout}
              disabled={isPublishing}
              className="gap-2"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {language === "ar" ? "جاري النشر..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  {language === "ar" ? "نشر الآن" : "Publish Now"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePageEditor;
