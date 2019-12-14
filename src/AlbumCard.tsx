import React from 'react';
import { Playlist } from './types';
import styled from '@emotion/styled';
import { SERVER_URL } from './index';


const Outer = styled.div`
  max-width: 150px; 
  max-height: 150px; 
  display: inline-block;
  background-color: white;
  text-align: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 5px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  border: 4px solid #fff;
  transition: border-color 0.5s;
  &:hover {
    border-color: ${'#cf4d00'};
  }
`;

const AlbumCard: React.FC<{
  playlist: Playlist,
  onSelect: (p: Playlist) => void
}> = ({ playlist, onSelect }) => {
  const { playlist: name, img } = playlist;
  return (
    <Outer
      onClick={() => onSelect(playlist)}
      style={{
        backgroundImage: `url("${SERVER_URL}/${img}")`,
      }}
    ></Outer>
  );
};

export default AlbumCard;
