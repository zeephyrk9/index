import { ContentEntry, ContentType } from "../../types";

export function CreatePostQuery(payload: ContentEntry) {
    function getPostSpecificData() {
        switch (payload.type) {
            case ContentType.IMAGE:
                return `
                    imageUrl: "${payload.imageUrl}"
                `;
        }
    };
    
    return `
        CREATE (post:Post {
            // Basic entry propeties
            id: "${payload.id}",
            type: "${payload.type}",
            
            created_at: ${payload.created_at},
            scraped_at: ${payload.scraped_at},

            // Specific post entries
            ${getPostSpecificData()}
        })
    `;
};