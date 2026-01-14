'use client'
import React from 'react'
import { RoundedPieChart } from './RoundedPieChart';
import { ChartConfig } from '../ui/chart';
import { useTasks } from '@/store/tasks.store';
import { useStats } from '@/hooks/useStats';

const AdminPieCharts = () => {
    const tasks = useTasks();
    const { taskStatuses, taskPriorities } = useStats(tasks, 'admin-stats');

    const statusChartData = [
        { status: 'Todo', count: taskStatuses.Todo, fill: 'var(--chart-1)' },
        { status: 'InProgress', count: taskStatuses.InProgress, fill: 'var(--chart-3)' },
        { status: 'Done', count: taskStatuses.Done, fill: 'var(--chart-5)' },
    ]

    const statusChartConfig = {
        count: {
            label: 'Tasks',
        },
        Todo: {
            label: 'Todo',
            color: 'var(--chart-1)',
        },
        InProgress: {
            label: 'In Progress',
            color: 'var(--chart-3)',
        },
        Done: {
            label: 'Done',
            color: 'var(--chart-5)',
        },
    } satisfies ChartConfig

    const priorityChartData = [
        { priority: 'HighPriority', count: taskPriorities.HighPriority, fill: 'var(--chart-red)' },
        { priority: 'MediumPriority', count: taskPriorities.MediumPriority, fill: 'var(--chart-2)' },
        { priority: 'LowPriority', count: taskPriorities.LowPriority, fill: 'var(--chart-4)' },
    ]

    const priorityChartConfig = {
        count: {
            label: 'Tasks',
        },
        HighPriority: {
            label: 'High Priority',
            color: 'var(--chart-red)',
        },
        MediumPriority: {
            label: 'Medium Priority',
            color: 'var(--chart-2)',
        },
        LowPriority: {
            label: 'Low Priority',
            color: 'var(--chart-4)',
        },
    } satisfies ChartConfig


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