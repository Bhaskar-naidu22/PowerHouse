import React, { createContext, useContext, useState } from 'react';

/**
 * TEMPORARY — UI Mode for frontend work only.
 * Remove this context and all `useUiMode` usage once UI changes are done.
 */

export const UI_MODE_MOCK_SENSOR = {
  id: 'asspl-003',
  label: 'Temp',
  image: require('../assets/images/TempSensor.png'),
  count: 1,
};

export const UI_MODE_MOCK_DEVICE = {
  id: 'AA:BB:CC:DD:EE:FF',
  name: 'UI Mock Sensor',
};

export const UI_MODE_MOCK_FLAT = {
  FlatName: 'A-101',
  FlatId: 'flat-ui-001',
  buildingName: 'Sunrise Apartments',
  buildingId: 'bldg-ui-001',
};

type UiModeContextType = {
  uiMode: boolean;
  setUiMode: (enabled: boolean) => void;
};

const UiModeContext = createContext<UiModeContextType>({
  uiMode: false,
  setUiMode: () => {},
});

export const UiModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [uiMode, setUiMode] = useState(false);

  return (
    <UiModeContext.Provider value={{ uiMode, setUiMode }}>
      {children}
    </UiModeContext.Provider>
  );
};

export const useUiMode = () => useContext(UiModeContext);
