import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AppBar from '../../../components/Appbar';
import { ConstructionStackParamList } from '@/types/TypeScreen';
import { getConstructionByName } from '../../../api/Contruction/Contruction';
import { SubConstructionItem } from '@/types/screens/Contruction/ContructionType';

const PIT: React.FC = () => {
  const route = useRoute<RouteProp<ConstructionStackParamList, 'PIT'>>();
  const { Name } = route.params;
  
  const [constructionData, setConstructionData] = useState<SubConstructionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConstructionData = async () => {
      try {
        const data = await getConstructionByName(Name);
        setConstructionData(data);
      } catch (err) {
        setError('Error fetching construction data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConstructionData();
  }, [Name]);

  return (
    <View style={{ padding: 20 }}>
      <AppBar nameScreen='Tính chi phí xây dựng thô' />
      
      {/* Display loading indicator */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Display error message if any */}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      
      {/* Display construction data if available */}
      {constructionData && (
        <View>
          <Text>Name: {constructionData.Name}</Text>
          <Text>Coefficient: {constructionData.Coefficient}</Text>
          <Text>Unit: {constructionData.Unit}</Text>
        </View>
      )}
    </View>
  );
};

export default PIT;
