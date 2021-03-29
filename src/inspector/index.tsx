import React from 'react';
import { render } from 'react-dom';
import {
  getShifterState,
  ShifterState,
  SyncShifterState,
} from '../store/shifter';
import { Inspector } from './inspector';

const root = document.getElementById('__inspector-app');

(async function () {
  const shifter = await getShifterState();
  const transformShifts = shifter.map((shift) => ({
    layoutShift: JSON.parse(shift.layoutShift),
    node: shift.node,
  }));

  render(<Inspector shifts={transformShifts} />, root);
})();
