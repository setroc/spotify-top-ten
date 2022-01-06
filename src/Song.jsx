import styled from "styled-components";

const SongStyled = styled.div`
background-color: white;
border-radius: 10px;
padding: 15px;
a {
    text-decoration: none;
    text-align: center;
    color: black;
    display: flex;
    flex-direction: column;
}
p {
    font-size: 1.5rem;
    margin-bottom: 10px;
}
img {
    width: 100%;
    margin 0 auto;
}
`;


const Song = ({name, href, image}) => {
    return (
        <SongStyled>
            <a href={href}>
                <p>{name}</p>
                <img src={image} alt={name}/>
            </a>
        </SongStyled>
    )
}

export default Song
