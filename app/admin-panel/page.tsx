import AdminPieCharts from '@/components/PieCharts/AdminPieCharts'
import WorkloadAllUsers from '@/components/WorkloadAllUsers'

const Dashboard = () => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-3 m-8 max-w-16xl'>
            <div className="col-span-2">
                <WorkloadAllUsers />
            </div>
            <div className="grid grid-cols-1 gap-4">
                <AdminPieCharts />
            </div>
        </div>
    )
}

export default Dashboard