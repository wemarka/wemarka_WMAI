import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";
import { Button } from "@/frontend/components/ui/button";
import { Textarea } from "@/frontend/components/ui/textarea";
import { useToast } from "@/frontend/components/ui/use-toast";
import StarRating from "./StarRating";
import { saveFeedback } from "@/frontend/services/feedbackService";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModule?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  currentModule,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: isRTL ? "يرجى تقديم تقييم" : "Please provide a rating",
        description: isRTL
          ? "يرجى تحديد تقييم قبل الإرسال"
          : "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await saveFeedback({
        rating,
        feedback: feedback.trim() || undefined,
        module: currentModule,
      });

      toast({
        title: isRTL ? "تم إرسال التعليقات" : "Feedback Submitted",
        description: isRTL
          ? "شكرًا لك على تعليقاتك! سنستخدمها لتحسين تجربتك."
          : "Thank you for your feedback! We'll use it to improve your experience.",
        variant: "default",
      });

      // Reset form and close modal
      setRating(0);
      setFeedback("");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: isRTL ? "خطأ في الإرسال" : "Submission Error",
        description: isRTL
          ? "حدث خطأ أثناء إرسال تعليقاتك. يرجى المحاولة مرة أخرى."
          : "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setFeedback("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "شاركنا برأيك" : "Share Your Feedback"}
          </DialogTitle>
          <DialogDescription>
            {isRTL
              ? "كيف تقيم تجربتك مع Wemarka WMAI؟"
              : "How would you rate your experience with Wemarka WMAI?"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-6 py-4">
          <div className="flex flex-col items-center space-y-4">
            <StarRating
              rating={rating}
              onChange={setRating}
              size="lg"
              className="justify-center"
            />
            <p className="text-sm text-muted-foreground">
              {rating === 0
                ? isRTL
                  ? "اختر تقييمًا"
                  : "Select a rating"
                : isRTL
                  ? `تقييمك: ${rating} من 5`
                  : `Your rating: ${rating} of 5`}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {isRTL
                ? "تعليقات إضافية (اختياري)"
                : "Additional Comments (Optional)"}
            </h4>
            <Textarea
              placeholder={
                isRTL
                  ? "شاركنا بأفكارك حول كيفية تحسين تجربتك..."
                  : "Share your thoughts on how we can improve your experience..."
              }
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? isRTL
                ? "جارٍ الإرسال..."
                : "Submitting..."
              : isRTL
                ? "إرسال"
                : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
