import { useState, useEffect, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
} from "lucide-react";

// Define section types
interface Section {
  id: string;
  type: string;
  title: string;
  content: any;
  settings?: any;
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [layoutName, setLayoutName] = useState("Home Page");
  const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(
    layoutId || null,
  );

  // Auto-save timer
  const autoSaveTimerRef = useRef<number | null>(null);

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
        const layoutData = {
          name: layoutName,
          sections: sections,
        };

        let result;
        if (currentLayoutId) {
          // Update existing layout
          result = await supabase
            .from("homepage_draft_layouts")
            .update({
              sections: layoutData.sections,
              name: layoutData.name,
              updated_at: new Date().toISOString(),
            })
            .eq("id", currentLayoutId)
            .select()
            .single();
        } else {
          // Create new layout
          result = await supabase
            .from("homepage_draft_layouts")
            .insert({
              name: layoutData.name,
              sections: layoutData.sections,
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
    [currentLayoutId, layoutName, sections, toast, language],
  );

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
  }, [sections, saveLayout]);

  // Load layout from Supabase
  useEffect(() => {
    const loadLayout = async () => {
      if (currentLayoutId) {
        try {
          const { data, error } = await supabase
            .from("homepage_draft_layouts")
            .select("*")
            .eq("id", currentLayoutId)
            .single();

          if (error) throw error;
          if (data) {
            setSections(data.sections);
            setLayoutName(data.name);
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">
              {language === "ar" ? "المحرر" : "Editor"}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {language === "ar" ? "إعدادات القسم" : "Section Settings"}
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
                  <CardTitle>Add Sections</CardTitle>
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
                  <CardTitle>Page Sections</CardTitle>
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
                                Add sections from the left panel
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
                    ? `Edit ${sections.find((s) => s.id === selectedSectionId)?.title}`
                    : "Select a section to edit"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedSectionId ? (
                  <p className="text-muted-foreground">
                    Please select a section from the editor to modify its
                    settings
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p>
                      Settings panel for the selected section will be
                      implemented here
                    </p>
                    <Separator />
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("editor")}
                    >
                      Back to Editor
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Page Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 min-h-[400px] bg-white">
                  <p className="text-center text-muted-foreground">
                    Preview of your homepage will be displayed here
                  </p>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("editor")}
                  >
                    Back to Editor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HomePageEditor;
