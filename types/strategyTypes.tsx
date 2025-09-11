// types/strategyTypes.ts
export type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface OrderLeg {
  orderType: string;
  optionType: string;
  expiryType: string;
  quantity: number;
  strikeType: string;
  strikeValue: string;
  stopLoss: {
    type: "points" | "percent";
    value: number;
    trigger: "price" | "premium";
  };
  target: {
    type: "points" | "percent";
    value: number;
    trigger: "price" | "premium";
  };
}

export interface FormData {
  strategyName: string;
  orderType: "MIS" | "CNC" | "BTST";
  startTime: string;
  squareOff: string;
  noTradeAfter: string;
  selectedDays: Day[];
  maxProfit: number;
  maxLoss: number;
  profitTrailing: string;
  trailingConfig: {
    lockProfitAt?: number;
    trailProfitBy?: number;
    everyIncrease?: number;
  };
  transactionType: string;
  chartType: string;
  interval: string;
  longEntryConditions: Array<{
    indicator: string;
    comparator: string;
    value: string;
  }>;
  shortEntryConditions: Array<{
    indicator: string;
    comparator: string;
    value: string;
  }>;
  exitConditions: any[];
  useCombinedChart: boolean;
  maxTradeCycle: string;
  legs?: OrderLeg[];
}

export interface InstrumentsSectionProps {
  selectedInstruments: string[];
  onAddInstruments: () => void;
  onRemoveInstrument: (instrument: string) => void;
}

export interface StrategyNameAndSaveProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}