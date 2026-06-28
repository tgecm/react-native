import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getChats, getChatMessages, sendChatMessage } from '../../services/api/chats';
import { useSelectedBot } from '../../hooks/useSelectedBot';
import { ListSkeleton } from '../../components/shared/LoadingSkeleton';
import { colors, fontSize, spacing, borderRadius, commonStyles } from '../../utils/theme';
import { formatRelativeTime } from '../../utils/date';
import { useToastStore } from '../../store';
import { Chat, ChatMessage } from '../../types';

export const ChatsScreen: React.FC = () => {
  const { selectedBotId } = useSelectedBot();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const addToast = useToastStore((s) => s.addToast);

  const { data: chats, isLoading, refetch } = useQuery({
    queryKey: ['chats', selectedBotId],
    queryFn: () => getChats(selectedBotId!),
    enabled: !!selectedBotId,
    refetchInterval: 10000,
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['chat-messages', selectedBotId, selectedChat],
    queryFn: () => getChatMessages(selectedChat!, selectedBotId!),
    enabled: !!selectedBotId && !!selectedChat,
    refetchInterval: 5000,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedChat) return;
    try {
      await sendChatMessage(selectedChat, selectedBotId!, messageText.trim());
      setMessageText('');
      refetchMessages();
    } catch {
      addToast('Failed to send message', 'error');
    }
  };

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[styles.chatItem, selectedChat === item.user_id && styles.selectedChat]}
      onPress={() => setSelectedChat(item.user_id)}
    >
      <View style={styles.chatAvatar}>
        <Icon name="account-circle" size={40} color={colors.primaryLight} />
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.name || `User ${item.user_id}`}
          </Text>
          {item.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread_count}</Text>
            </View>
          )}
        </View>
        {item.last_message && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.last_message}
          </Text>
        )}
        {item.last_message_time && (
          <Text style={styles.timeText}>{formatRelativeTime(item.last_message_time)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'bot' ? styles.botMessage : styles.userMessage,
      ]}
    >
      {item.text && <Text style={styles.messageText}>{item.text}</Text>}
      <Text style={styles.messageTime}>
        {item.timestamp ? formatRelativeTime(item.timestamp) : ''}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={commonStyles.screenContainer}>
        <ListSkeleton count={10} />
      </View>
    );
  }

  if (selectedChat) {
    return (
      <KeyboardAvoidingView
        style={commonStyles.screenContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.chatHeaderBar}>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <Icon name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.chatTitle}>Chat #{selectedChat}</Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item, idx) => (item.id || idx).toString()}
          renderItem={renderMessage}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          inverted
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.textTertiary}
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icon name="send" size={20} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={renderChat}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="forum" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No chats</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.xxl,
  },
  chatItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  selectedChat: {
    backgroundColor: colors.primaryLight + '10',
  },
  chatAvatar: {
    marginRight: spacing.md,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: colors.textInverse,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  lastMessage: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timeText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  chatHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: spacing.lg,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  botMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  userMessage: {
    backgroundColor: colors.border,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  messageTime: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
});
