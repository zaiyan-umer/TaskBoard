'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertCircle, Calendar, CalendarClock, User } from 'lucide-react';
import { useWorkload, WorkloadData } from '@/hooks/useWorkload';


const WorkloadCard = () => {
    const {data} = useWorkload();
    const {workload} = data ?? {}

    const getTotalTasks = (user: WorkloadData[string]) => {
        return user.dueToday + user.dueThisWeek + user.overdue;
    }

    const getWorkloadStatus = (user: WorkloadData[string]) => {
        const total = getTotalTasks(user);
        if (user.overdue > 0) return { status: 'Critical', color: 'destructive' as const };
        if (total >= 5) return { status: 'Heavy', color: 'secondary' as const };
        if (total >= 3) return { status: 'Moderate', color: 'outline' as const };
        return { status: 'Light', color: 'default' as const };
    }
    return (
        <>
            {Object.entries(workload).map(([username, dataWorkload]) => {
                const { status, color } = getWorkloadStatus(dataWorkload);
                const totalTasks = getTotalTasks(dataWorkload);

                return (
                    <Card key={username} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {username}
                                </CardTitle>
                                <Badge variant={color}>{status}</Badge>
                            </div>
                            <CardDescription>
                                Total: {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {/* Overdue */}
                                <div className="flex items-center justify-between p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-destructive" />
                                        <span className="text-sm font-medium">Overdue</span>
                                    </div>
                                    <Badge variant="destructive">{dataWorkload.overdue}</Badge>
                                </div>

                                {/* Due Today */}
                                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-100 dark:bg-orange-950/30 border border-orange-300 dark:border-orange-800">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                        <span className="text-sm font-medium">Due Today</span>
                                    </div>
                                    <Badge className="bg-orange-600 hover:bg-orange-700 text-white">{dataWorkload.dueToday}</Badge>
                                </div>

                                {/* Due This Week */}
                                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-100 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800">
                                    <div className="flex items-center gap-2">
                                        <CalendarClock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-medium">Due This Week</span>
                                    </div>
                                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white">{dataWorkload.dueThisWeek}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </>
    )
}

export default WorkloadCard