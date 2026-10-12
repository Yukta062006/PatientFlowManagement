import React from 'react'

interface DashboardCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  onClick: () => void
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300
        hover:shadow-card-hover border border-sage-200 hover:border-primaryGreen
      `}
    >
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center mb-4
        ${color} bg-opacity-10
      `}>
        <div className={`${color.replace('bg-', 'text-')}`}>
          {icon}
        </div>
      </div>
      <h3 className="font-bold text-lg text-darkGreen mb-2">{title}</h3>
      <p className="text-sm text-secondaryText leading-relaxed">{description}</p>
    </div>
  )
}

export default DashboardCard
