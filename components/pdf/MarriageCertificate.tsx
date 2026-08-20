import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

// Register fonts (using built-in fonts for now, can be customized)
Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf',
});

interface MarriageCertificateProps {
  marriage: {
    numero_acte: string;
    date_celebration: string;
    lieu_celebration: string;
    regime_matrimonial: string;
    epoux: {
      nom: string;
      prenom: string;
      postnom: string;
      date_naissance: string;
      lieu_naissance: string;
      profession: string;
      adresse_actuelle: string;
      numero_national: string;
    };
    epouse: {
      nom: string;
      prenom: string;
      postnom: string;
      date_naissance: string;
      lieu_naissance: string;
      profession: string;
      adresse_actuelle: string;
      numero_national: string;
    };
    officier: {
      username: string;
    };
    createdAt: string;
  };
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  officialBadge: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  officialText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fafafa',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#555',
    width: 120,
  },
  value: {
    fontSize: 11,
    color: '#333',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  signatureBox: {
    width: 200,
    textAlign: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 5,
    height: 30,
  },
  signatureLabel: {
    fontSize: 10,
    color: '#666',
  },
  dateLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    marginTop: 10,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.05,
    fontSize: 60,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default function MarriageCertificate({ marriage }: MarriageCertificateProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>OFFICIEL</Text>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CERTIFICAT DE MARIAGE</Text>
          <Text style={styles.subtitle}>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</Text>
          <Text style={styles.subtitle}>Ministère de l'Intérieur et Sécurité</Text>
          <Text style={styles.subtitle}>Division de l'État Civil</Text>
        </View>

        {/* Official Badge */}
        <View style={styles.officialBadge}>
          <Text style={styles.officialText}>ACTE OFFICIEL D'ÉTAT CIVIL</Text>
        </View>

        {/* Marriage Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DU MARIAGE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Numéro d'acte:</Text>
            <Text style={styles.value}>{marriage.numero_acte}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date de célébration:</Text>
            <Text style={styles.value}>{formatDate(marriage.date_celebration)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lieu de célébration:</Text>
            <Text style={styles.value}>{marriage.lieu_celebration}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Régime matrimonial:</Text>
            <Text style={styles.value}>{marriage.regime_matrimonial}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date d'enregistrement:</Text>
            <Text style={styles.value}>{formatDate(marriage.createdAt)}</Text>
          </View>
        </View>

        {/* Husband Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DE L'ÉPOUX</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom complet:</Text>
            <Text style={styles.value}>
              {marriage.epoux.nom} {marriage.epoux.postnom} {marriage.epoux.prenom}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Numéro national:</Text>
            <Text style={styles.value}>{marriage.epoux.numero_national}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date de naissance:</Text>
            <Text style={styles.value}>{formatDate(marriage.epoux.date_naissance)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lieu de naissance:</Text>
            <Text style={styles.value}>{marriage.epoux.lieu_naissance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Profession:</Text>
            <Text style={styles.value}>{marriage.epoux.profession}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse:</Text>
            <Text style={styles.value}>{marriage.epoux.adresse_actuelle}</Text>
          </View>
        </View>

        {/* Wife Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DE L'ÉPOUSE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom complet:</Text>
            <Text style={styles.value}>
              {marriage.epouse.nom} {marriage.epouse.postnom} {marriage.epouse.prenom}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Numéro national:</Text>
            <Text style={styles.value}>{marriage.epouse.numero_national}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date de naissance:</Text>
            <Text style={styles.value}>{formatDate(marriage.epouse.date_naissance)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lieu de naissance:</Text>
            <Text style={styles.value}>{marriage.epouse.lieu_naissance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Profession:</Text>
            <Text style={styles.value}>{marriage.epouse.profession}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse:</Text>
            <Text style={styles.value}>{marriage.epouse.adresse_actuelle}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.row}>
            <Text style={styles.label}>Officier d'état civil:</Text>
            <Text style={styles.value}>{marriage.officier.username}</Text>
          </View>
          <Text style={styles.dateLabel}>
            Document généré le: {formatDate(new Date().toISOString())}
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature de l'Époux</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature de l'Épouse</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Officier d'État Civil</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}