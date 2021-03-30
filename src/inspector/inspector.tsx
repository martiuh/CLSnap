import React from 'react';
import { ShifterState } from '../store/shifter';
import { HStack, Button, AspectRatio, Box, chakra } from '@chakra-ui/react';
import { ShiftTile } from './inspector.components/ShiftTile';
import { useSelected } from './inspector.hooks/useSelected';
// Access the shifter state
// Load the data from the url

type InspectorProps = {
  shifts: ShifterState[];
};

const Main = chakra(Box, {
  baseStyle: {
    maxH: '100vh',
    maxW: '100vw',
  },
});

export function Inspector(props: InspectorProps) {
  const { shifts } = props;
  const { currentItem, currentIndex, jsxProps, programmatic } = useSelected({
    items: shifts,
  });

  const { nextHandler, prevHandler } = jsxProps;
  const { selectItem } = programmatic;

  if (!currentItem) {
    return <Main>No CLS</Main>;
  }

  return (
    <Main>
      <HStack spacing="1" mb="5">
        {shifts.map(({ id }, index) => (
          <ShiftTile
            key={id}
            onClick={() => selectItem(index)}
            selected={index === currentIndex}
          >
            {index + 1}
          </ShiftTile>
        ))}
      </HStack>
      <HStack mbt="5">
        <Button {...prevHandler}>Prev</Button>
        <Button {...nextHandler}>Next</Button>
      </HStack>
      <AspectRatio maxW="80vw" ratio={4 / 3}>
        <iframe src={currentItem.dataUri} />
      </AspectRatio>
    </Main>
  );
}
