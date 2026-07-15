import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeIcon from './icons/HomeIcon';

type IconName =
  | 'email'
  | 'phone'
  | 'location'
  | 'calendar'
  | 'home'
  | 'flats'
  | 'sensors'
  | 'profile'
  | 'edit'
  | 'building'
  | 'wifi'
  | 'calendarStat'
  | 'search'
  | 'notifications'
  | 'handWave'
  | 'chevronDown'
  | 'chevronRight'
  | 'pending'
  | 'add';

export const Icon = ({
  name,
  size = 18,
  color = '#3B5BDB',
}: {
  name: IconName | string;
  size?: number;
  color?: string;
}) => {
  switch (name) {
    case 'email':
      return <MaterialIcons name="email" size={size} color={color} />;
    case 'phone':
      return <MaterialIcons name="phone" size={size} color={color} />;
    case 'location':
      return <MaterialIcons name="location-on" size={size} color={color} />;
    case 'calendar':
      return <MaterialIcons name="calendar-today" size={size} color={color} />;
    case 'home':
      return <HomeIcon size={size} color={color} />;
    case 'flats':
      return <MaterialIcons name="apartment" size={size} color={color} />;
    case 'sensors':
      return <MaterialIcons name="sensors" size={size} color={color} />;
    case 'profile':
      return <MaterialIcons name="person" size={size} color={color} />;
    case 'edit':
      return <MaterialIcons name="edit" size={size} color={color} />;
    case 'building':
      return <MaterialCommunityIcons name="office-building" size={size} color={color} />;
    case 'wifi':
      return <MaterialIcons name="wifi" size={size} color={color} />;
    case 'calendarStat':
      return <MaterialIcons name="bar-chart" size={size} color={color} />;
    case 'search':
      return <MaterialIcons name="search" size={size} color={color} />;
    case 'notifications':
      return <MaterialIcons name="notifications-none" size={size} color={color} />;
    case 'handWave':
      return <MaterialCommunityIcons name="hand-wave-outline" size={size} color={color} />;
    case 'chevronDown':
      return <MaterialIcons name="expand-more" size={size} color={color} />;
    case 'chevronRight':
      return <MaterialIcons name="chevron-right" size={size} color={color} />;
    case 'pending':
      return <MaterialIcons name="schedule" size={size} color={color} />;
    case 'add':
      return <MaterialIcons name="add" size={size} color={color} />;
    default:
      return <MaterialIcons name="circle" size={size} color={color} />;
  }
};
