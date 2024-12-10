import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResultCard({ result }) {
  return (
    <Card className="border-red-500 text-center hover:border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="mx-auto text-center text-lg font-medium">
          {result.date}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="my-2 text-2xl font-bold">{result.score}</div>
      </CardContent>
    </Card>
  );
}
