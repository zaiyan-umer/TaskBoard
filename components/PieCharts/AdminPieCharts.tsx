'use client'
import { RoundedPieChart } from './RoundedPieChart';
import { ChartConfig } from '../ui/chart';
import { useStats } from '@/hooks/useStats';

const AdminPieCharts = () => {
    const { data } = useStats('admin-stats');
    const {Todo = 0, InProgress = 0, Done = 0, HighPriority = 0, LowPriority = 0, MediumPriority = 0} = data ?? {};

    const statusChartData = [
        { status: 'Todo', count: Todo, fill: 'var(--chart-todo)' },
        { status: 'InProgress', count: InProgress, fill: 'var(--chart-in-progress)' },
        { status: 'Done', count: Done, fill: 'var(--chart-done)' },
    ]

    const statusChartConfig = {
        count: {
            label: 'Tasks',
        },
        Todo: {
            label: 'Todo',
            color: 'var(--chart-todo)',
        },
        InProgress: {
            label: 'In Progress',
            color: 'var(--chart-in-progress)',
        },
        Done: {
            label: 'Done',
            color: 'var(--chart-done)',
        },
    } satisfies ChartConfig

    const priorityChartData = [
        { priority: 'HighPriority', count: HighPriority, fill: 'var(--chart-priority-high)' },
        { priority: 'MediumPriority', count: MediumPriority, fill: 'var(--chart-priority-medium)' },
        { priority: 'LowPriority', count: LowPriority, fill: 'var(--chart-priority-low)' },
    ]

    const priorityChartConfig = {
        count: {
            label: 'Tasks',
        },
        HighPriority: {
            label: 'High Priority',
            color: 'var(--chart-priority-high)',
        },
        MediumPriority: {
            label: 'Medium Priority',
            color: 'var(--chart-priority-medium)',
        },
        LowPriority: {
            label: 'Low Priority',
            color: 'var(--chart-priority-low)',
        },
    } satisfies ChartConfig;



    return (
        <>
            <RoundedPieChart
                chartData={statusChartData}
                chartConfig={statusChartConfig}
                title="Status breakdown"
                description="All Tasks"
                dataKey="count"
                nameKey="status"
            />
            <RoundedPieChart
                chartData={priorityChartData}
                chartConfig={priorityChartConfig}
                title="Priority breakdown"
                description="All Tasks"
                dataKey="count"
                nameKey="priority"
            />
        </>
    )
}

export default AdminPieCharts