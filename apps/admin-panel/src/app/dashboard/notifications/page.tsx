"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import NotificationForm from "./components/NotificationForm";

const page = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card>
        <CardHeader className="min-w-[550px]">
          <h3 className="text-xl">Уведомления</h3>
        </CardHeader>
        <CardContent>
          <NotificationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
