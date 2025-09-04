export interface FaqResponseDTO {
  _id: string;
  topic: string;
  description: string;
  questions: {
    question: string;
    answer: string;
    createdAt?: string;
  }[];
  createdAt?: string;
}