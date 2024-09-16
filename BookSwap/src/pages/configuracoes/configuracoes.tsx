import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Sobre() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Sobre</Text>
        <Text style={styles.description}>
          Aplicação desenvolvida na disciplina Projeto de Sistemas 2024/2 sob a orientação do professor Edelison.
        </Text>
        <Text style={styles.subtitle}>Time BookSwap:</Text>
        <Text style={styles.team}>
          Antonio André Barcelos Chagas{'\n'}
          Caio Santos Silva{'\n'}
          Eduardo Henrique Coelho Ramos{'\n'}
          Laura Barbosa Henrique{'\n'}
          Lucas José de Sousa Gomes{'\n'}
          Luiz Carlos Porto do Carmo
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Versão</Text>
        <View style={styles.versionBox}>
          <Text style={styles.version}>v1.0.0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Tecnologias e Licenças</Text>
        <Text style={styles.license}>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFBFBF', // Cor de fundo da tela (azul escuro)
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  team: {
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
  },
  versionBox: {
    backgroundColor: '#BFBFBF', // Cor de fundo da versão
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  version: {
    fontSize: 24,
    color: '#000',
  },
  license: {
    fontSize: 14,
    color: '#000',
    fontStyle: 'italic',
  },
});
