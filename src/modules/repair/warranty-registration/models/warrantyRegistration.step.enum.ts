export enum WarrantyRegistrationStep {
  PurchaseInfo = 1,
  BuyerData = 2,
  Review = 3,
}

export const stepParamByStep: Record<WarrantyRegistrationStep, string> = {
  [WarrantyRegistrationStep.PurchaseInfo]: 'step1',
  [WarrantyRegistrationStep.BuyerData]: 'step2',
  [WarrantyRegistrationStep.Review]: 'step3',
}

export const stepByStepParam: Record<string, WarrantyRegistrationStep> = {
  step1: WarrantyRegistrationStep.PurchaseInfo,
  step2: WarrantyRegistrationStep.BuyerData,
  step3: WarrantyRegistrationStep.Review,
}