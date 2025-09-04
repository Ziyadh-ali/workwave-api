export interface CreateFaqRequestDTO {
  topic: string;
  description: string;
  questions?: {
    question: string;
    answer: string;
  }[];
}

export interface UpdateFaqRequestDTO {
  topic?: string;
  description?: string;
  questions?: {
    question: string;
    answer: string;
  }[];
}