"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export const description = "A pie chart with a label list";

interface RoundedPieChartProps {
    chartData: any[];
    chartConfig: ChartConfig;
    title?: string;
    description?: string;
    dataKey: string;
    nameKey: string;
}

export function RoundedPieChart({
    chartData,
    chartConfig,
    title = "Pie Chart",
    description,
    dataKey,
    nameKey
}: RoundedPieChartProps) {

    return (
        <Card className="flex flex-col max-h-100 gap-0">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-2xl text-center">
                    {title}
                    <Badge
                        variant="outline"
                        className="text-green-500 bg-green-500/10 border-none ml-2"
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span>5.2%</span>
                    </Badge>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-62.5"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey={nameKey} hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            innerRadius={20}
                            dataKey={dataKey}
                            radius={10}
                            cornerRadius={5}
                            paddingAngle={1}
                        >
                            <LabelList
                                dataKey={dataKey}
                                stroke="none"
                                fontSize={12}
                                fontWeight={500}
                                fill="currentColor"
                                formatter={(value: number) => value.toString()}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
