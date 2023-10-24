// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'open-directory-dialog'
  | 'selected-directory'
  | 'close-window'
  | 'encrypt'
  | 'encrypt2'
  | 'encrypt3'
  | 'encrypt4'
  | 'encrypt-response'
  | 'encrypt-response2'
  | 'encrypt-response3'
  | 'encrypt-response4';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
      console.log(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title: any) => ipcRenderer.send('set-title', title),
});

export type ElectronHandler = typeof electronHandler;
