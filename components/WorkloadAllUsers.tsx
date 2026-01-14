'use client'
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { User } from 'lucide-react';
import WorkloadCard from './card-components/WorkloadCard';
import { useWorkload } from '@/hooks/useWorkload';


const WorkloadAllUsers = () => {
  const {loading, workload} = useWorkload();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4 ">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Team Workload</h2>
        <Badge variant="outline">{Object.keys(workload).length} Team Members</Badge>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mr-6">
        <WorkloadCard />
      </div>

      {Object.keys(workload).length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No team members found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default WorkloadAllUsers