export interface NoReasonResponse {
  message: string;
}

export interface MultipleNoReasonsResponse {
  messages: string[];
}

export interface CategorizedNoReasonResponse {
  message: string;
  category: string;
}

export interface ReasonStatsResponse {
  stats: {
    total: number;
    categories: Array<{
      name: string;
      count: number;
    }>;
  };
}

export interface AvailableCategoriesResponse {
  categories: string[];
}
