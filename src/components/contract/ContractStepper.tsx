
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, AlertCircle, Pencil, Send, FileSignature, PlayCircle, Clock, CheckCheck } from 'lucide-react';

export type StepStatus = 'completed' | 'current' | 'upcoming';

export interface Step {
  id: number;
  name: string;
  status: StepStatus;
  description?: string;
  actionIcon?: React.ReactNode;
}

interface ContractStepperProps {
  steps: Step[];
  className?: string;
}

const getStatusColor = (status: StepStatus, stepName: string) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500 border-emerald-500 text-white';
    case 'current':
      switch (stepName) {
        case 'Draft':
          return 'bg-white border-blue-500 text-blue-500 ring-4 ring-blue-500/20';
        case 'Pending Review':
          return 'bg-white border-amber-500 text-amber-500 ring-4 ring-amber-500/20';
        case 'Active':
          return 'bg-white border-green-500 text-green-500 ring-4 ring-green-500/20';
        case 'In Progress':
          return 'bg-white border-indigo-500 text-indigo-500 ring-4 ring-indigo-500/20';
        case 'Pending Completion':
          return 'bg-white border-purple-500 text-purple-500 ring-4 ring-purple-500/20';
        case 'Completed':
          return 'bg-white border-emerald-500 text-emerald-500 ring-4 ring-emerald-500/20';
        default:
          return 'bg-white border-blue-500 text-blue-500 ring-4 ring-blue-500/20';
      }
    default:
      return 'bg-white border-gray-300 text-gray-400';
  }
};

const getLineColor = (currentStatus: StepStatus, nextStatus: StepStatus, stepName: string, nextStepName: string) => {
  if (currentStatus === 'completed' && nextStatus === 'completed') {
    return 'bg-emerald-500';
  } 
  
  if (currentStatus === 'completed' && nextStatus === 'current') {
    switch (nextStepName) {
      case 'Pending Review':
        return 'bg-gradient-to-b from-emerald-500 to-amber-500';
      case 'Active':
        return 'bg-gradient-to-b from-emerald-500 to-green-500';
      case 'In Progress':
        return 'bg-gradient-to-b from-emerald-500 to-indigo-500';
      case 'Pending Completion':
        return 'bg-gradient-to-b from-emerald-500 to-purple-500';
      case 'Completed':
        return 'bg-gradient-to-b from-emerald-500 to-emerald-500';
      default:
        return 'bg-gradient-to-b from-emerald-500 to-gray-300';
    }
  }
  
  return 'bg-gray-300';
};

const ContractStepper = ({ steps, className }: ContractStepperProps) => {
  return (
    <nav aria-label="Contract Progress" className={cn("h-full", className)}>
      <ol className="relative flex flex-col space-y-8">
        {steps.map((step, index) => (
          <li key={step.id} className="relative">
            <div className="flex items-start">
              <div className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border transition-all duration-300",
                getStatusColor(step.status, step.name)
              )}>
                {step.status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
                {index < steps.length - 1 && (
                  <div className={cn(
                    "absolute w-0.5 h-12 left-1/2 -translate-x-1/2 top-full",
                    getLineColor(
                      step.status, 
                      steps[index + 1].status,
                      step.name,
                      steps[index + 1].name
                    )
                  )} />
                )}
              </div>
              <div className="ml-4">
                <span className={cn(
                  "text-sm font-medium transition-all duration-300 block",
                  step.status === 'completed' ? "text-emerald-600" : 
                  step.status === 'current' ? 
                    step.name === 'Draft' ? "text-blue-600 font-semibold" : 
                    step.name === 'Pending Review' ? "text-amber-600 font-semibold" :
                    step.name === 'Active' ? "text-green-600 font-semibold" :
                    step.name === 'In Progress' ? "text-indigo-600 font-semibold" :
                    step.name === 'Pending Completion' ? "text-purple-600 font-semibold" :
                    step.name === 'Completed' ? "text-emerald-600 font-semibold" :
                    "text-blue-600 font-semibold" : 
                  "text-gray-500"
                )}>
                  {step.name}
                </span>
                {step.description && (
                  <p className={cn(
                    "text-xs mt-1",
                    step.status === 'current' ? "text-gray-700" : "text-gray-500"
                  )}>
                    {step.description}
                  </p>
                )}
                {step.status === 'current' && step.actionIcon && (
                  <div className="mt-2">
                    {step.actionIcon}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ContractStepper;
