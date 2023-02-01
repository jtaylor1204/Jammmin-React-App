

const clientId = "14d0b41876cc4728800bcbd2ebbcb6ba";
let accessToken;
const redirectURI = "https://jtaylor1204.github.io/Jammmin-React-App";

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expireTokenMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expireTokenMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expireTokenMatch[1]);
            //accessToken = accessToken.replace('=', '');

            // Clear the parameteters, allowing us to grap new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessUrl;
        }

    },

    search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
            {
                headers: {Authorization: `Bearer ${accessToken}`}
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if(!jsonResponse.tracks) {
                    return [];
                }

                return jsonResponse.tracks.items.map(track => (
                    {
                        id: track.id,
                        name: track.name,
                        artists: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri

                    })
                );
            })
    },

    savePlaylist(name, uRIs) {
        if(!name || !uRIs.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;

        // Get userid
        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            // Create PlayList and return id for playList
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
            {
                headers: headers,   
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                // Add tracks to playList
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: uRIs})
                })
            })
            
        })
    }
}

export default Spotify;


// let accessToken = ' ';
// const clientID = 'db22cac785614190bdacb1b1709fd37a';
// const redirectUri = 'http://localhost3000';



// export const Spotify = {
//     getAccessToken() {
//         if (accessToken) {
//             return;
//         }
//         // check for access token match
//         const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
//         const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/
//         );

//         if (accessTokenMatch && expiresInMatch) {
//             const accessToken = accessTokenMatch[1];
//             const expiresIn = Number(expiresInMatch[1]);
//             // this clears parameters, adds new access token
//             window.setTimeout(() => accessToken = '', expiresIn * 1000);
//             window.history.pushState('Access Token', null, '/');
//             return accessToken;
//         } else {
//             const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
//             window.location = accessUrl;
//         }

//     },

//     // accepts a search term input, passes the search term value to a Spotify 
//     // request, then returns the response as a list of tracks in JSON format.


//    search(searchTerm) {
//        const accessToken = Spotify.getAccessToken();
//         return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
//         {
//             headers: {Authorization: `Bearer ${accessToken}` }
//         }).then(response => {
//             return response.json();
//         }).then(jsonResponse => {
//             if (!jsonResponse.tracks) {
//                 return [{}];
//             }
//             return jsonResponse.tracks.items.map(track => ({
//                 id: track.id,
//                 name: track.name,
//                 artist: track.artists[0].name,
//                 album: track.album.name,
//                 uri: track.uri
//             }))
//         })

// },

// savePlaylist(name, tracksUri){
//     if (!name && tracksUri) {
//         return;
//     }
//  let accessToken = Spotify.getAccessToken();
//     const headers = { Authorization: `Bearer ${accessToken}` }
//     let userId;
//     // request users spotify name
//     return fetch('https://api.spotify.com/v1/me', { headers: headers })
//         .then(response => response.json()
//         ).then(jsonResponse => {
//             userId = jsonResponse.id;
//             return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
//                 headers: headers,
//                 method: 'POST',
//                 body: JSON.stringify({ name: name })
//             }).then(response => response.json()
//             ).then(jsonResponse => {
//                 const playlistId = jsonResponse.id;
//                 return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
//                     headers: headers,
//                     method: 'POST',
//                     body: JSON.stringify({uri: tracksUri})
//                 })
//             })
//         })
// }
// }

