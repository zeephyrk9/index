// @todo
// add their social accounts (twitter, for example)
export function CreateNewArtistQuery(username: string) {
    return `
        CREATE (artist:Artist { username: "${username}" })
    `;
};