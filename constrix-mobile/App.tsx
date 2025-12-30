import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Alert, Modal, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const { width } = Dimensions.get('window');

const LinearGradient = ({ colors, style, children }: any) => (
  <View style={[style, { backgroundColor: colors[0] }]}>
    {children}
  </View>
);

const HomeIcon = ({ active }: { active: boolean }) => (
  <View style={[styles.iconContainer]}>
    <View style={styles.homeIconContainer}>
      <View style={[styles.homeIconRoof, active && styles.iconActive]} />
      <View style={[styles.homeIconBody, active && styles.iconActive]} />
    </View>
  </View>
);

const MapIcon = ({ active }: { active: boolean }) => (
  <View style={[styles.iconContainer]}>
    <View style={[styles.mapIconPin, active && styles.iconActive]}>
      <View style={styles.mapIconDot} />
    </View>
  </View>
);

const RecordIcon = ({ active }: { active: boolean }) => (
  <View style={[styles.iconContainer]}>
    <View style={[styles.recordIconOuter, active && styles.recordIconActive]}>
      <View style={styles.recordIconInner} />
    </View>
  </View>
);

const GroupIcon = ({ active }: { active: boolean }) => (
  <View style={[styles.iconContainer]}>
    <View style={styles.groupIconContainer}>
      <View style={[styles.groupIconPerson, active && styles.iconActive]} />
      <View style={[styles.groupIconPerson, active && styles.iconActive, { marginLeft: -6 }]} />
      <View style={[styles.groupIconPerson, active && styles.iconActive, { marginLeft: -6 }]} />
    </View>
  </View>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <View style={[styles.iconContainer]}>
    <View style={styles.profileIconContainer}>
      <View style={[styles.profileIconHead, active && styles.iconActive]} />
      <View style={[styles.profileIconBody, active && styles.iconActive]} />
    </View>
  </View>
);

function MainApp() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('home');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [joinedChallenge, setJoinedChallenge] = useState(false);
  const [likedActivities, setLikedActivities] = useState<number[]>([]);
  const [currentStreak, setCurrentStreak] = useState(12);
  const [todayGoals, setTodayGoals] = useState({ completed: 2, total: 3 });
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);
  const [trackingData, setTrackingData] = useState({
    distance: 0,
    duration: 0,
    calories: 0,
    startTime: null as Date | null
  });

  useEffect(() => {
    if (isAuthenticated) {
      requestLocationPermission();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location permission');
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    setTrackingData({
      distance: 0,
      duration: 0,
      calories: 0,
      startTime: new Date()
    });
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const handleLikeActivity = (index: number) => {
    if (likedActivities.includes(index)) {
      setLikedActivities(likedActivities.filter(i => i !== index));
    } else {
      setLikedActivities([...likedActivities, index]);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'checkin') {
      setTodayGoals({ ...todayGoals, completed: Math.min(todayGoals.completed + 1, todayGoals.total) });
    }
    setSelectedTab(action === 'checkin' ? 'record' : action);
  };

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
  };

  const handleStartRecording = () => {
    if (selectedActivity) {
      setIsRecording(!isRecording);
    }
  };

  const handleJoinGroup = (groupName: string) => {
    if (joinedGroups.includes(groupName)) {
      setJoinedGroups(joinedGroups.filter(g => g !== groupName));
    } else {
      setJoinedGroups([...joinedGroups, groupName]);
    }
  };

  const handleJoinChallenge = () => {
    setJoinedChallenge(!joinedChallenge);
  };

  const handleOpenVeryChat = () => {
    // In a real app, this would open VeryChat
    console.log('Opening VeryChat...');
  };

  const renderHomeScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayGoals.completed}/{todayGoals.total}</Text>
            <Text style={styles.statLabel}>Today's Goals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>847</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('checkin')}>
            <View style={styles.checkInIcon}>
              <Text style={styles.checkMarkText}>✓</Text>
            </View>
            <Text style={styles.quickActionText}>Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('record')}>
            <View style={styles.playIcon}>
              <View style={styles.playTriangle} />
            </View>
            <Text style={styles.quickActionText}>Start Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => handleQuickAction('groups')}>
            <View style={styles.groupsIcon}>
              <View style={styles.groupDot} />
              <View style={styles.groupDot} />
              <View style={styles.groupDot} />
            </View>
            <Text style={styles.quickActionText}>Join Group</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends Activity</Text>
        {[
          { name: 'Sarah', activity: 'Morning Run', time: '2h ago', streak: 15 },
          { name: 'Mike', activity: 'Study Session', time: '4h ago', streak: 8 },
          { name: 'Emma', activity: 'Meditation', time: '6h ago', streak: 22 },
        ].map((friend, index) => (
          <TouchableOpacity key={index} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <View style={styles.friendAvatar}>
                <Text style={styles.avatarText}>{friend.name[0]}</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.activityText}>completed {friend.activity}</Text>
                <Text style={styles.activityTime}>{friend.time}</Text>
              </View>
              <View style={styles.activityActions}>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakNumber}>{friend.streak}</Text>
                  <Text style={styles.streakLabel}>streak</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.likeButton, likedActivities.includes(index) && styles.likeButtonActive]}
                  onPress={() => handleLikeActivity(index)}
                >
                  <Text style={[styles.likeText, likedActivities.includes(index) && styles.likeTextActive]}>♥</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spotlight</Text>
        <TouchableOpacity style={styles.spotlightCard}>
          <Text style={styles.spotlightTitle}>Community Challenge</Text>
          <Text style={styles.spotlightDesc}>Join the 30-day fitness challenge with 1,247 participants</Text>
          <TouchableOpacity style={[styles.spotlightButton, joinedChallenge && { backgroundColor: '#10b981' }]} onPress={handleJoinChallenge}>
            <Text style={styles.spotlightButtonText}>
              {joinedChallenge ? 'Joined!' : 'Join Challenge'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderMapScreen = () => (
    <View style={styles.content}>
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Live Location</Text>
        
        {location ? (
          <TouchableOpacity style={styles.mapPreview} onPress={() => setShowFullMap(true)}>
            <MapView
              style={styles.miniMap}
              provider="google"
              mapType="standard"
              region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="You are here"
              />
            </MapView>
            <View style={styles.mapOverlay}>
              <Text style={styles.mapPreviewText}>Tap for full map</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.mapPlaceholder} onPress={() => setShowFullMap(true)}>
            <Text style={styles.mapText}>Getting Location...</Text>
            <Text style={styles.mapSubtext}>Tap to view full map</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.trackingButton, isTracking && styles.trackingButtonActive]} 
          onPress={isTracking ? stopTracking : startTracking}
        >
          <Text style={styles.trackingButtonText}>
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.locationStats}>
          <View style={styles.locationStat}>
            <Text style={styles.locationNumber}>{trackingData.distance.toFixed(2)}km</Text>
            <Text style={styles.locationLabel}>Distance</Text>
          </View>
          <View style={styles.locationStat}>
            <Text style={styles.locationNumber}>{Math.floor(trackingData.duration / 60)}min</Text>
            <Text style={styles.locationLabel}>Duration</Text>
          </View>
          <View style={styles.locationStat}>
            <Text style={styles.locationNumber}>{trackingData.calories}</Text>
            <Text style={styles.locationLabel}>Calories</Text>
          </View>
        </View>
      </View>
      
      <Modal visible={showFullMap} animationType="slide">
        <View style={styles.fullMapContainer}>
          <View style={styles.fullMapHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowFullMap(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.fullMapTitle}>Live Map</Text>
            <View style={styles.headerSpacer} />
          </View>
          {location ? (
            <MapView
              style={styles.fullMap}
              provider="google"
              mapType="standard"
              region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              showsScale={true}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="You are here"
              />
            </MapView>
          ) : (
            <View style={styles.loadingMap}>
              <Text style={styles.mapText}>Loading...</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );

  const renderRecordScreen = () => (
    <View style={styles.content}>
      <View style={styles.recordContainer}>
        <Text style={styles.recordTitle}>Record Activity</Text>
        <View style={styles.activityTypes}>
          {[
            { type: 'Run', color: '#ef4444' },
            { type: 'Study', color: '#3b82f6' },
            { type: 'Meditation', color: '#10b981' },
            { type: 'Workout', color: '#f59e0b' },
          ].map((activity, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.activityType, 
                { borderColor: activity.color },
                selectedActivity === activity.type && { backgroundColor: '#2a2a2a' }
              ]}
              onPress={() => handleActivitySelect(activity.type)}
            >
              <View style={[styles.activityDot, { backgroundColor: activity.color }]} />
              <Text style={styles.activityTypeText}>{activity.type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.recordButton}>
          <TouchableOpacity 
            style={[
              styles.startButton,
              !selectedActivity && { opacity: 0.5 },
              isRecording && { backgroundColor: '#10b981' }
            ]}
            onPress={handleStartRecording}
            disabled={!selectedActivity}
          >
            <Text style={styles.startButtonText}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderGroupsScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Communities</Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
        {[
          { name: 'Morning Runners', members: 234, activity: 'Running' },
          { name: 'Study Buddies', members: 156, activity: 'Learning' },
          { name: 'Mindful Moments', members: 89, activity: 'Meditation' },
        ].map((group, index) => (
          <View key={index} style={styles.groupCard}>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupActivity}>{group.activity}</Text>
              <Text style={styles.groupMembers}>{group.members} members</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.joinButton,
                joinedGroups.includes(group.name) && { backgroundColor: '#10b981' }
              ]}
              onPress={() => handleJoinGroup(group.name)}
            >
              <Text style={styles.joinButtonText}>
                {joinedGroups.includes(group.name) ? 'Joined' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.verychatSection}>
          <Text style={styles.verychatTitle}>VeryChat Integration</Text>
          <TouchableOpacity style={styles.verychatButton} onPress={handleOpenVeryChat}>
            <Text style={styles.verychatButtonText}>Open VeryChat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderProfileScreen = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weeklyGraph}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <View key={day} style={styles.dayColumn}>
              <View style={styles.activityIcons}>
                {index < 5 && <View style={[styles.activityDot, { backgroundColor: '#ef4444' }]} />}
                {index < 4 && <View style={[styles.activityDot, { backgroundColor: '#3b82f6' }]} />}
                {index < 6 && <View style={[styles.activityDot, { backgroundColor: '#10b981' }]} />}
              </View>
              <Text style={styles.dayLabel}>{day}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Streak Calendar</Text>
        <View style={styles.calendar}>
          {Array.from({ length: 30 }, (_, i) => (
            <View 
              key={i} 
              style={[
                styles.calendarDay, 
                i < 20 && styles.calendarDayActive,
                i === 19 && styles.calendarDayToday
              ]}
            >
              <Text style={[
                styles.calendarDayText,
                i < 20 && styles.calendarDayTextActive
              ]}>
                {i + 1}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'home': return renderHomeScreen();
      case 'map': return renderMapScreen();
      case 'record': return renderRecordScreen();
      case 'groups': return renderGroupsScreen();
      case 'profile': return <ProfileScreen />;
      default: return renderHomeScreen();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.username}>Alex</Text>
          </View>
          <View style={styles.profilePic}>
            <Text style={styles.profileText}>A</Text>
          </View>
        </View>
      </LinearGradient>
      {renderContent()}
      <View style={styles.bottomNav}>
        {[
          { id: 'home', label: 'Home', component: HomeIcon },
          { id: 'map', label: 'Map', component: MapIcon },
          { id: 'record', label: 'Record', component: RecordIcon },
          { id: 'groups', label: 'Groups', component: GroupIcon },
          { id: 'profile', label: 'You', component: ProfileIcon },
        ].map(tab => {
          const IconComponent = tab.component;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.navItem, selectedTab === tab.id && styles.navItemActive]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <IconComponent active={selectedTab === tab.id} />
              <Text style={[styles.navLabel, selectedTab === tab.id && styles.navLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: '#e2e8f0', fontSize: 16, opacity: 0.8 },
  username: { color: '#ffffff', fontSize: 28, fontWeight: '800', marginTop: 2 },
  profilePic: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  profileText: { color: '#6366f1', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, backgroundColor: '#0a0a0a' },
  section: { paddingHorizontal: 20, paddingVertical: 15 },
  sectionTitle: { color: '#ffffff', fontSize: 24, fontWeight: '800', marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  createButton: { backgroundColor: '#6366f1', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  createButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  activityCard: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  activityHeader: { flexDirection: 'row', alignItems: 'center' },
  friendAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#6366f1', justifyContent: 'center', alignItems: 'center', marginRight: 15, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6 },
  avatarText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  activityInfo: { flex: 1 },
  friendName: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 2 },
  activityText: { color: '#a1a1aa', fontSize: 15, marginBottom: 2 },
  activityTime: { color: '#71717a', fontSize: 13 },
  streakBadge: { alignItems: 'center', backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15 },
  streakNumber: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  streakLabel: { color: '#ffffff', fontSize: 11, opacity: 0.8 },
  spotlightCard: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 15, borderWidth: 1, borderColor: '#2a2a2a' },
  spotlightTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800', marginBottom: 10 },
  spotlightDesc: { color: '#a1a1aa', fontSize: 16, marginBottom: 20, lineHeight: 22 },
  spotlightButton: { backgroundColor: '#8b5cf6', paddingVertical: 15, borderRadius: 15, alignItems: 'center', shadowColor: '#8b5cf6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  spotlightButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  mapContainer: { padding: 20 },
  mapTitle: { color: '#ffffff', fontSize: 24, fontWeight: '800', marginBottom: 20 },
  mapPlaceholder: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 50, alignItems: 'center', marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  mapPreview: { backgroundColor: '#1a1a1a', borderRadius: 20, height: 200, marginBottom: 20, borderWidth: 1, borderColor: '#2a2a2a', overflow: 'hidden', position: 'relative' },
  miniMap: { width: '100%', height: '100%' },
  mapOverlay: { position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingVertical: 8, marginHorizontal: 20, borderRadius: 8 },
  mapPreviewText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  fullMapContainer: { flex: 1, backgroundColor: '#0a0a0a' },
  fullMapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: '#1a1a1a' },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  fullMapTitle: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  headerSpacer: { width: 40 },
  fullMap: { flex: 1 },
  loadingMap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  locationCard: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#2a2a2a' },
  locationText: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  coordinatesText: { color: '#10b981', fontSize: 16, fontWeight: '600' },
  trackingButton: { backgroundColor: '#6366f1', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25, marginBottom: 20, alignSelf: 'center' },
  trackingButtonActive: { backgroundColor: '#ef4444' },
  trackingButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  mapText: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  mapSubtext: { color: '#a1a1aa', fontSize: 15, textAlign: 'center' },
  locationStats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
  locationStat: { alignItems: 'center' },
  locationNumber: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  locationLabel: { color: '#a1a1aa', fontSize: 13 },
  recordContainer: { padding: 20 },
  recordTitle: { color: '#ffffff', fontSize: 24, fontWeight: '800', marginBottom: 25 },
  activityTypes: { marginBottom: 40 },
  activityType: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 15, borderWidth: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
  activityDot: { width: 16, height: 16, borderRadius: 8, marginRight: 15 },
  activityTypeText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  recordButton: { alignItems: 'center' },
  startButton: { backgroundColor: '#ef4444', paddingVertical: 18, paddingHorizontal: 50, borderRadius: 30, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 },
  startButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  groupCard: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  groupInfo: { flex: 1 },
  groupName: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 3 },
  groupActivity: { color: '#a1a1aa', fontSize: 15, marginBottom: 2 },
  groupMembers: { color: '#71717a', fontSize: 13 },
  joinButton: { backgroundColor: '#6366f1', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6 },
  joinButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  verychatSection: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 25, marginTop: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 15, borderWidth: 1, borderColor: '#2a2a2a' },
  verychatTitle: { color: '#ffffff', fontSize: 20, fontWeight: '800', marginBottom: 15 },
  verychatButton: { backgroundColor: '#10b981', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25, shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  verychatButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  weeklyGraph: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  dayColumn: { alignItems: 'center' },
  activityIcons: { height: 70, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 10 },
  dayLabel: { color: '#a1a1aa', fontSize: 13, fontWeight: '600' },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  calendarDay: { width: (width - 60) / 7, height: 45, backgroundColor: '#1a1a1a', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#2a2a2a' },
  calendarDayActive: { backgroundColor: '#6366f1', shadowColor: '#6366f1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  calendarDayToday: { backgroundColor: '#10b981', shadowColor: '#10b981', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  calendarDayText: { color: '#a1a1aa', fontSize: 15, fontWeight: '600' },
  calendarDayTextActive: { color: '#ffffff', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#1a1a1a', paddingVertical: 15, paddingBottom: 35, borderTopWidth: 1, borderTopColor: '#2a2a2a', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  navItemActive: { backgroundColor: 'transparent' },
  navLabel: { color: '#71717a', fontSize: 12, marginTop: 6, fontWeight: '600' },
  navLabelActive: { color: '#6366f1', fontWeight: '700' },
  iconContainer: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  iconActive: { backgroundColor: '#6366f1' },
  homeIconContainer: { alignItems: 'center' },
  homeIconRoof: { width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#71717a' },
  homeIconBody: { width: 12, height: 10, backgroundColor: '#71717a', marginTop: -1 },
  mapIconPin: { width: 16, height: 20, backgroundColor: '#71717a', borderRadius: 8, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, transform: [{ rotate: '45deg' }], justifyContent: 'center', alignItems: 'center' },
  mapIconDot: { width: 6, height: 6, backgroundColor: '#0a0a0a', borderRadius: 3, transform: [{ rotate: '-45deg' }] },
  recordIconOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: '#71717a', justifyContent: 'center', alignItems: 'center' },
  recordIconInner: { width: 8, height: 8, backgroundColor: '#71717a', borderRadius: 4 },
  recordIconActive: { borderColor: '#ef4444' },
  groupIconContainer: { flexDirection: 'row', alignItems: 'center' },
  groupIconPerson: { width: 8, height: 12, backgroundColor: '#71717a', borderRadius: 4, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  profileIconContainer: { alignItems: 'center' },
  profileIconHead: { width: 8, height: 8, backgroundColor: '#71717a', borderRadius: 4, marginBottom: 2 },
  profileIconBody: { width: 12, height: 8, backgroundColor: '#71717a', borderRadius: 6, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  checkInIcon: { width: 40, height: 40, backgroundColor: '#10b981', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  checkMarkText: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  playIcon: { width: 40, height: 40, backgroundColor: '#ef4444', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  playTriangle: { width: 0, height: 0, borderLeftWidth: 12, borderRightWidth: 0, borderBottomWidth: 8, borderTopWidth: 8, borderLeftColor: '#ffffff', borderRightColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent', marginLeft: 3 },
  groupsIcon: { width: 40, height: 40, backgroundColor: '#8b5cf6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: 8 },
  groupDot: { width: 8, height: 8, backgroundColor: '#ffffff', borderRadius: 4, marginHorizontal: 1 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statCard: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' },
  statNumber: { color: '#ffffff', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { color: '#a1a1aa', fontSize: 12, fontWeight: '600' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' },
  quickActionText: { color: '#ffffff', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  activityActions: { alignItems: 'center' },
  likeButton: { marginTop: 8, width: 32, height: 32, borderRadius: 6, backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' },
  likeButtonActive: { backgroundColor: '#ef4444' },
  likeText: { color: '#71717a', fontSize: 16 },
  likeTextActive: { color: '#ffffff' },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
});

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}