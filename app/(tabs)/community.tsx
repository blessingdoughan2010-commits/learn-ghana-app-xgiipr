
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Post {
  id: string;
  author: string;
  authorId: string;
  content: string;
  subject: string;
  timestamp: Date;
  likes: number;
  comments: number;
  liked: boolean;
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: Date;
}

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Kwame A.',
      authorId: 'user1',
      content: 'Can someone help me understand integration by parts? I\'m stuck on question 5 from our homework.',
      subject: 'Mathematics',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      likes: 5,
      comments: 3,
      liked: false,
    },
    {
      id: '2',
      author: 'Ama B.',
      authorId: 'user2',
      content: 'Just finished my Physics assignment! Who else is working on it? Let\'s discuss the projectile motion questions.',
      subject: 'Physics',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      comments: 7,
      liked: true,
    },
    {
      id: '3',
      author: 'Kofi M.',
      authorId: 'user3',
      content: 'Does anyone have notes on the Ghanaian independence movement? I missed yesterday\'s class.',
      subject: 'History',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 8,
      comments: 5,
      liked: false,
    },
    {
      id: '4',
      author: 'Akua S.',
      authorId: 'user4',
      content: 'Study group for Chemistry exam next week? We can meet at the library on Saturday!',
      subject: 'Chemistry',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 15,
      comments: 10,
      liked: false,
    },
  ]);

  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    subject: '',
  });
  const [filter, setFilter] = useState<string>('all');

  const subjects = ['All', 'Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology', 'History'];

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const createPost = () => {
    if (!newPost.content || !newPost.subject) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: 'You',
      authorId: 'currentUser',
      content: newPost.content,
      subject: newPost.subject,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      liked: false,
    };

    setPosts((prev) => [post, ...prev]);
    setShowNewPostModal(false);
    setNewPost({ content: '', subject: '' });
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getSubjectColor = (subject: string) => {
    const subjectColors: { [key: string]: string } = {
      Mathematics: colors.primary,
      English: colors.secondary,
      Science: '#9B59B6',
      Physics: '#3498DB',
      Chemistry: '#E74C3C',
      Biology: '#27AE60',
      History: '#E67E22',
    };
    return subjectColors[subject] || colors.accent;
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    return post.subject.toLowerCase() === filter.toLowerCase();
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Community',
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={[commonStyles.container, styles.container]}>
        {/* Subject Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject}
              style={[
                styles.filterChip,
                filter === subject.toLowerCase() && styles.filterChipActive,
              ]}
              onPress={() => setFilter(subject.toLowerCase())}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === subject.toLowerCase() && styles.filterChipTextActive,
                ]}
              >
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredPosts.length === 0 ? (
            <View style={commonStyles.emptyState}>
              <IconSymbol
                name="person.3.fill"
                color={colors.textSecondary}
                size={64}
              />
              <Text style={commonStyles.emptyStateText}>
                No posts found in this category
              </Text>
            </View>
          ) : (
            filteredPosts.map((post) => (
              <View key={post.id} style={commonStyles.card}>
                <View style={styles.postHeader}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.avatarText}>{post.author[0]}</Text>
                  </View>
                  <View style={styles.postHeaderText}>
                    <Text style={styles.authorName}>{post.author}</Text>
                    <Text style={styles.postTimestamp}>
                      {formatTimestamp(post.timestamp)}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <IconSymbol
                      name="ellipsis"
                      color={colors.textSecondary}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                <View
                  style={[
                    styles.subjectBadge,
                    { backgroundColor: getSubjectColor(post.subject) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.subjectBadgeText,
                      { color: getSubjectColor(post.subject) },
                    ]}
                  >
                    {post.subject}
                  </Text>
                </View>

                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleLike(post.id)}
                  >
                    <IconSymbol
                      name={post.liked ? 'heart.fill' : 'heart'}
                      color={post.liked ? colors.primary : colors.textSecondary}
                      size={20}
                    />
                    <Text
                      style={[
                        styles.actionText,
                        post.liked && { color: colors.primary },
                      ]}
                    >
                      {post.likes}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      Alert.alert('Comments', 'Comments feature coming soon!')
                    }
                  >
                    <IconSymbol
                      name="bubble.left"
                      color={colors.textSecondary}
                      size={20}
                    />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Share', 'Share feature coming soon!')}
                  >
                    <IconSymbol
                      name="square.and.arrow.up"
                      color={colors.textSecondary}
                      size={20}
                    />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* New Post Button */}
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => setShowNewPostModal(true)}
          activeOpacity={0.8}
        >
          <IconSymbol name="plus" color="#FFFFFF" size={28} />
        </TouchableOpacity>

        {/* New Post Modal */}
        <Modal
          visible={showNewPostModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowNewPostModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowNewPostModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Post</Text>
              <TouchableOpacity onPress={createPost}>
                <Text style={styles.modalSaveText}>Post</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Subject *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.subjectScroll}
              >
                {subjects.slice(1).map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.subjectChip,
                      newPost.subject === subject && styles.subjectChipActive,
                      {
                        borderColor: getSubjectColor(subject),
                        backgroundColor:
                          newPost.subject === subject
                            ? getSubjectColor(subject)
                            : 'transparent',
                      },
                    ]}
                    onPress={() => setNewPost((prev) => ({ ...prev, subject }))}
                  >
                    <Text
                      style={[
                        styles.subjectChipText,
                        {
                          color:
                            newPost.subject === subject
                              ? '#FFFFFF'
                              : getSubjectColor(subject),
                        },
                      ]}
                    >
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>What&apos;s on your mind? *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                placeholderTextColor={colors.textSecondary}
                value={newPost.content}
                onChangeText={(text) =>
                  setNewPost((prev) => ({ ...prev, content: text }))
                }
                multiline
                numberOfLines={8}
              />
            </ScrollView>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  filterScroll: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  postHeaderText: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  postTimestamp: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  postContent: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  subjectBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  subjectBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  newPostButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalCancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  subjectScroll: {
    marginBottom: 16,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
  },
  subjectChipActive: {
    // backgroundColor handled dynamically
  },
  subjectChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
  },
});
