export function GetArtistByUsernameQuery(username: string) {
    return `
        MATCH (artist:Artist)
        WHERE artist.username = "${username}"
        RETURN artist;
    `;
};