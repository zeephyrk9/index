// @todo
// move sources to config ((rename scrapers config to sources?) or (make another config with sources and a list of scrapers))
//                                                                                          ^ this

import { VendorType } from "@workflows/database";

export default function getUnifiedPostId(source: VendorType, id: string | number): string {
    return `${source};${id}`;
};