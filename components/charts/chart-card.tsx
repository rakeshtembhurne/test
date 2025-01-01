import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChartCard({ chart, color }) {
  let typeClass = color ? `border-${color}-500 hover:border-${color}-700` : "";
  return (
    <Card className={`border-2 text-center hover:border-2 ${typeClass}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="mx-auto text-center text-sm font-medium">
          {chart.startTime.toLocaleTimeString()} -{" "}
          {chart.endTime.toLocaleTimeString()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="my-2 text-2xl font-bold">{chart.title}</div>
        <p className="text-xl font-semibold">{chart.score}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <a href={`/charts/${chart.id}`}>All Results</a>
        </Button>
        <Button variant="default" size="sm">
          <a href={`/charts/${chart.id}/play`}>Play Now</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
