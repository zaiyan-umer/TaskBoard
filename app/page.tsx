'use client'
import Cards from '@/components/Cards';
import UserPieChart from '@/components/PieCharts/UserPieChart';
import { useFetchTasks } from '@/hooks/useFetchTasks';

const Page = () => {
  const { tasks, loading } = useFetchTasks();

  return (

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Cards tasks={tasks} />
        <div className="col-span-1 space-y-5">
          <UserPieChart tasks={tasks} />
        </div>
      </div>
  )
}

export default Page