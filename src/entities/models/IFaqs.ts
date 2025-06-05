export interface IFaqs {
    topic: string;
    description: string;
    questions: {
        question: string;
        answer: string;
        createdAt?: Date;
    }[];
    createdAt?: Date;
}