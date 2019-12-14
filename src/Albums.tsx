import React, { useState } from 'react';
import { Playlist } from './types';
import AlbumCard from './AlbumCard';
import { SERVER_URL } from './index';
import styled from '@emotion/styled';
import AlbumPlayer from './AlbumPlayer';
import { createUseFetch } from 'fetch-suspense';
import 'whatwg-fetch'; const useFetch = createUseFetch(window.fetch);   // fails on ipad 2 otherwise

const Outer = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
`;

const AlbumList = styled.div<{ visible: boolean }>(({ visible }) => `
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: ${visible ? 'auto' : 'hidden'};
  padding: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 150px;
  column-gap: 20px;
  row-gap: 20px;
`);

const Overlay = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: #fff;
`;

const Albums: React.FC = () => {
  const playlists = useFetch(`${SERVER_URL}/songs.php`) as Playlist[];
  const [selected, setSelected] = useState<Playlist>();

  return (
    <Outer>
      <AlbumList visible={selected == null}>
        {playlists.map(p =>
          <AlbumCard
            key={p.playlist}
            playlist={p}
            onSelect={() => setSelected(p)}
          />
        )}
      </AlbumList>
      {selected != null &&
        <Overlay>
          <AlbumPlayer
            playlist={selected}
            onClose={() => setSelected(undefined)}
          />
        </Overlay>
      }

    </Outer>
  );
};

export default Albums;
