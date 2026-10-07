import React from 'react';
import { View, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import { TargetItem } from '../game/types';
import { Target } from './Target';
import { COLORS } from '../constants/config';

interface GameBoardProps {
  targets: TargetItem[];
  onTargetTap: (id: string) => void;
  onWrongTap: () => void;
  onLayoutDimensions: (width: number, height: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = React.memo(({
  targets,
  onTargetTap,
  onWrongTap,
  onLayoutDimensions,
}) => {
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      onLayoutDimensions(width, height);
    }
  };

  return (
    <View style={styles.outerContainer} onLayout={handleLayout}>
      {/* Board Surface - detects wrong taps when tapping outside targets */}
      <Pressable
        style={styles.touchSurface}
        onPress={onWrongTap}
        accessible={true}
        accessibilityRole="none"
        accessibilityLabel="Game area"
      >
        {/* Active Targets - decoys rendered first, primary target on top */}
        {targets
          .filter((t) => t.isDecoy)
          .map((target) => (
            <Target key={target.id} target={target} onTap={onTargetTap} />
          ))}
        {targets
          .filter((t) => !t.isDecoy)
          .map((target) => (
            <Target key={target.id} target={target} onTap={onTargetTap} />
          ))}
      </Pressable>
    </View>
  );
});

GameBoard.displayName = 'GameBoard';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceBorder,
    overflow: 'hidden',
  },
  touchSurface: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});
