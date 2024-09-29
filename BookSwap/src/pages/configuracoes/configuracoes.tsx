import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

function Sobre() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Sobre</Text>
        <View style={styles.versionBox}>
          <Text style={styles.description}>
            Aplicação desenvolvida na disciplina Projeto de Sistemas 2024/2 sob a orientação do professor Edelison.
          </Text>
        </View>
        <View style={styles.Timebox}>
        <Text style={styles.subtitle}>Time BookSwap:</Text>
        </View>

        <View style={styles.versionBox}>
          <Text style={styles.team}>
            Antonio André Barcelos Chagas{'\n'}
            Caio Santos Silva{'\n'}
            Eduardo Henrique Coelho Ramos{'\n'}
            Laura Barbosa Henrique{'\n'}
            Lucas José de Sousa Gomes{'\n'}
            Luiz Carlos Porto do Carmo
          </Text>
        </View>

      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Versão</Text>
        <View style={styles.versionBox}>
          <Text style={styles.version}>v1.0.0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Tecnologias e Licenças</Text>
        <View style={styles.versionBox}>
          <Text style={styles.license}>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Sobre"
        component={Sobre}
        options={{ headerShown: false }} // Isso remove o header
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B45',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  Timebox: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop:30,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 30,
  },
  team: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  versionBox: {
    backgroundColor: '#3b5998', // Cor de fundo da versão
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  version: {
    fontSize: 24,
    color: '#fff',
  },
  license: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
  },
});
