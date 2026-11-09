import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface Task {
  id: string;
  title: string;
  course: string;
  description: string;
  deadline: string;
  status: 'Belum Dikerjakan' | 'Selesai';
}

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleStatus, onDelete }) => {
  const isDone = task.status === 'Selesai';

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, isDone && styles.textDone]}>{task.title}</Text>
        <View style={[styles.badge, isDone ? styles.badgeDone : styles.badgePending]}>
          <Text style={[styles.badgeText, isDone ? styles.badgeTextDone : styles.badgeTextPending]}>
            {task.status}
          </Text>
        </View>
      </View>

      <Text style={styles.course}>Mata Kuliah: {task.course}</Text>
      <Text style={styles.desc}>{task.description}</Text>
      <Text style={styles.deadline}>Deadline: {task.deadline}</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.btnAction, isDone ? styles.btnUndo : styles.btnComplete]}
          onPress={() => onToggleStatus(task.id)}
        >
          <Text style={styles.btnActionText}>
            {isDone ? 'Tandai Belum' : 'Selesaikan'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnAction, styles.btnDelete]}
          onPress={() => onDelete(task.id)}
        >
          <Text style={styles.btnActionText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDone: {
    borderLeftColor: '#10b981',
    backgroundColor: '#f8fafc',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePending: {
    backgroundColor: '#fef3c7',
  },
  badgeDone: {
    backgroundColor: '#d1fae5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextPending: {
    color: '#b45309',
  },
  badgeTextDone: {
    color: '#047857',
  },
  course: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
  },
  deadline: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  btnAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnComplete: {
    backgroundColor: '#10b981',
  },
  btnUndo: {
    backgroundColor: '#64748b',
  },
  btnDelete: {
    backgroundColor: '#ef4444',
  },
  btnActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});