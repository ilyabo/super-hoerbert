import React, { useEffect, useState } from 'react';
import { Playlist } from './types';
import { SERVER_URL } from './index';
import styled from '@emotion/styled';

const Outer = styled.div`
  position: absolute; 
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  padding: 50px;
  display: grid;
  box-sizing: border-box;
  grid-template-rows: 40px 1fr;
  row-gap: 30px;
  align-items: top;
`;

const ControlButton = styled.button`
  font-size: 30px;
  border-radius: 10px;
  font-weight: bold;
  padding: 10px 20px;
  outline: none;
`;

const PlayPauseButton = styled(ControlButton)`
  font-size: 25px;
  font-family: 'sans serif';
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  align-items: center;
  column-gap: 1rem;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  overflow: auto;
`;

const SongsListOuter = styled.div`
  overflow: auto;
`;

const Cover = styled.div`
  text-align: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 5px;
  background-position: top;
  background-size: contain;
  background-repeat: no-repeat;  
`;

const SongPlayerOuter = styled.div`
   display: flex;
   & > * + * {
    margin-top: 0.75rem;
   }
`;

const SongTitle = styled.a<{ active: boolean }>(({ active }) => `
  font-weight: ${active ? 'bold' : 'normal'};
  text-decoration: ${active ? 'underline' : 'none'};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`);

const SongPlayer = React.forwardRef<HTMLAudioElement, {
  active: boolean,
  url: string,
  onPlayClick: () => void,
}>((
  {
    active,
    url,
    onPlayClick,
  },
  ref,
) => {
  return (
    <SongPlayerOuter>
      <audio ref={ref}>
        <source src={`${SERVER_URL}/${url}`}/>
      </audio>
      <SongTitle
        active={active}
        onClick={onPlayClick}
      >
        {getNameFromUrl(url)}
      </SongTitle>
    </SongPlayerOuter>
  );
});

const AlbumPlayer: React.FC<{
  playlist: Playlist,
  onClose: () => void,
}> = ({ playlist, onClose}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const { songs, playlist: albumName } = playlist;
  const songAudioRefs = songs.map(() => React.createRef<HTMLAudioElement>());
  const handlePlayClick = (index: number) => {
    const audio = songAudioRefs[index].current;
    if (audio) {
      if (playing) {
        if (activeIndex === index) {
          audio.pause();
          setPlaying(false);
          return;
        }
        const activeAudio = songAudioRefs[activeIndex].current;
        if (activeAudio) {
          activeAudio.pause();
        }
      }
      if (activeIndex !== index) {
        audio.currentTime = 0; // rewind
        setActiveIndex(index);
      }
      audio.play();
      setPlaying(true);
    }
  };

  const handlePlay = (index: number) => {
    setPlaying(true);
  };

  const handleSongEnded = (index: number) => {
    if (playing) {
      if (index < songAudioRefs.length - 1) {
        const audio = songAudioRefs[index + 1].current;
        if (audio) {
          audio.currentTime = 0; // rewind
          audio.play();
          setPlaying(true);
          setActiveIndex(index + 1);
        }
      } else {
        setPlaying(false);
        setActiveIndex(0);
      }
    }
  };

  const handleTimeUpdate = (index: number) => {

  };

  useEffect(() => {
    for (let i = 0; i < songAudioRefs.length; i++) {
      const audio = songAudioRefs[i].current;
      if (audio) {
        audio.addEventListener('play', () => handlePlay(i));
        audio.addEventListener('ended', () => handleSongEnded(i));
        audio.addEventListener('timeupdate', () => handleTimeUpdate(i));
      }
    }
  });


  return (
    <Outer>
      <Header>
        <PlayPauseButton
          onClick={() => handlePlayClick(activeIndex)}
        >{playing ? '⏸' : '▶️'}</PlayPauseButton>
        {albumName}
        <ControlButton onClick={onClose}>╳</ControlButton>
      </Header>
      <Body>
        <SongsListOuter>
          {songs.map((url, i) =>
            <SongPlayer
              key={i}
              ref={songAudioRefs[i]}
              active={activeIndex === i}
              url={url}
              onPlayClick={() => handlePlayClick(i)}
            />
          )}
        </SongsListOuter>
        <Cover
          style={{
            backgroundImage: `url("${SERVER_URL}/${playlist.img}")`,
          }}
        />
      </Body>
    </Outer>
  )
};


function getNameFromUrl(url: string) {
  const urlParts = url.split('/');
  if (urlParts.length > 0) {
    const fname = urlParts[urlParts.length - 1];
    const name = fname.substr(0, fname.lastIndexOf('.'));
    if (name.length > 0) {
      return name;
    }
    return fname;
  }
  return url;
}


export default AlbumPlayer;
