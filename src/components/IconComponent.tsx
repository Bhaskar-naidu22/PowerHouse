import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type IconName = 'email' | 'phone' | 'location' | 'calendar' | 'home' |
  'flats' | 'sensors' | 'profile' | 'edit' | 'building' | 'wifi' | 'calendarStat';

export const Icon = ({ name, size = 18, color = '#2563EB' }: {
  name: IconName | string;
  size?: number;
  color?: string
}) => {
  switch (name) {
    case 'email':        return <MaterialIcons name="email" size={size} color={color} />;
    case 'phone':        return <MaterialIcons name="phone" size={size} color={color} />;
    case 'location':     return <MaterialIcons name="location-on" size={size} color={color} />;
    case 'calendar':     return <MaterialIcons name="calendar-today" size={size} color={color} />;
    case 'home':         return <MaterialIcons name="home" size={size} color={color} />;
    case 'flats':        return <MaterialIcons name="apartment" size={size} color={color} />;
    case 'sensors':      return <MaterialIcons name="sensors" size={size} color={color} />;
    case 'profile':      return <MaterialIcons name="person" size={size} color={color} />;
    case 'edit':         return <MaterialIcons name="edit" size={size} color={color} />;
    case 'building':     return <MaterialCommunityIcons name="office-building" size={size} color={color} />;
    case 'wifi':         return <MaterialIcons name="wifi" size={size} color={color} />;
    case 'calendarStat': return <MaterialIcons name="bar-chart" size={size} color={color} />;
    default:             return <MaterialIcons name="circle" size={size} color={color} />;
  }
};