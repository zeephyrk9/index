// @todo
// move sources to config ((rename scrapers config to sources?) or (make another config with sources and a list of scrapers))
//                                                                                          ^ this
export default function getUnifiedPostId(source: "E621", id: string | number): string {
    return `${source};${id}`;
};