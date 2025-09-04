export interface IFaqs {
    _id?: string;
    topic: string;
    description: string;
    questions: {
        question: string;
        answer: string;
        createdAt?: Date;
    }[];
    createdAt?: Date;
}