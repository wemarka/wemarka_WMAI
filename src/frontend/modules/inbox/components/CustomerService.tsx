import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

const CustomerService = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unified Inbox</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Messages from all channels will be displayed here</p>
      </CardContent>
    </Card>
  );
};

export default CustomerService;
