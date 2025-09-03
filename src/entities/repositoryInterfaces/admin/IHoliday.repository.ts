import { IHoliday } from "../../models/adminEntities/HolidayEntitiy";

export interface IHolidayRepository {
    createHoliday(holiday: IHoliday): Promise<IHoliday>;
    getAllHolidays(): Promise<IHoliday[]>;
    getHolidayById(id: string): Promise<IHoliday | null>;
    getHolidaysInRange(start: Date, end: Date): Promise<IHoliday[]>;
    updateHoliday(id: string, updates: Partial<IHoliday>): Promise<IHoliday | null>;
    deleteHoliday(id: string): Promise<boolean>;
}