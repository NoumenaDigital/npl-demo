import { Steps } from './types.ts';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const STEP_NAMES: Record<number, string> = {
  [Steps.GREETING]: 'greeting',
  [Steps.LOGIN]: 'login',
  [Steps.LOGGED_IN]: 'logged_in',
  [Steps.CREATE_PROTOCOL]: 'create_protocol',
  [Steps.PROTOCOL_CREATED]: 'protocol_created',
  [Steps.SAY_HELLO]: 'say_hello',
  [Steps.SAID_HELLO]: 'said_hello',
};

export class Analytics {
  private static isEnabled(): boolean {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
  }

  static trackStepView(step: number): void {
    if (!this.isEnabled()) return;

    const stepName = STEP_NAMES[step] || `step_${step}`;
    
    window.gtag('event', 'page_view', {
      page_title: `NPL Demo - ${stepName}`,
      page_location: window.location.href,
      custom_step: stepName,
      custom_step_number: step
    });
  }

  static trackNextClick(currentStep: number, nextStep: number): void {
    if (!this.isEnabled()) return;

    const currentStepName = STEP_NAMES[currentStep] || `step_${currentStep}`;
    const nextStepName = STEP_NAMES[nextStep] || `step_${nextStep}`;

    window.gtag('event', 'next_click', {
      event_category: 'navigation',
      event_label: `${currentStepName}_to_${nextStepName}`,
      custom_current_step: currentStepName,
      custom_next_step: nextStepName,
      custom_current_step_number: currentStep,
      custom_next_step_number: nextStep
    });
  }

  static trackDemoRestart(fromStep: number): void {
    if (!this.isEnabled()) return;

    const fromStepName = STEP_NAMES[fromStep] || `step_${fromStep}`;

    window.gtag('event', 'demo_restart', {
      event_category: 'user_flow',
      event_label: `restart_from_${fromStepName}`,
      custom_restart_from_step: fromStepName,
      custom_restart_from_step_number: fromStep
    });
  }

  static trackPreviousClick(currentStep: number, previousStep: number): void {
    if (!this.isEnabled()) return;

    const currentStepName = STEP_NAMES[currentStep] || `step_${currentStep}`;
    const previousStepName = STEP_NAMES[previousStep] || `step_${previousStep}`;

    window.gtag('event', 'previous_click', {
      event_category: 'navigation',
      event_label: `${currentStepName}_to_${previousStepName}`,
      custom_current_step: currentStepName,
      custom_previous_step: previousStepName,
      custom_current_step_number: currentStep,
      custom_previous_step_number: previousStep
    });
  }

  static trackFormSubmission(step: number, action: string): void {
    if (!this.isEnabled()) return;

    const stepName = STEP_NAMES[step] || `step_${step}`;

    window.gtag('event', 'form_submit', {
      event_category: 'form_interaction',
      event_label: `${stepName}_${action}`,
      custom_step: stepName,
      custom_step_number: step,
      custom_action: action
    });
  }
}