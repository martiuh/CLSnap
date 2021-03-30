import React from 'react';
import { Button } from '@chakra-ui/react';

export interface ShiftTileProps {
  onClick: () => void;
  children: React.ReactNode;
  selected: boolean;
}

const useMode = (value: boolean) => {
  return {};
};

export function ShiftTile(props: ShiftTileProps): JSX.Element {
  const { onClick, children, selected } = props;
  return (
    <Button
      onClick={onClick}
      colorScheme={selected ? 'cyan' : 'green'}
      variant="outline"
    >
      {children}
    </Button>
  );
}
