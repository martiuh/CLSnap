import React from 'react';
import { ShifterState } from '../store/shifter';
import { Box, HStack } from '@chakra-ui/react';
// Access the shifter state
// Load the data from the url

type InspectorProps = {
  shifts: ShifterState[];
};

export function Inspector(props: InspectorProps) {
  const { shifts } = props;
  const [shift] = shifts;

  if (!shift) {
    return <main>No CLS</main>;
  }
  return (
    <main>
      <HStack>
        {shifts.map(({ id }, index) => (
          <Box key={id}>{index + 1}</Box>
        ))}
      </HStack>
      <div dangerouslySetInnerHTML={{ __html: shift.node }} />
    </main>
  );
}
