import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const C = {
  background: '#fff',
  foreground: '#111',
  card: '#EFEFEF',
  primary: '#3336FD',
  primaryFg: '#fff',
  secondary: '#36D97A',
  secondaryFg: '#111',
  muted: '#D1D1D2',
  mutedFg: '#7F7F7F',
  accent: '#EEEEF3',
  border: '#E5E5E5',
  paleBlue: '#DBE9FE',
  paleGreen: '#D4FDE5',
  paleYellow: '#FFF3D3',
  yellow: '#FEBC17',
  error: '#E83B05',
  palered: '#FFC6BA',
};

const STATS = [
  { label: 'Sessions', value: '24', bg: C.paleBlue, fg: C.primary },
  { label: 'This Week', value: '3h 40m', bg: C.paleGreen, fg: '#1a8a4a' },
  { label: 'DUPR', value: '3.5', bg: C.paleYellow, fg: '#9a6200' },
];

const DRILLS = [
  { id: 1, title: 'Professional Control', duration: '20 min', level: 'Intermediate', dot: C.primary },
  { id: 2, title: 'Third Shot Drop', duration: '15 min', level: 'Advanced', dot: C.secondary },
  { id: 3, title: 'Dink Rallies', duration: '10 min', level: 'Beginner', dot: C.yellow },
];

type Post = { id: number; title: string; body: string };

export default function App() {
  const [search, setSearch] = useState('');

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [fetched, setFetched] = useState(false);

  const filteredDrills = DRILLS.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  async function fetchLogs() {
    setLoading(true);
    setFetchError('');
    try {
      await new Promise((r) => setTimeout(r, 800));
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Post[] = await res.json();
      setPosts(data);
      setFetched(true);
    } catch (e: any) {
      setFetchError(e.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        testID="scroll_main"
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View testID="header" style={styles.header}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text testID="header_name" style={styles.name}>Hi Tony,</Text>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>● ACTIVE SESSION</Text>
          </View>
        </View>

        <View testID="search_container" style={styles.searchWrap}>
          <TextInput
            testID="input_search"
            style={styles.searchInput}
            placeholder="Tìm bài tập..."
            placeholderTextColor={C.mutedFg}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        <TouchableOpacity testID="btn_start_training" style={styles.heroCard} activeOpacity={0.88}>
          <Text style={styles.heroEyebrow}>READY TO PLAY?</Text>
          <Text testID="start_training" style={styles.heroTitle}>Start Training</Text>
          <Text testID="pick_a_drill" style={styles.heroSub}>Pick a drill or begin a free session</Text>
          <View style={styles.heroBtn}>
            <Text testID="begin" style={styles.heroBtnText}>Begin →</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <View
              key={stat.label}
              testID={`stat_${stat.label.toLowerCase().replace(/\s+/g, '_')}`}
              style={[styles.statCard, { backgroundColor: stat.bg }]}
            >
              <Text
                testID={`stat_value_${stat.label.toLowerCase().replace(/\s+/g, '_')}`}
                style={[styles.statValue, { color: stat.fg }]}
              >
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text testID="featured_drills" style={styles.sectionTitle}>Featured Drills</Text>
          {filteredDrills.length === 0 ? (
            <View testID="no_results" style={styles.emptyWrap}>
              <Text style={styles.emptyText}>Không tìm thấy bài tập nào.</Text>
            </View>
          ) : (
            filteredDrills.map((drill) => (
              <TouchableOpacity
                key={drill.id}
                testID={`btn_drill_${drill.id}`}
                style={styles.drillCard}
                activeOpacity={0.7}
              >
                <View style={[styles.drillDot, { backgroundColor: drill.dot }]} />
                <View style={styles.drillInfo}>
                  <Text testID={`drill_title_${drill.id}`} style={styles.drillTitle}>{drill.title}</Text>
                  <Text style={styles.drillMeta}>{drill.duration} · {drill.level}</Text>
                </View>
                <View style={styles.drillArrow}>
                  <Text style={styles.drillArrowText}>›</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View testID="progress_banner" style={styles.progressBanner}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>Weekly goal</Text>
            <Text testID="progress_pct" style={styles.progressPct}>60%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View testID="progress_fill" style={styles.progressFill} />
          </View>
          <Text testID="progress_sub" style={styles.progressSub}>3 of 5 sessions completed</Text>
        </View>

        <View testID="fetch_section" style={styles.fetchSection}>
          <View style={styles.fetchHeader}>
            <Text style={styles.sectionTitle}>Training Logs</Text>
            <TouchableOpacity
              testID="btn_fetch"
              style={styles.fetchBtn}
              activeOpacity={0.8}
              onPress={fetchLogs}
              disabled={loading}
            >
              {loading ? (
                <View testID="fetch_loading" style={{ minWidth: 58, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={C.primaryFg} />
                </View>
              ) : (
                <Text testID="btn_fetch_label" style={styles.fetchBtnText}>
                  {fetched ? 'Refresh' : 'Load logs'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {fetchError !== '' && (
            <View testID="fetch_error" style={styles.errorWrap}>
              <Text style={styles.errorText}>{fetchError}</Text>
            </View>
          )}

          {posts.map((post) => (
            <View key={post.id} testID={`log_item_${post.id}`} style={styles.logCard}>
              <Text testID={`log_title_${post.id}`} style={styles.logTitle} numberOfLines={1}>
                {post.title}
              </Text>
              <Text style={styles.logBody} numberOfLines={2}>{post.body}</Text>
            </View>
          ))}

          {fetched && posts.length === 0 && (
            <Text testID="fetch_empty" style={styles.emptyText}>Không có log nào.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  scroll: { flex: 1 },
  content: { padding: 20, paddingTop: 72, paddingBottom: 48, gap: 20 },

  header: { gap: 4 },
  greeting: { fontSize: 15, color: C.mutedFg, fontWeight: '400' },
  name: { fontSize: 30, color: C.foreground, fontWeight: '700', letterSpacing: -0.5 },
  activeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: C.paleGreen,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  activeBadgeText: { fontSize: 10, fontWeight: '700', color: '#1a8a4a', letterSpacing: 1.2 },

  searchWrap: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.card,
    paddingHorizontal: 14,
    paddingVertical: 0,
    height: 44,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 15,
    color: C.foreground,
    height: 44,
  },

  heroCard: { backgroundColor: C.primary, borderRadius: 20, padding: 24, gap: 6 },
  heroEyebrow: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: C.primaryFg, letterSpacing: -0.5 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: C.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 14,
  },
  heroBtnText: { color: C.secondaryFg, fontSize: 14, fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, borderRadius: 16, padding: 14, gap: 4 },
  statValue: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  statLabel: { fontSize: 11, color: C.mutedFg, fontWeight: '500' },

  section: { gap: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: C.foreground, letterSpacing: -0.3, marginBottom: 4 },

  emptyWrap: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  emptyText: { fontSize: 13, color: C.mutedFg },

  drillCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  drillDot: { width: 8, height: 8, borderRadius: 100 },
  drillInfo: { flex: 1, gap: 2 },
  drillTitle: { fontSize: 15, fontWeight: '600', color: C.foreground },
  drillMeta: { fontSize: 12, color: C.mutedFg },
  drillArrow: {
    width: 28, height: 28, borderRadius: 100,
    backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center',
  },
  drillArrowText: { color: C.primary, fontSize: 20, lineHeight: 24 },

  progressBanner: {
    backgroundColor: C.accent, borderRadius: 16, padding: 18, gap: 8,
    borderWidth: 1, borderColor: C.border,
  },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 14, fontWeight: '600', color: C.foreground },
  progressPct: { fontSize: 14, fontWeight: '700', color: C.primary },
  progressTrack: { height: 6, backgroundColor: C.muted, borderRadius: 100, overflow: 'hidden' },
  progressFill: { height: 6, width: '60%', backgroundColor: C.primary, borderRadius: 100 },
  progressSub: { fontSize: 12, color: C.mutedFg },

  fetchSection: { gap: 10 },
  fetchHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fetchBtn: {
    backgroundColor: C.primary,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fetchBtnText: { color: C.primaryFg, fontSize: 13, fontWeight: '600' },

  errorWrap: {
    backgroundColor: C.palered,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: C.error,
  },
  errorText: { fontSize: 13, color: C.error, fontWeight: '500' },

  logCard: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  logTitle: { fontSize: 14, fontWeight: '600', color: C.foreground },
  logBody: { fontSize: 12, color: C.mutedFg, lineHeight: 18 },
});
