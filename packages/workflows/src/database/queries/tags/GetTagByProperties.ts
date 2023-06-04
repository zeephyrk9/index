export function GetTagByNameQuery(name: string) {
    return `
        MATCH (tag:Tag)
        WHERE tag.name = "${ name }"
        RETURN tag;
    `;
}