import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg,'gg');
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

// window.electron.ipcRenderer.sendMessage('open-directory-dialog');
// window.electron.ipcRenderer.once('selected-directory', (arg) => {
//   console.log(arg, 'gg')
//   // 处理从主进程返回的所选目录路径
//   // setSelectedDirectory(directoryPath);
// });
