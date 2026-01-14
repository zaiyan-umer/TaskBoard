import React from 'react'
import CardComponent from './CardComponent';

const Cards = ({tasks}) => {

    const getPriorityAccentColor = (priority: string) => {
        switch (priority) {
            case 'high': return { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: 'text-red-600 dark:text-red-400', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-100 text-red-700 border-red-300' };
            case 'medium': return { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', icon: 'text-amber-600 dark:text-amber-400', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 border-amber-300' };
            case 'low': return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', icon: 'text-emerald-600 dark:text-emerald-400', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
            default: return { bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-800', icon: 'text-gray-600 dark:text-gray-400', text: 'text-gray-600 dark:text-gray-400', badge: 'bg-gray-100 text-gray-700 border-gray-300' };
        }
    };
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4 col-span-2">
            {tasks.map((task) => {
                const colors = getPriorityAccentColor(task.priority);
                return (
                    <CardComponent
                        task={task}
                        key={task._id?.toString()}
                        colors={colors}
                    />
                );
            })}
        </div>
    )
}

export default Cards