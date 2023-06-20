import { CardSize } from '.';

export interface Card {
    title: string,
    description: string,
    size?: CardSize,

    // Colors
    backgroundColor?: string,
    textColor?: string,
    dividerColor?: string,
};