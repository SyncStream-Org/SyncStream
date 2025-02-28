import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';

// Mock electron bridge
const mockElectron = {
  ipcRenderer: {
    sendMessage: jest.fn(),
    invokeFunction: jest.fn((funcName, ...args) => {
      return new Promise<any>((resolve, reject) => {
        if (funcName === 'show-message-box') {
          resolve(true); // FIXME: NOT MOCKED CORRECTLY
        } else if (funcName === 'get-session-cache') {
          resolve({
            serverURL: '',
            darkMode: false,
            language: 'english',
          });
        } else {
          resolve(undefined);
        }
      });
    }),
    on: jest.fn((channel, func) => {
      return () => {};
    }),
    once: jest.fn(),
  },
};

beforeAll(() => {
  global.window.electron = mockElectron;
});

// Test if app even renders
describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
