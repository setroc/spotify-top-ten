import { useEffect, useState } from "react";
import styled from "styled-components";
import Song from "./Song";

const AppStyled = styled.div`
padding: 40px;
display: flex;
flex-direction: column;
min-height: 100vh;
.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.title h1 {
    font-size: 2rem;
    text-align: center;
}
.title button {
    border: none;
    font-family: 'Montserrat', sans-serif;
    font-size: 2rem;
    padding: 10px 20px;
    border-radius: 10px;
    cursor:pointer;
    background-color: #1db954;
    color: white;
    font-weight: 700;
}
.content {
    margin-top: 20px;
    gap: 20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    flex: 1;
}
footer {
    display: flex;
    align-items:center;
    justify-content: space-between;
    margin: 20px 0;
}
footer p {
    font-size: 2rem;
    text-align: center;
}
footer ul {
    list-style: none;
    display: flex;
    gap: 20px;
}
footer ul a {
    color: black;
    text-decoration: none;
}
footer ul li {
    font-size: 2rem;
}

@media(max-width: 1440px) {
    .content {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media(max-width: 1200px) {
    .content {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media(max-width: 800px) {
    .content {
        grid-template-columns: repeat(1, 1fr);
    }
}
@media(max-width: 570px) {
    footer {
        flex-direction: column;
        gap: 10px; 
    }
}

`;

const CLIENT_ID = '6bcfdc2cbb2d4b1ab915d9a45d3f5fda';
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/";
const SPACE_DELIMITER = "%20";
const SCOPES = [
    // "user-read-currently-playing",
    // "user-read-playback-state",
    // "playlist-read-private",
    "user-top-read",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);
const URL = '	https://api.spotify.com/v1/me/top/tracks?limit=10';

const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const values = {};
    paramsInUrl.forEach(param => {
        const [key, value] = param.split("=");
        values[key] = value;
    })
    return values;
};

function App() {
    const [credential, setCredential] = useState();
    const [songsData, setSongsData] = useState();
    useEffect(() => {
        if (window.location.hash) {
            const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);
            setCredential({ access_token, expires_in, token_type });
            fetch(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + credential?.access_token,
                }
            })
                .then((res) => { return res.json() })
                // .then((body)=>console.log(body.items))
                .then((body) => setSongsData(body.items))
                .catch((err) => console.log(err));
        }
    }, [credential?.access_token]);

    const handleLogin = () => {
        window.location.href = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    }
    const handleLogout = () => {
        setCredential(null);
        setSongsData(null);
        window.location.href = '';
    }
    return (
        <AppStyled>
            <div className="title">
                <h1>TOP TEN SONGS</h1>
                {
                    !credential ? (
                        <button onClick={handleLogin}>Login</button>
                    ) : (
                       <button onClick={handleLogout}>Logout</button>
                    )
                }
            </div>
            <div className="content">
                {
                    // console.log(!!songsData)
                    !!songsData 
                    ? songsData.map((song) => {
                        return <Song key={song.id} name={song.name} href={song.external_urls.spotify} image={song.album.images[0].url} />
                    })
                    : (
                        <h2>Inicia sesión para ver tus canciones mas escuchadas en spotify</h2>
                    )
                }
            </div>
            <footer>
                <p>Realizado con ❤️ por Setroc.</p>
                <ul>
                    <li><a href="https://github.com/setroc">Github</a></li>
                    <li><a href="https://twitter.com/isaaccitomix">Twitter</a></li>
                </ul>
            </footer>
        </AppStyled>
    );
}

export default App;
