
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  completed: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  subject: string;
  timestamp: Date;
  likes: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Mathematics Assignment - Quadratic Equations',
      subject: 'Mathematics',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      completed: false,
    },
    {
      id: '2',
      title: 'English Essay - Ghanaian Literature',
      subject: 'English',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      completed: false,
    },
    {
      id: '3',
      title: 'Science Lab Report - Chemistry',
      subject: 'Science',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      completed: false,
    },
  ]);

  const [recentPosts, setRecentPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Kwame A.',
      content: 'Can someone help me understand integration by parts?',
      subject: 'Mathematics',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      likes: 5,
    },
    {
      id: '2',
      author: 'Ama B.',
      content: 'Just finished my Physics assignment! Who else is working on it?',
      subject: 'Physics',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
    },
  ]);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    } catch (error) {
      console.log('Error requesting notification permissions:', error);
    }
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 7) return `Due in ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
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
    };
    return subjectColors[subject] || colors.accent;
  };

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => Alert.alert('Notifications', 'No new notifications')}
      style={styles.headerButton}
    >
      <IconSymbol name="bell.fill" color={colors.primary} size={24} />
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'LearnGH',
          headerLargeTitle: true,
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={[commonStyles.container, styles.container]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Ready to learn something new today?
            </Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
              <Text style={styles.statNumber}>{upcomingAssignments.length}</Text>
              <Text style={styles.statLabel}>Assignments</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Subjects</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.accent }]}>
              <Text style={styles.statNumber}>85%</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
          </View>

          {/* Upcoming Assignments */}
          <View style={styles.section}>
            <View style={commonStyles.spaceBetween}>
              <Text style={commonStyles.sectionTitle}>Upcoming Assignments</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/assignments')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {upcomingAssignments.slice(0, 3).map((assignment) => (
              <TouchableOpacity
                key={assignment.id}
                style={commonStyles.card}
                onPress={() => router.push('/(tabs)/assignments')}
                activeOpacity={0.7}
              >
                <View style={commonStyles.spaceBetween}>
                  <View style={styles.assignmentContent}>
                    <View
                      style={[
                        styles.subjectBadge,
                        { backgroundColor: getSubjectColor(assignment.subject) },
                      ]}
                    >
                      <Text style={styles.subjectBadgeText}>{assignment.subject}</Text>
                    </View>
                    <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                    <Text style={styles.dueDate}>{formatDueDate(assignment.dueDate)}</Text>
                  </View>
                  <IconSymbol
                    name="chevron.right"
                    color={colors.textSecondary}
                    size={20}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Community Activity */}
          <View style={styles.section}>
            <View style={commonStyles.spaceBetween}>
              <Text style={commonStyles.sectionTitle}>Community Activity</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/community')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {recentPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={commonStyles.card}
                onPress={() => router.push('/(tabs)/community')}
                activeOpacity={0.7}
              >
                <View style={styles.postHeader}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.avatarText}>{post.author[0]}</Text>
                  </View>
                  <View style={styles.postHeaderText}>
                    <Text style={styles.authorName}>{post.author}</Text>
                    <Text style={styles.postTimestamp}>{formatTimestamp(post.timestamp)}</Text>
                  </View>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
                <View style={styles.postFooter}>
                  <View
                    style={[
                      styles.postSubjectBadge,
                      { backgroundColor: getSubjectColor(post.subject) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.postSubjectText,
                        { color: getSubjectColor(post.subject) },
                      ]}
                    >
                      {post.subject}
                    </Text>
                  </View>
                  <View style={styles.postLikes}>
                    <IconSymbol name="heart.fill" color={colors.primary} size={16} />
                    <Text style={styles.likesText}>{post.likes}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={commonStyles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/resources')}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary + '20' }]}>
                  <IconSymbol name="book.fill" color={colors.secondary} size={28} />
                </View>
                <Text style={styles.quickActionText}>Resources</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/assignments')}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol name="checkmark.circle.fill" color={colors.primary} size={28} />
                </View>
                <Text style={styles.quickActionText}>Assignments</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push('/(tabs)/community')}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
                  <IconSymbol name="person.3.fill" color={colors.accent} size={28} />
                </View>
                <Text style={styles.quickActionText}>Community</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => Alert.alert('Study Timer', 'Coming soon!')}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: '#9B59B6' + '20' }]}>
                  <IconSymbol name="timer" color="#9B59B6" size={28} />
                </View>
                <Text style={styles.quickActionText}>Study Timer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  welcomeCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  assignmentContent: {
    flex: 1,
  },
  subjectBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  subjectBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  dueDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  postTimestamp: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  postContent: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postSubjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  postSubjectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  headerButton: {
    padding: 8,
  },
});
