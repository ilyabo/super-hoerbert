import React from 'react';
import Albums from './Albums';
import styled from '@emotion/styled';

const Outer = styled.div`
  padding: 50px;
`;

const App: React.FC = () => {
  return (
    <Outer>
      <React.Suspense fallback="Loading…">
        <Albums />
      </React.Suspense>
    </Outer>
  );
};




export default App;
