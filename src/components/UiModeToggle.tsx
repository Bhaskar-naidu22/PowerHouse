import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Text } from './AppText';
import { UI_MODE_MOCK_FLAT, useUiMode } from '../contexts/UiModeContext';
import { useSession } from '../contexts/SessionContexts';

type Props = {
  /** Compact chip for corner placement (login FAB). */
  compact?: boolean;
};

/** TEMPORARY — remove with UiModeContext once UI work is finished. */
export default function UiModeToggle({ compact = false }: Props) {
  const { uiMode, setUiMode } = useUiMode();
  const { setFlatDetails } = useSession();

  const handleChange = (enabled: boolean) => {
    setUiMode(enabled);
    if (enabled) {
      setFlatDetails(UI_MODE_MOCK_FLAT);
    }
  };

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <View style={[styles.copy, compact && styles.copyCompact]}>
        <Text style={[styles.title, compact && styles.titleCompact]}>UI Mode</Text>
        {!compact ? (
          <Text style={styles.hint}>Temporary — free screen access for UI work</Text>
        ) : null}
      </View>
      <Switch
        testID="ui-mode-toggle"
        value={uiMode}
        onValueChange={handleChange}
        trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
        thumbColor={uiMode ? '#2563EB' : '#F8FAFC'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
  },
  rowCompact: {
    marginBottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
    maxWidth: 160,
    gap: 8,
  },
  copy: {
    flex: 1,
  },
  copyCompact: {
    flex: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  titleCompact: {
    fontSize: 12,
  },
  hint: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
});
