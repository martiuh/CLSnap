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
    <Main bgColor="blue.50">
      <Box p="2">
        <HStack spacing="1" my="2" justifyContent="center">
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
        <HStack my="2" justifyContent="center">
          <Button {...prevHandler}>Prev</Button>
          <Button {...nextHandler}>Next</Button>
        </HStack>
      </Box>
      <AspectRatio maxW="100vw" ratio={4 / 3} border="red" borderWidth="1px">
        <iframe src={currentItem.dataUri} />
      </AspectRatio>
    </Main>
  );
}
