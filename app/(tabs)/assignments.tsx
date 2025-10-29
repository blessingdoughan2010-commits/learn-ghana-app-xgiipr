
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function AssignmentsScreen() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Mathematics Assignment - Quadratic Equations',
      subject: 'Mathematics',
      description: 'Solve problems 1-20 from chapter 5',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      completed: false,
      priority: 'high',
    },
    {
      id: '2',
      title: 'English Essay - Ghanaian Literature',
      subject: 'English',
      description: 'Write a 500-word essay on Ama Ata Aidoo',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      completed: false,
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Science Lab Report - Chemistry',
      subject: 'Science',
      description: 'Complete lab report on acid-base reactions',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      completed: false,
      priority: 'high',
    },
    {
      id: '4',
      title: 'History Project - Independence',
      subject: 'History',
      description: 'Research Ghana\'s independence movement',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: true,
      priority: 'low',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    priority: 'medium' as 'high' | 'medium' | 'low',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    scheduleNotifications();
  }, [assignments]);

  const scheduleNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      for (const assignment of assignments) {
        if (!assignment.completed) {
          const trigger = new Date(assignment.dueDate.getTime() - 24 * 60 * 60 * 1000);
          
          if (trigger > new Date()) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Assignment Reminder 📚',
                body: `${assignment.title} is due tomorrow!`,
                data: { assignmentId: assignment.id },
              },
              trigger,
            });
          }
        }
      }
    } catch (error) {
      console.log('Error scheduling notifications:', error);
    }
  };

  const toggleAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id
          ? { ...assignment, completed: !assignment.completed }
          : assignment
      )
    );
  };

  const deleteAssignment = (id: string) => {
    Alert.alert(
      'Delete Assignment',
      'Are you sure you want to delete this assignment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAssignments((prev) => prev.filter((a) => a.id !== id));
          },
        },
      ]
    );
  };

  const addAssignment = () => {
    if (!newAssignment.title || !newAssignment.subject) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const assignment: Assignment = {
      id: Date.now().toString(),
      title: newAssignment.title,
      subject: newAssignment.subject,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      completed: false,
      priority: newAssignment.priority,
    };

    setAssignments((prev) => [...prev, assignment]);
    setShowAddModal(false);
    setNewAssignment({
      title: '',
      subject: '',
      description: '',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      priority: 'medium',
    });
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 0) return 'Overdue';
    if (diffDays < 7) return `Due in ${diffDays} days`;
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

  const getPriorityColor = (priority: string) => {
    const priorityColors = {
      high: colors.error,
      medium: colors.accent,
      low: colors.success,
    };
    return priorityColors[priority as keyof typeof priorityColors];
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === 'pending') return !assignment.completed;
    if (filter === 'completed') return assignment.completed;
    return true;
  });

  const pendingCount = assignments.filter((a) => !a.completed).length;
  const completedCount = assignments.filter((a) => a.completed).length;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Assignments',
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={[commonStyles.container, styles.container]}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'all' && styles.filterTabTextActive,
              ]}
            >
              All ({assignments.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'pending' && styles.filterTabActive]}
            onPress={() => setFilter('pending')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'pending' && styles.filterTabTextActive,
              ]}
            >
              Pending ({pendingCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'completed' && styles.filterTabActive]}
            onPress={() => setFilter('completed')}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === 'completed' && styles.filterTabTextActive,
              ]}
            >
              Completed ({completedCount})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredAssignments.length === 0 ? (
            <View style={commonStyles.emptyState}>
              <IconSymbol
                name="checkmark.circle.fill"
                color={colors.textSecondary}
                size={64}
              />
              <Text style={commonStyles.emptyStateText}>
                {filter === 'completed'
                  ? 'No completed assignments yet'
                  : 'No assignments found'}
              </Text>
            </View>
          ) : (
            filteredAssignments.map((assignment) => (
              <View key={assignment.id} style={commonStyles.card}>
                <View style={styles.assignmentHeader}>
                  <TouchableOpacity
                    onPress={() => toggleAssignment(assignment.id)}
                    style={styles.checkbox}
                  >
                    <View
                      style={[
                        styles.checkboxInner,
                        assignment.completed && styles.checkboxChecked,
                      ]}
                    >
                      {assignment.completed && (
                        <IconSymbol name="checkmark" color="#FFFFFF" size={16} />
                      )}
                    </View>
                  </TouchableOpacity>
                  <View style={styles.assignmentContent}>
                    <View style={styles.assignmentTitleRow}>
                      <Text
                        style={[
                          styles.assignmentTitle,
                          assignment.completed && styles.assignmentTitleCompleted,
                        ]}
                      >
                        {assignment.title}
                      </Text>
                    </View>
                    <Text style={styles.assignmentDescription}>
                      {assignment.description}
                    </Text>
                    <View style={styles.assignmentMeta}>
                      <View
                        style={[
                          styles.subjectBadge,
                          { backgroundColor: getSubjectColor(assignment.subject) },
                        ]}
                      >
                        <Text style={styles.subjectBadgeText}>{assignment.subject}</Text>
                      </View>
                      <View
                        style={[
                          styles.priorityBadge,
                          { backgroundColor: getPriorityColor(assignment.priority) + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityBadgeText,
                            { color: getPriorityColor(assignment.priority) },
                          ]}
                        >
                          {assignment.priority}
                        </Text>
                      </View>
                      <Text style={styles.dueDate}>
                        {formatDueDate(assignment.dueDate)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteAssignment(assignment.id)}
                    style={styles.deleteButton}
                  >
                    <IconSymbol name="trash" color={colors.error} size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <IconSymbol name="plus" color="#FFFFFF" size={28} />
        </TouchableOpacity>

        {/* Add Assignment Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Assignment</Text>
              <TouchableOpacity onPress={addAssignment}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Assignment title"
                placeholderTextColor={colors.textSecondary}
                value={newAssignment.title}
                onChangeText={(text) =>
                  setNewAssignment((prev) => ({ ...prev, title: text }))
                }
              />

              <Text style={styles.inputLabel}>Subject *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Mathematics, English"
                placeholderTextColor={colors.textSecondary}
                value={newAssignment.subject}
                onChangeText={(text) =>
                  setNewAssignment((prev) => ({ ...prev, subject: text }))
                }
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Assignment details"
                placeholderTextColor={colors.textSecondary}
                value={newAssignment.description}
                onChangeText={(text) =>
                  setNewAssignment((prev) => ({ ...prev, description: text }))
                }
                multiline
                numberOfLines={4}
              />

              <Text style={styles.inputLabel}>Due Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {newAssignment.dueDate.toLocaleDateString()}
                </Text>
                <IconSymbol name="calendar" color={colors.primary} size={20} />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={newAssignment.dueDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setNewAssignment((prev) => ({ ...prev, dueDate: selectedDate }));
                    }
                  }}
                />
              )}

              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityContainer}>
                {(['high', 'medium', 'low'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      newAssignment.priority === priority &&
                        styles.priorityButtonActive,
                      {
                        borderColor: getPriorityColor(priority),
                        backgroundColor:
                          newAssignment.priority === priority
                            ? getPriorityColor(priority)
                            : 'transparent',
                      },
                    ]}
                    onPress={() =>
                      setNewAssignment((prev) => ({ ...prev, priority }))
                    }
                  >
                    <Text
                      style={[
                        styles.priorityButtonText,
                        {
                          color:
                            newAssignment.priority === priority
                              ? '#FFFFFF'
                              : getPriorityColor(priority),
                        },
                      ]}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  assignmentContent: {
    flex: 1,
  },
  assignmentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  assignmentTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  assignmentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  assignmentMeta: {
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
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dueDate: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
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
    color: colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
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
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityButtonActive: {
    // backgroundColor handled dynamically
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
