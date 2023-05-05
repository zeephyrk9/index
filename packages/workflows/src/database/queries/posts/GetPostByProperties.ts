export function GetPostByIdQuery(id: string) {
    return `
        MATCH (post:Post)
        WHERE post.id = "${id}"
        RETURN post;
    `;
};