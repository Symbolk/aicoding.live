import { FC } from 'react'
import { Check, Loader2, ChevronRight } from 'lucide-react'
import AnimatedShinyText from '../ui/animated-shiny-text'
import { cn } from '@/lib/utils'

export type ExecutionStage = 'thinking' | 'keywords' | 'searching' | 'summarizing'

interface ExecutionStatusProps {
  stages: ExecutionStage[]
  currentStage: ExecutionStage
  completedStages: ExecutionStage[]
  onStageClick: (stage: ExecutionStage) => void
  stageText: Record<ExecutionStage, string>
}

export const ExecutionStatus: FC<ExecutionStatusProps> = ({
  stages,
  currentStage,
  completedStages,
  onStageClick,
  stageText,
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {stages.map((stage, index) => {
        const isCompleted = completedStages.includes(stage)
        const isCurrent = currentStage === stage
        const isLast = index === stages.length - 1

        return (
          <div key={stage} className="flex items-center">
            <div 
              className={cn(
                "flex items-center space-x-2 cursor-pointer transition-colors",
                isCurrent ? "text-blue-600" : "text-gray-500",
                isCompleted ? "text-green-600" : ""
              )}
              onClick={() => onStageClick(stage)}
            >
              <AnimatedShinyText className={cn(
                "text-sm font-medium",
                !isCurrent && "animate-none"
              )}>
                {stageText[stage]}
              </AnimatedShinyText>
              <div className="w-6 h-6 flex items-center justify-center">
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </div>
            </div>
            {!isLast && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            )}
          </div>
        )
      })}
    </div>
  )
} 