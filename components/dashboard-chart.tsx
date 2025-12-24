"use client";

import { Post } from "@/lib/generated/prisma/client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

const chartConfig = {} satisfies ChartConfig;

interface ChartProps {
  data: Post[];
}

export default function DashboardChart({ data }: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Views</CardTitle>
        <CardDescription>Trending posts by number of views</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} maxBarSize={60}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="title"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <Bar dataKey="views" fill="#2563eb" radius={4} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}