
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export type StepStatus = 'completed' | 'current' | 'upcoming';

export interface Step {
  id: number;
  name: string;
  status: StepStatus;
}

interface ContractStepperProps {
  steps: Step[];
  className?: string;
}

const ContractStepper = ({ steps, className }: ContractStepperProps) => {
  return (
    <nav aria-label="Contract Progress" className={cn("w-full", className)}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <li className={cn(
              "relative flex items-center justify-center",
              index === 0 ? "flex-1" : index === steps.length - 1 ? "flex-1" : "flex-1"
            )}>
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border transition-all duration-300 z-10",
                step.status === 'completed' ? "bg-brand-blue border-brand-blue text-white" : 
                step.status === 'current' ? "bg-white border-brand-blue text-brand-blue ring-4 ring-brand-blue/20" :
                "bg-white border-gray-300 text-gray-400"
              )}>
                {step.status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              
              <div className="absolute top-10 w-max text-center text-xs font-medium transition-all duration-300">
                <span className={cn(
                  step.status === 'completed' ? "text-brand-blue" : 
                  step.status === 'current' ? "text-brand-blue font-semibold" : 
                  "text-gray-500"
                )}>
                  {step.name}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-full h-0.5 absolute top-4 left-1/2",
                  step.status === 'completed' && steps[index + 1].status === 'completed' ? "bg-brand-blue" :
                  step.status === 'completed' && steps[index + 1].status === 'current' ? "bg-gradient-to-r from-brand-blue to-gray-300" :
                  "bg-gray-300"
                )} />
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default ContractStepper;
