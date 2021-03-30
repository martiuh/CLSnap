import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { render } from 'react-dom';
import { getShifterState } from '../store/shifter';
import { theme } from '../theme';
import { Inspector } from './inspector';

const root = document.getElementById('__inspector-app');

(async function () {
  const shifter = await getShifterState();
  const transformShifts = shifter.map((shift) => ({
    ...shift,
    layoutShift: JSON.parse(shift.layoutShift),
  }));

  render(
    <ChakraProvider theme={extendTheme(theme)}>
      <Inspector shifts={transformShifts} />
    </ChakraProvider>,
    root
  );
})();
