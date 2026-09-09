export * from './auth';
export * from './event';
export * from './order';
export * from './payment';
export * from './category';



interface WizardStepperProps {
  currentStep: number;
}

interface CustomFixedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
