import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { question, context } = await req.json();

    if (!question) {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // In a real implementation, you would call OpenAI API here
    // For now, we'll simulate a response based on the question
    let responseText =
      "I'm sorry, I don't have enough information to answer that question.";

    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes("product") || lowerQuestion.includes("منتج")) {
      responseText =
        "To add a new product, go to the 'Store' section in the dashboard, then click on 'Product Manager'. Click the 'Add New Product' button and fill in the required details such as name, description, price, and images.";
    } else if (
      lowerQuestion.includes("marketing") ||
      lowerQuestion.includes("campaign") ||
      lowerQuestion.includes("تسويق") ||
      lowerQuestion.includes("حملة")
    ) {
      responseText =
        "To create a new marketing campaign, go to the 'Marketing' section in the dashboard, then click on 'Campaign Manager'. Click the 'Create New Campaign' button and follow the steps to define your target audience, budget, and content.";
    } else if (
      lowerQuestion.includes("ai") ||
      lowerQuestion.includes("assistant") ||
      lowerQuestion.includes("ذكاء") ||
      lowerQuestion.includes("مساعد")
    ) {
      responseText =
        "You can access the AI assistant by clicking the sparkle button in the bottom right corner of any screen. You can ask natural language questions, request content generation, analyze data, and get action suggestions.";
    } else if (
      lowerQuestion.includes("inbox") ||
      lowerQuestion.includes("message") ||
      lowerQuestion.includes("صندوق") ||
      lowerQuestion.includes("رسائل")
    ) {
      responseText =
        "The unified inbox brings all customer communications into one place, including email, WhatsApp, Facebook Messenger, Instagram, and live chat. You can respond to messages, assign them to team members, and use tags and categories to organize them.";
    } else {
      responseText =
        "I can help you with using the Wemarka WMAI system. Please ask a specific question about any feature or function you need assistance with.";
    }

    return new Response(JSON.stringify({ response: responseText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
