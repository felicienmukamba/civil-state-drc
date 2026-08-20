import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register fonts (using built-in fonts for now, can be customized)
Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf',
});

interface DivorceCertificateProps {
  divorce: {
    numero_acte: string;
    date_enregistrement: string;
    decision_justice_ref: string;
    motif: string;
    mariage: {
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
    backgroundColor: '#fff5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#feb2b2',
  },
  officialText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#c53030',
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
    width: 140,
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
  alertBox: {
    backgroundColor: '#fff5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#feb2b2',
  },
  alertText: {
    fontSize: 10,
    color: '#c53030',
    textAlign: 'center',
  },
});

export default function DivorceCertificate({ divorce }: DivorceCertificateProps) {
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
        <Text style={styles.watermark}>DIVORCE</Text>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CERTIFICAT DE DIVORCE</Text>
          <Text style={styles.subtitle}>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</Text>
          <Text style={styles.subtitle}>Ministère de l'Intérieur et Sécurité</Text>
          <Text style={styles.subtitle}>Division de l'État Civil</Text>
        </View>

        {/* Official Badge */}
        <View style={styles.officialBadge}>
          <Text style={styles.officialText}>ACTE OFFICIEL DE DISSOLUTION DE MARIAGE</Text>
        </View>

        {/* Alert Box */}
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            Ce document certifie officiellement la dissolution légale du mariage mentionné ci-dessous.
          </Text>
        </View>

        {/* Divorce Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DU DIVORCE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Numéro d'acte:</Text>
            <Text style={styles.value}>{divorce.numero_acte}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date d'enregistrement:</Text>
            <Text style={styles.value}>{formatDate(divorce.date_enregistrement)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Référence décision justice:</Text>
            <Text style={styles.value}>{divorce.decision_justice_ref}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Motif principal:</Text>
            <Text style={styles.value}>{divorce.motif}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date d'enregistrement:</Text>
            <Text style={styles.value}>{formatDate(divorce.createdAt)}</Text>
          </View>
        </View>

        {/* Original Marriage Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MARIAGE D'ORIGINE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Numéro d'acte de mariage:</Text>
            <Text style={styles.value}>{divorce.mariage.numero_acte}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date de célébration:</Text>
            <Text style={styles.value}>{formatDate(divorce.mariage.date_celebration)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lieu de célébration:</Text>
            <Text style={styles.value}>{divorce.mariage.lieu_celebration}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Régime matrimonial:</Text>
            <Text style={styles.value}>{divorce.mariage.regime_matrimonial}</Text>
          </View>
        </View>

        {/* Former Husband Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EX-ÉPOUX</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom complet:</Text>
            <Text style={styles.value}>
              {divorce.mariage.epoux.nom} {divorce.mariage.epoux.postnom} {divorce.mariage.epoux.prenom}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Numéro national:</Text>
            <Text style={styles.value}>{divorce.mariage.epoux.numero_national}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date de naissance:</Text>
            <Text style={styles.value}>{formatDate(divorce.mariage.epoux.date_naissance)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lieu de naissance:</Text>
            <Text style={styles.value}>{divorce.mariage.epoux.lieu_naissance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Profession:</Text>
            <Text style={styles.value}>{divorce.mariage.epoux.profession}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse:</Text>
            <Text style={styles.value}>{divorce.mariage.epoux.adresse_actuelle}</Text>
          </View>
        </View>

        {/* Former Wife Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EX-ÉPOUSE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom complet:</Text>
            <Text style={styles.value}>
              {divorce.mariage.epouse.nom} {divorce.mariage.epouse.postnom} {divorce.mariage.epouse.prenom}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Numéro national:</Text>
            <Text style={styles.value}>{divorce.mariage.epouse.numero_national}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date de naissance:</Text>
            <Text style={styles.value}>{formatDate(divorce.mariage.epouse.date_naissance)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lieu de naissance:</Text>
            <Text style={styles.value}>{divorce.mariage.epouse.lieu_naissance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Profession:</Text>
            <Text style={styles.value}>{divorce.mariage.epouse.profession}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Adresse:</Text>
            <Text style={styles.value}>{divorce.mariage.epouse.adresse_actuelle}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.row}>
            <Text style={styles.label}>Officier d'état civil:</Text>
            <Text style={styles.value}>{divorce.officier.username}</Text>
          </View>
          <Text style={styles.dateLabel}>
            Document généré le: {formatDate(new Date().toISOString())}
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature de l'Ex-Époux</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature de l'Ex-Épouse</Text>
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