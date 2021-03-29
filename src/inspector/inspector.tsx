import React from 'react';
import { SyncShifterState } from '../store/shifter';
// Access the shifter state
// Load the data from the url

type InspectorProps = {
  shifts: SyncShifterState[];
};

export function Inspector(props: InspectorProps) {
  const { shifts } = props;
  console.log(shifts);
  return (
    <main>
      <h1>Tona Gonzalez De Santos</h1>
      {shifts.length}
    </main>
  );
}
