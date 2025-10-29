
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: 'video' | 'pdf' | 'article' | 'quiz';
  description: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export default function ResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = ['All', 'Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology', 'History'];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Quadratic Equations Explained',
      subject: 'Mathematics',
      type: 'video',
      description: 'Learn how to solve quadratic equations step by step',
      duration: '15 min',
      difficulty: 'intermediate',
    },
    {
      id: '2',
      title: 'Ghanaian Literature Guide',
      subject: 'English',
      type: 'pdf',
      description: 'Comprehensive guide to Ghanaian authors and their works',
      difficulty: 'beginner',
    },
    {
      id: '3',
      title: 'Chemistry Lab Safety',
      subject: 'Chemistry',
      type: 'article',
      description: 'Essential safety guidelines for chemistry experiments',
      duration: '10 min',
      difficulty: 'beginner',
    },
    {
      id: '4',
      title: 'Physics Practice Quiz',
      subject: 'Physics',
      type: 'quiz',
      description: 'Test your knowledge on Newton\'s laws of motion',
      duration: '20 min',
      difficulty: 'intermediate',
    },
    {
      id: '5',
      title: 'Cell Biology Basics',
      subject: 'Biology',
      type: 'video',
      description: 'Introduction to cell structure and function',
      duration: '25 min',
      difficulty: 'beginner',
    },
    {
      id: '6',
      title: 'Ghana Independence Movement',
      subject: 'History',
      type: 'article',
      description: 'Detailed account of Ghana\'s path to independence',
      duration: '30 min',
      difficulty: 'intermediate',
    },
    {
      id: '7',
      title: 'Advanced Calculus',
      subject: 'Mathematics',
      type: 'pdf',
      description: 'Integration and differentiation techniques',
      difficulty: 'advanced',
    },
    {
      id: '8',
      title: 'English Grammar Mastery',
      subject: 'English',
      type: 'quiz',
      description: 'Test your grammar skills with this comprehensive quiz',
      duration: '15 min',
      difficulty: 'intermediate',
    },
  ];

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

  const getTypeIcon = (type: string) => {
    const typeIcons: { [key: string]: string } = {
      video: 'play.circle.fill',
      pdf: 'doc.fill',
      article: 'text.alignleft',
      quiz: 'questionmark.circle.fill',
    };
    return typeIcons[type] || 'doc.fill';
  };

  const getDifficultyColor = (difficulty: string) => {
    const difficultyColors = {
      beginner: colors.success,
      intermediate: colors.accent,
      advanced: colors.error,
    };
    return difficultyColors[difficulty as keyof typeof difficultyColors];
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === 'all' ||
      resource.subject.toLowerCase() === selectedSubject.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  const handleResourcePress = (resource: Resource) => {
    Alert.alert(
      resource.title,
      `This ${resource.type} will open in a future update. Stay tuned!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Resources',
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={[commonStyles.container, styles.container]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>

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
                selectedSubject === subject.toLowerCase() && styles.filterChipActive,
              ]}
              onPress={() => setSelectedSubject(subject.toLowerCase())}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedSubject === subject.toLowerCase() && styles.filterChipTextActive,
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
          {filteredResources.length === 0 ? (
            <View style={commonStyles.emptyState}>
              <IconSymbol
                name="book.fill"
                color={colors.textSecondary}
                size={64}
              />
              <Text style={commonStyles.emptyStateText}>
                No resources found
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultsText}>
                {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
              </Text>
              {filteredResources.map((resource) => (
                <TouchableOpacity
                  key={resource.id}
                  style={commonStyles.card}
                  onPress={() => handleResourcePress(resource)}
                  activeOpacity={0.7}
                >
                  <View style={styles.resourceHeader}>
                    <View
                      style={[
                        styles.resourceIcon,
                        { backgroundColor: getSubjectColor(resource.subject) + '20' },
                      ]}
                    >
                      <IconSymbol
                        name={getTypeIcon(resource.type)}
                        color={getSubjectColor(resource.subject)}
                        size={24}
                      />
                    </View>
                    <View style={styles.resourceContent}>
                      <Text style={styles.resourceTitle}>{resource.title}</Text>
                      <Text style={styles.resourceDescription}>
                        {resource.description}
                      </Text>
                      <View style={styles.resourceMeta}>
                        <View
                          style={[
                            styles.subjectBadge,
                            { backgroundColor: getSubjectColor(resource.subject) },
                          ]}
                        >
                          <Text style={styles.subjectBadgeText}>{resource.subject}</Text>
                        </View>
                        <View
                          style={[
                            styles.difficultyBadge,
                            {
                              backgroundColor:
                                getDifficultyColor(resource.difficulty) + '20',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.difficultyBadgeText,
                              { color: getDifficultyColor(resource.difficulty) },
                            ]}
                          >
                            {resource.difficulty}
                          </Text>
                        </View>
                        {resource.duration && (
                          <View style={styles.durationContainer}>
                            <IconSymbol
                              name="clock"
                              color={colors.textSecondary}
                              size={14}
                            />
                            <Text style={styles.durationText}>{resource.duration}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <IconSymbol
                      name="chevron.right"
                      color={colors.textSecondary}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
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
  resultsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subjectBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
