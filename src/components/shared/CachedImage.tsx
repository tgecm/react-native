import React, { useState } from 'react';
import { Image, View, StyleSheet, ActivityIndicator, ImageStyle } from 'react-native';
import { colors, borderRadius } from '../../utils/theme';

interface CachedImageProps {
  uri: string | null | undefined;
  style?: ImageStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  borderRadiusVal?: number;
}

export const CachedImage: React.FC<CachedImageProps> = ({
  uri,
  style,
  resizeMode = 'cover',
  borderRadiusVal = borderRadius.md,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!uri) {
    return (
      <View style={[styles.placeholder, style, { borderRadius: borderRadiusVal }]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri, cache: 'force-cache' }}
        style={[styles.image, { borderRadius: borderRadiusVal }]}
        resizeMode={resizeMode}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      {loading && (
        <View style={[styles.loadingOverlay, { borderRadius: borderRadiusVal }]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      {error && (
        <View style={[styles.errorOverlay, { borderRadius: borderRadiusVal }]}>
          <ActivityIndicator size="small" color={colors.textTertiary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.borderLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
