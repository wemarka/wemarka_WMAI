import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface CampaignManagerProps {
  isRTL?: boolean;
}

const CampaignManager = ({ isRTL = false }: CampaignManagerProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "إدارة الحملات" : "Campaign Manager"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "جميع الحملات" : "All Campaigns"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض جميع الحملات" : "View all campaigns"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "إنشاء حملة" : "Create Campaign"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إنشاء حملة جديدة" : "Create a new campaign"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "قوالب الحملات" : "Campaign Templates"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "استخدام قوالب الحملات" : "Use campaign templates"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignManager;
