import React, { useState, useEffect, useMemo, useCallback, useRef, useReducer } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TaskCard, Task } from '../components/TaskCard';

// 1. Data Dummy Awal
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Tugas Praktikum 5 React Native',
    course: 'Pemrograman Visual',
    description: 'Implementasi Props, State, dan 7 Hooks',
    deadline: '2026-11-12',
    status: 'Belum Dikerjakan',
  },
  {
    id: '2',
    title: 'Normalisasi Database Relasional',
    course: 'Administrasi Basis Data',
    description: 'Menyusun bentuk 1NF, 2NF, hingga 3NF',
    deadline: '2026-11-14',
    status: 'Selesai',
  },
  {
    id: '3',
    title: 'Simulasi Kinematika Manipulator',
    course: 'Robotika',
    description: 'Perhitungan Forward Kinematics SCARA',
    deadline: '2026-11-15',
    status: 'Belum Dikerjakan',
  },
  {
    id: '4',
    title: 'Analisis DFD dan Flowmap Sistem',
    course: 'Analisis & Desain Sistem',
    description: 'Pembuatan diagram aliran data level 0 dan 1',
    deadline: '2026-11-18',
    status: 'Belum Dikerjakan',
  },
  {
    id: '5',
    title: 'Konfigurasi Routing RIP & OSPF',
    course: 'Jaringan Komputer',
    description: 'Simulasi topologi router menggunakan Packet Tracer',
    deadline: '2026-11-20',
    status: 'Selesai',
  },
];

// 2. Action Types & Reducer (useReducer)
type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_STATUS'; payload: string }
  | { type: 'RESET_TASKS' };

function taskReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'ADD_TASK':
      return [action.payload, ...state];
    case 'DELETE_TASK':
      return state.filter((t) => t.id !== action.payload);
    case 'TOGGLE_STATUS':
      return state.map((t) =>
        t.id === action.payload
          ? { ...t, status: t.status === 'Belum Dikerjakan' ? 'Selesai' : 'Belum Dikerjakan' }
          : t
      );
    case 'RESET_TASKS':
      return [];
    default:
      return state;
  }
}

export default function App() {
  // 7. useReducer
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  // 2. useState
  const [titleInput, setTitleInput] = useState('');
  const [courseInput, setCourseInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [deadLineInput, setDeadLineInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 6. useRef (Tipe 'any' mengatasi error merah focus dan ref di TypeScript)
  const titleInputRef = useRef<any>(null);

  // 3. useEffect (Memantau searchKeyword lewat console.log)
  useEffect(() => {
    console.log(`[Pencarian Tugas] Kata kunci diubah: "${searchKeyword}"`);
  }, [searchKeyword]);

  // 5. useCallback
  const handleAddTask = useCallback(() => {
    if (!titleInput.trim() || !courseInput.trim() || !deadLineInput.trim()) {
      Alert.alert('Perhatian', 'Nama tugas, mata kuliah, dan deadline wajib diisi!');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: titleInput,
      course: courseInput,
      description: descInput || '-',
      deadline: deadLineInput,
      status: 'Belum Dikerjakan',
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });

    setTitleInput('');
    setCourseInput('');
    setDescInput('');
    setDeadLineInput('');

    // useRef focus tanpa error
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [titleInput, courseInput, descInput, deadLineInput]);

  const handleToggleStatus = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_STATUS', payload: id });
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const handleResetTasks = useCallback(() => {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin menghapus semua tugas?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus Semua', style: 'destructive', onPress: () => dispatch({ type: 'RESET_TASKS' }) },
    ]);
  }, []);

  // 4. useMemo
  const taskSummary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Selesai').length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      t.course.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteTask}
          />
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.headerTitle}>Manajemen Tugas Mahasiswa</Text>

            {/* Ringkasan Tugas */}
            <View style={styles.summaryContainer}>
              <View style={[styles.summaryBox, { backgroundColor: '#e0f2fe' }]}>
                <Text style={styles.summaryNum}>{taskSummary.total}</Text>
                <Text style={styles.summaryLabel}>Total Tugas</Text>
              </View>
              <View style={[styles.summaryBox, { backgroundColor: '#fef3c7' }]}>
                <Text style={[styles.summaryNum, { color: '#b45309' }]}>{taskSummary.pending}</Text>
                <Text style={styles.summaryLabel}>Belum Selesai</Text>
              </View>
              <View style={[styles.summaryBox, { backgroundColor: '#d1fae5' }]}>
                <Text style={[styles.summaryNum, { color: '#047857' }]}>{taskSummary.completed}</Text>
                <Text style={styles.summaryLabel}>Selesai</Text>
              </View>
            </View>

            {/* Input Pencarian */}
            <TextInput
              style={styles.inputSearch}
              placeholder="🔍 Cari berdasarkan tugas / matkul..."
              value={searchKeyword}
              onChangeText={setSearchKeyword}
            />

            {/* Form Tambah Tugas */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Tambah Tugas Baru</Text>

              <TextInput
                ref={titleInputRef}
                style={styles.input}
                placeholder="Nama Tugas *"
                value={titleInput}
                onChangeText={setTitleInput}
              />
              <TextInput
                style={styles.input}
                placeholder="Nama Mata Kuliah *"
                value={courseInput}
                onChangeText={setCourseInput}
              />
              <TextInput
                style={styles.input}
                placeholder="Deskripsi Tugas"
                value={descInput}
                onChangeText={setDescInput}
              />
              <TextInput
                style={styles.input}
                placeholder="Deadline (contoh: 2026-11-20) *"
                value={deadLineInput}
                onChangeText={setDeadLineInput}
              />

              <View style={styles.btnFormRow}>
                <TouchableOpacity style={styles.btnAdd} onPress={handleAddTask}>
                  <Text style={styles.btnAddText}>+ Tambah Tugas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnResetAll} onPress={handleResetTasks}>
                  <Text style={styles.btnResetAllText}>Reset Semua</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Daftar Tugas Perkuliahan</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada data tugas yang ditemukan.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  listContent: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginVertical: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  summaryBox: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  summaryNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0284c7',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
    marginTop: 2,
  },
  inputSearch: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 16,
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 10,
  },
  btnFormRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  btnAdd: {
    flex: 2,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnAddText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnResetAll: {
    flex: 1,
    backgroundColor: '#fee2e2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnResetAllText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});