import { BaseContentEntry } from "./BaseContentEntry";
import { ContentType } from "./ContentType";

export interface ImageContentEntry extends BaseContentEntry {
    type: ContentType.IMAGE,
    imageUrl: string,
};