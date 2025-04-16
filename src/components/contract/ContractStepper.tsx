
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
    <nav aria-label="Contract Progress" className={cn("h-full", className)}>
      <ol className="relative flex flex-col space-y-8">
        {steps.map((step, index) => (
          <li key={step.id} className="relative">
            <div className="flex items-start">
              <div className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border transition-all duration-300",
                step.status === 'completed' ? "bg-brand-blue border-brand-blue text-white" : 
                step.status === 'current' ? "bg-white border-brand-blue text-brand-blue ring-4 ring-brand-blue/20" :
                "bg-white border-gray-300 text-gray-400"
              )}>
                {step.status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
                {index < steps.length - 1 && (
                  <div className={cn(
                    "absolute w-0.5 h-12 left-1/2 -translate-x-1/2 top-full",
                    step.status === 'completed' && steps[index + 1].status === 'completed' ? "bg-brand-blue" :
                    step.status === 'completed' && steps[index + 1].status === 'current' ? "bg-gradient-to-b from-brand-blue to-gray-300" :
                    "bg-gray-300"
                  )} />
                )}
              </div>
              <span className={cn(
                "ml-4 text-sm font-medium transition-all duration-300",
                step.status === 'completed' ? "text-brand-blue" : 
                step.status === 'current' ? "text-brand-blue font-semibold" : 
                "text-gray-500"
              )}>
                {step.name}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ContractStepper;
