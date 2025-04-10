import React, { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Textarea } from "@/frontend/components/ui/textarea";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface FeedbackButtonsProps {
  itemId: string;
  itemType: "faq" | "doc";
  onSubmitFeedback: (helpful: boolean, comment?: string) => Promise<void>;
  className?: string;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  itemId,
  itemType,
  onSubmitFeedback,
  className = "",
}) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackType, setFeedbackType] = useState<boolean | null>(null);

  const handleFeedback = async (helpful: boolean) => {
    setFeedbackType(helpful);
    setShowCommentBox(true);
  };

  const handleSubmitFeedback = async () => {
    if (feedbackType === null) return;

    setIsSubmitting(true);
    try {
      await onSubmitFeedback(feedbackType, comment.trim() || undefined);
      setFeedbackSubmitted(true);
      setShowCommentBox(false);
    } catch (error) {
      console.error(`Error submitting ${itemType} feedback:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (feedbackType === null) return;

    setIsSubmitting(true);
    try {
      await onSubmitFeedback(feedbackType);
      setFeedbackSubmitted(true);
      setShowCommentBox(false);
    } catch (error) {
      console.error(`Error submitting ${itemType} feedback:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedbackSubmitted) {
    return (
      <div
        className={`text-center text-sm text-muted-foreground mt-4 ${className}`}
      >
        {isRTL ? "شكراً على ملاحظاتك!" : "Thank you for your feedback!"}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!showCommentBox ? (
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {isRTL ? "هل كان هذا مفيداً؟" : "Was this helpful?"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFeedback(true)}
            className="flex items-center gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            {isRTL ? "نعم" : "Yes"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFeedback(false)}
            className="flex items-center gap-2"
          >
            <ThumbsDown className="h-4 w-4" />
            {isRTL ? "لا" : "No"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {feedbackType
              ? isRTL
                ? "رائع! هل ترغب في إضافة تعليق؟"
                : "Great! Would you like to add a comment?"
              : isRTL
                ? "نأسف لذلك. كيف يمكننا تحسين هذا المحتوى؟"
                : "We're sorry to hear that. How can we improve this content?"}
          </p>
          <Textarea
            placeholder={
              isRTL
                ? "أدخل تعليقك هنا (اختياري)"
                : "Enter your comment here (optional)"
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkip}
              disabled={isSubmitting}
            >
              {isRTL ? "تخطي" : "Skip"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isRTL
                  ? "جاري الإرسال..."
                  : "Submitting..."
                : isRTL
                  ? "إرسال"
                  : "Submit"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackButtons;
