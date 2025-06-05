import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return Colors.dark.inactive;
    
    switch (variant) {
      case 'primary':
        return Colors.dark.accent;
      case 'secondary':
        return Colors.dark.primary;
      case 'danger':
        return Colors.dark.danger;
      case 'success':
        return Colors.dark.success;
      case 'outline':
        return 'transparent';
      default:
        return Colors.dark.accent;
    }
  };
  
  const getBorderColor = () => {
    if (variant === 'outline') {
      return disabled ? Colors.dark.inactive : Colors.dark.accent;
    }
    return 'transparent';
  };
  
  const getTextColor = () => {
    if (disabled) return Colors.dark.textSecondary;
    if (variant === 'outline') return Colors.dark.accent;
    return Colors.dark.text;
  };
  
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };
  
  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: Fonts.sizes.sm };
      case 'large':
        return { fontSize: Fonts.sizes.lg };
      default:
        return { fontSize: Fonts.sizes.md };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        getSizeStyles(),
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
            <Text
              style={[
                styles.text,
                { color: getTextColor() },
                getTextSize(),
                icon ? styles.textWithIcon : undefined,
                textStyle
              ]}
            />
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  text: {
    fontWeight: "600",
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
  textWithIcon: {
    marginLeft: 8,
  },
});