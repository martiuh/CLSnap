import React, { useEffect, useState } from 'react';
import { Button, ChakraProvider, extendTheme, HStack } from '@chakra-ui/react';
import ReactDOM from 'react-dom';
import { theme } from './theme';
import {
  getRecorderState,
  listenRecorderState,
  RecorderState,
  RECORDER_KEY,
} from './store/recorder';
import { print } from './lib/print';

type PopupProps = {
  initialState: RecorderState;
};

const Popup = (props: PopupProps) => {
  const { initialState } = props;

  const [recorderState, setRecorderState] = useState<RecorderState>(
    initialState
  );

  useEffect(() => {
    (async () => {
      const syncState = await getRecorderState();
      setRecorderState(syncState);
    })();

    listenRecorderState((listenedState) => setRecorderState(listenedState));
  }, []);

  const tellPage = ({
    namespace,
    action,
    payload = null,
  }: {
    namespace: string;
    action: string;
    payload?: any;
  }) => {
    print(action);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          { namespace, action, payload },
          (msg) => {
            console.log('result message:', msg);
          }
        );
      }
    });
  };

  const syncRecorderStatus = (state: RecorderState) => {
    chrome.storage.sync.set({ [RECORDER_KEY]: state });
    tellPage({ namespace: RECORDER_KEY, action: state });
  };

  const isRecordingAction =
    recorderState === 'RECORDING' || recorderState === 'RELOAD_AND_RECORD';
  const isStopped = recorderState === 'STOPPED';

  const startReloadAndRecord = () => {
    syncRecorderStatus('RELOAD_AND_RECORD');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update({ url: tabs[0].url });
    });
  };

  const startRecording = () => {
    syncRecorderStatus('RECORDING');
  };

  const stopRecording = () => {
    syncRecorderStatus('STOPPED');
  };

  return (
    <HStack p="1rem" maxW="500px" backgroundColor="gray.600">
      <Button onClick={startReloadAndRecord} disabled={isRecordingAction}>
        Restart and Record
      </Button>
      <Button onClick={startRecording} disabled={isRecordingAction}>
        Record
      </Button>
      <Button onClick={stopRecording} disabled={!isRecordingAction}>
        Stop
      </Button>
    </HStack>
  );
};

chrome.storage.sync.get([RECORDER_KEY], (items) => {
  // Loading the app after we have a certain initial state
  const initialState: RecorderState = items[RECORDER_KEY] ?? 'IDLE';

  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider theme={extendTheme(theme)}>
        <Popup initialState={initialState} />
      </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
});
