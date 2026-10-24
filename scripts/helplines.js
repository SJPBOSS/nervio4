/**
 * Crisis lines checked against the 2026-10-23 helpline list.
 *
 * Emergency numbers were NOT re-verified on 2026-10-23, except the four that
 * appeared on fetched helpline pages: Canada 911, Australia 000, Costa Rica
 * 911, and New Zealand 111.
 *
 * TODO: human check before publishing:
 * United States 911, Mexico 911, Colombia 123, Peru 106 and 105,
 * Argentina 911 and 107, Chile 131 and 133, Uruguay 911, Ecuador 911,
 * Dominican Republic 911, Brazil 192, Portugal 112, Spain 112,
 * France 112 and 15, Belgium 112, Switzerland 144 and 112,
 * United Kingdom 999 and 112, Ireland 112 and 999, Germany 112,
 * Austria 112 and 144, Italy 112, Netherlands 112, Norway 113 and 112,
 * Finland 112, Denmark 112, Turkey 112, India 112, Philippines 911,
 * Indonesia 112 and 119, Japan 119 and 110, South Korea 119 and 112,
 * Malaysia 999, Thailand 1669 and 191, Israel 101,
 * United Arab Emirates 999 and 998, South Africa 10111, 10177, and 112,
 * Nigeria 112, Morocco 141, 15, 19, and 112, Côte d'Ivoire 185 and 110.
 *
 * Omitted on purpose (unverified, not shown): Pakistan Umang 0311 7786264,
 * Saudi Arabia 920033360, South Africa LifeLine 0861 322 322,
 * Kenya Red Cross 1199, Befrienders Kenya +254 722 178 177, Egypt 16328.
 * Turkey and Morocco show emergency-number guidance only.
 * Portugal SNS 24 is unverified and is shown flagged. The English reading is
 * exactly: 808 24 24 24, then option 4.
 */
import { HELP_UI_EXTRA, applyHelplineLocales } from './helpline-locales.js';

const t = (en, fr, es, pt) => ({ en, fr, es, pt });
const phone = (href, label) => ({ href, label });

const SNS_SOURCE = 'https://www.sns24.gov.pt/servico/aconselhamento-psicologico-no-sns-24/';

function snsParts() {
  const phrase = {
    en: '808 24 24 24, then option 4',
    fr: '808 24 24 24, puis l’option 4',
    es: '808 24 24 24, luego la opción 4',
    pt: '808 24 24 24, depois a opção 4',
  };
  const tail = {
    en: '. Psychological counselling through SNS 24. Not confirmed from a live page on this check (',
    fr: '. Conseil psychologique du SNS 24. Non confirmé sur une page en direct lors de cette vérification (',
    es: '. Consejo psicológico del SNS 24. No confirmado en una página en vivo en esta revisión (',
    pt: '. Aconselhamento psicológico do SNS 24. Não confirmado numa página ao vivo nesta verificação (',
  };
  return Object.fromEntries(['en', 'fr', 'es', 'pt'].map((lang) => [lang, [
    { text: 'SNS 24: ' },
    { href: 'tel:808242424', label: phrase[lang] },
    { text: tail[lang] },
    { href: SNS_SOURCE, label: 'SNS 24' },
    { text: ').' },
  ]]));
}

const always = t(
  'Free, 24 hours.',
  'Gratuit, 24 h/24.',
  'Gratis, las 24 horas.',
  'Grátis, 24 horas.',
);

export const HELP_UI = {
  en: {
    open: 'Need help now?',
    short: 'Help',
    title: 'Need help now?',
    lead: 'If you are in crisis or thinking about hurting yourself, use a line for your country. Nervio is not an emergency service and cannot contact anyone for you.',
    country: 'Country',
    choose: 'All countries',
    emergency: 'Emergency',
    unverified: 'Not confirmed',
    close: 'Close',
    others: 'Other countries',
    somewhere: 'Somewhere else:',
    find: 'lists local lines.',
    noLine: 'No dedicated crisis line is listed here.',
  },
  fr: {
    open: 'Besoin d’aide maintenant ?',
    short: 'Aide',
    title: 'Besoin d’aide maintenant ?',
    lead: 'Si vous êtes en détresse ou si vous pensez à vous faire du mal, contactez une ligne de votre pays. Nervio n’est pas un service d’urgence et ne peut joindre personne pour vous.',
    country: 'Pays',
    choose: 'Tous les pays',
    emergency: 'Urgence',
    unverified: 'Non confirmé',
    close: 'Fermer',
    others: 'Autres pays',
    somewhere: 'Ailleurs :',
    find: 'indique des lignes locales.',
    noLine: 'Aucune ligne de crise dédiée n’est indiquée ici.',
  },
  es: {
    open: '¿Necesitas ayuda ahora?',
    short: 'Ayuda',
    title: '¿Necesitas ayuda ahora?',
    lead: 'Si estás en crisis o piensas en hacerte daño, usa una línea de tu país. Nervio no es un servicio de emergencias y no puede contactar a nadie por ti.',
    country: 'País',
    choose: 'Todos los países',
    emergency: 'Emergencia',
    unverified: 'Sin confirmar',
    close: 'Cerrar',
    others: 'Otros países',
    somewhere: 'En otros lugares:',
    find: 'reúne líneas locales.',
    noLine: 'Aquí no hay una línea de crisis dedicada.',
  },
  pt: {
    open: 'Precisa de ajuda agora?',
    short: 'Ajuda',
    title: 'Precisa de ajuda agora?',
    lead: 'Se você está em crise ou pensando em se machucar, use uma linha do seu país. O Nervio não é um serviço de emergência e não pode ligar para ninguém por você.',
    country: 'País',
    choose: 'Todos os países',
    emergency: 'Emergência',
    unverified: 'Não confirmado',
    close: 'Fechar',
    others: 'Outros países',
    somewhere: 'Em outros lugares:',
    find: 'lista linhas locais.',
    noLine: 'Nenhuma linha de crise dedicada está listada aqui.',
  },
};

Object.assign(HELP_UI, HELP_UI_EXTRA);

export const HELP_GROUPS = {
  de: ['DE', 'AT', 'CH'],
  it: ['IT'],
  nl: ['NL', 'BE'],
  ja: ['JP'],
  ko: ['KR'],
  hi: ['IN'],
};

function line(name, contacts, detail, source, sourceLabel, extra = {}) {
  return { name, contacts, detail, source, sourceLabel, verified: true, ...extra };
}

export const COUNTRIES = [
  {
    iso: 'CA',
    name: t('Canada', 'Canada', 'Canadá', 'Canadá'),
    emergencyContacts: [phone('tel:911', '911')],
    services: [
      line(
        '9-8-8 Suicide Crisis Helpline',
        [phone('tel:988', '988'), phone('sms:988', 'text 988')],
        t('Call or text, any time.', 'Appelez ou textez, en tout temps.', 'Llama o envía un mensaje, a cualquier hora.', 'Ligue ou envie uma mensagem, a qualquer hora.'),
        'https://988.ca/',
        '9-8-8 Suicide Crisis Helpline',
      ),
      line(
        'Ligne québécoise de prévention du suicide',
        [phone('tel:+18662773553', '1 866 277-3553'), phone('sms:535353', '535353')],
        t('1 866 APPELLE. Free, any time. You can also text 535353.', '1 866 APPELLE. Gratuit, en tout temps. Vous pouvez aussi texter le 535353.', '1 866 APPELLE. Gratis, a cualquier hora. También puedes enviar un texto al 535353.', '1 866 APPELLE. Grátis, a qualquer hora. Você também pode enviar uma mensagem para 535353.'),
        'https://www.quebec.ca/sante/sante-mentale/s-informer-sur-sante-mentale-et-troubles-mentaux/reconnaitre-signes-detresse-et-prevenir-suicide',
        'Gouvernement du Québec',
      ),
    ],
  },
  {
    iso: 'US',
    name: t('United States', 'États-Unis', 'Estados Unidos', 'Estados Unidos'),
    emergencyContacts: [phone('tel:911', '911')],
    services: [
      line(
        '988 Suicide & Crisis Lifeline',
        [phone('tel:988', '988'), phone('sms:988', 'text 988')],
        t(
          'Call or text, 24 hours. In Spanish, press 2 or text AYUDA.',
          'Composez ou textez, 24 h/24. En espagnol, appuyez sur 2 ou textez AYUDA.',
          'Llama y presiona 2, o envía la palabra AYUDA, las 24 horas.',
          'Ligue ou envie uma mensagem, 24 horas. Em espanhol, pressione 2 ou envie AYUDA.',
        ),
        'https://988lifeline.org/',
        '988 Suicide & Crisis Lifeline',
      ),
    ],
  },
  {
    iso: 'MX',
    name: t('Mexico', 'Mexique', 'México', 'México'),
    emergencyContacts: [phone('tel:911', '911')],
    services: [
      line(
        'Línea de la Vida',
        [phone('tel:8009112000', '800 911 2000')],
        t('Free, 24 hours, every day.', 'Gratuit, 24 h/24, tous les jours.', 'Gratis, las 24 horas, todos los días.', 'Grátis, 24 horas, todos os dias.'),
        'https://www.gob.mx/lineadelavida',
        'gob.mx/lineadelavida',
      ),
    ],
  },
  {
    iso: 'CO',
    name: t('Colombia', 'Colombie', 'Colombia', 'Colômbia'),
    emergencyContacts: [phone('tel:123', '123')],
    services: [
      line(
        'Línea 106',
        [phone('tel:106', '106')],
        always,
        'https://www.minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx',
        'Ministerio de Salud',
      ),
    ],
  },
  {
    iso: 'PE',
    name: t('Peru', 'Pérou', 'Perú', 'Peru'),
    emergencyContacts: [phone('tel:106', '106'), phone('tel:105', '105')],
    services: [
      line(
        'Línea 113',
        [phone('tel:113', '113')],
        t('Then option 5. Free, 24 hours.', 'Puis l’option 5. Gratuit, 24 h/24.', 'opción 5, gratis, las 24 horas.', 'Depois a opção 5. Grátis, 24 horas.'),
        'https://www.gob.pe/20715',
        'Ministerio de Salud del Perú',
      ),
    ],
  },
  {
    iso: 'AR',
    name: t('Argentina', 'Argentine', 'Argentina', 'Argentina'),
    emergencyContacts: [phone('tel:911', '911'), phone('tel:107', '107')],
    services: [
      line(
        'Línea 0800 Salud Mental',
        [phone('tel:08009990091', '0800-999-0091')],
        t(
          'National line. Free, 24 hours, every day.',
          'Ligne nationale. Gratuite, 24 h/24, tous les jours.',
          'Línea nacional. Gratis, las 24 horas, todos los días.',
          'Linha nacional. Grátis, 24 horas, todos os dias.',
        ),
        'https://www.argentina.gob.ar/salud/hospitalbonaparte/hospital-en-red/dispositivo-0800',
        'argentina.gob.ar',
      ),
      line(
        'Centro de Asistencia al Suicida',
        [phone('tel:135', '135'), phone('tel:08003451435', '0800 345 1435'), phone('tel:+541152751135', '(011) 5275-1135')],
        t(
          '135 is free only from CABA and Greater Buenos Aires. The other numbers reach the rest of the country. 24 hours.',
          'Le 135 est gratuit seulement depuis CABA et le Grand Buenos Aires. Les autres numéros couvrent le reste du pays. 24 h/24.',
          'El 135 es gratis solo desde CABA y el Gran Buenos Aires. Los otros números cubren el resto del país. Las 24 horas.',
          'O 135 é grátis só a partir de CABA e da Grande Buenos Aires. Os outros números cobrem o resto do país. 24 horas.',
        ),
        'https://www.asistenciaalsuicida.org.ar/',
        'asistenciaalsuicida.org.ar',
      ),
    ],
  },
  {
    iso: 'CL',
    name: t('Chile', 'Chili', 'Chile', 'Chile'),
    emergencyContacts: [phone('tel:131', '131'), phone('tel:133', '133')],
    services: [
      line(
        'Línea *4141',
        [phone('tel:*4141', '*4141')],
        t(
          'Free from a mobile phone, any carrier, 24 hours every day.',
          'Gratuit depuis un mobile, tout opérateur, 24 h/24, tous les jours.',
          'Gratis desde un celular, cualquier compañía, las 24 horas, todos los días.',
          'Grátis de um celular, qualquer operadora, 24 horas, todos os dias.',
        ),
        'https://www.minsal.cl/linea-de-atencion-4141-no-estas-solo-no-estas-sola/',
        'MINSAL',
      ),
    ],
  },
  {
    iso: 'UY',
    name: t('Uruguay', 'Uruguay', 'Uruguay', 'Uruguai'),
    emergencyContacts: [phone('tel:911', '911')],
    services: [
      line(
        'Línea Vida',
        [phone('tel:08000767', '0800 0767'), phone('tel:*0767', '*0767')],
        always,
        'https://www.gub.uy/ministerio-salud-publica/salud-mental',
        'Ministerio de Salud Pública',
      ),
    ],
  },
  {
    iso: 'EC',
    name: t('Ecuador', 'Équateur', 'Ecuador', 'Equador'),
    emergencyContacts: [phone('tel:911', '911')],
    services: [
      line(
        'Línea 171',
        [phone('tel:171', '171')],
        t(
          'Option 6. Free, every day from 07:00 to 20:00. Not a 24-hour line.',
          'Option 6. Gratuit, tous les jours de 7 h à 20 h. Pas une ligne 24 h/24.',
          'opción 6, gratis, todos los días de 7:00 a 20:00. No es una línea de 24 horas.',
          'Opção 6. Grátis, todos os dias das 7:00 às 20:00. Não é uma linha 24 horas.',
        ),
        'https://www.salud.gob.ec/a-traves-de-la-linea-171-msp-ofrece-atencion-en-salud-mental/',
        'Ministerio de Salud Pública',
      ),
    ],
  },
  {
    iso: 'CR',
    name: t('Costa Rica', 'Costa Rica', 'Costa Rica', 'Costa Rica'),
    emergencyContacts: [phone('tel:911', '911')],
    services: [
      line(
        'Aquí Estoy',
        [phone('tel:8002737869', '800 273 7869')],
        t(
          'Free. Monday to Friday, 14:00 to 22:00, and Saturday, 09:00 to 16:00. Closed Sunday.',
          'Gratuit. Du lundi au vendredi, de 14 h à 22 h, et le samedi, de 9 h à 16 h. Fermé le dimanche.',
          'Gratis. De lunes a viernes, de 14:00 a 22:00, y los sábados, de 9:00 a 16:00. Domingo cerrado.',
          'Grátis. De segunda a sexta, das 14:00 às 22:00, e sábado, das 9:00 às 16:00. Domingo fechado.',
        ),
        'https://aquiestoy.cr/',
        'aquiestoy.cr',
      ),
    ],
  },
  {
    iso: 'DO',
    name: t('Dominican Republic', 'République dominicaine', 'República Dominicana', 'República Dominicana'),
    emergencyContacts: [phone('tel:911', '911')],
    services: [
      line(
        'Cuida tu Salud Mental',
        [phone('tel:711', '711')],
        t(
          'Free and confidential, every day from 08:00 to midnight. Not a 24-hour line.',
          'Gratuit et confidentiel, tous les jours de 8 h à minuit. Pas une ligne 24 h/24.',
          'Gratuito y confidencial, todos los días de 8:00 a medianoche. No es una línea de 24 horas.',
          'Grátis e confidencial, todos os dias das 8:00 à meia-noite. Não é uma linha 24 horas.',
        ),
        'https://msp.gob.do/web/?p=21208',
        'Ministerio de Salud Pública',
      ),
    ],
  },
  {
    iso: 'BR',
    name: t('Brazil', 'Brésil', 'Brasil', 'Brasil'),
    emergencyContacts: [phone('tel:192', '192')],
    services: [
      line(
        'CVV — Centro de Valorização da Vida',
        [phone('tel:188', '188')],
        t('Free, 24 hours.', 'Gratuit, 24 h/24.', 'Gratis, las 24 horas.', 'Grátis, 24 horas.'),
        'https://www.cvv.org.br/',
        'Centro de Valorização da Vida',
      ),
    ],
  },
  {
    iso: 'PT',
    name: t('Portugal', 'Portugal', 'Portugal', 'Portugal'),
    emergencyContacts: [phone('tel:112', '112')],
    services: [
      line(
        'Linha 1411',
        [phone('tel:1411', '1411')],
        t(
          'National suicide prevention line, launched in September 2025. Free, 24 hours, every day.',
          'Ligne nationale de prévention du suicide, lancée en septembre 2025. Gratuite, 24 h/24, tous les jours.',
          'Línea nacional de prevención del suicidio, lanzada en septiembre de 2025. Gratis, las 24 horas, todos los días.',
          'Linha nacional de prevenção do suicídio, lançada em setembro de 2025. Grátis, 24 horas, todos os dias.',
        ),
        'https://www.spms.min-saude.pt/2025/09/lancamento-da-linha-nacional-de-prevencao-do-suicidio-e-apoio-psicologico-1411/',
        'SPMS',
      ),
      line('SNS 24', [], always, SNS_SOURCE, 'SNS 24', { verified: false, parts: snsParts() }),
      line(
        'SOS Voz Amiga',
        [
          phone('tel:+351213544545', '213 544 545'),
          phone('tel:+351912802669', '912 802 669'),
          phone('tel:+351963524660', '963 524 660'),
          phone('tel:+351930712500', '930 712 500'),
        ],
        t(
          'Emotional support and suicide prevention, every day from 15:30 to 00:30. Not a 24-hour line.',
          'Soutien émotionnel et prévention du suicide, tous les jours de 15 h 30 à 00 h 30. Pas une ligne 24 h/24.',
          'Apoyo emocional y prevención del suicidio, todos los días de 15:30 a 00:30. No es una línea de 24 horas.',
          'Apoio emocional e prevenção do suicídio, todos os dias das 15h30 à 00h30. Não é uma linha 24 horas.',
        ),
        'https://www.sosvozamiga.org/contactos',
        'SOS Voz Amiga',
      ),
    ],
  },
  {
    iso: 'ES',
    name: t('Spain', 'Espagne', 'España', 'Espanha'),
    emergencyContacts: [phone('tel:112', '112')],
    services: [
      line(
        'Línea 024',
        [phone('tel:024', '024')],
        t('24 hours, every day.', '24 h/24, tous les jours.', 'Las 24 horas, todos los días.', '24 horas, todos os dias.'),
        'https://www.sanidad.gob.es/linea024/',
        'Línea de atención a la conducta suicida',
      ),
    ],
  },
  {
    iso: 'FR',
    name: t('France', 'France', 'Francia', 'França'),
    emergencyContacts: [phone('tel:112', '112'), phone('tel:15', '15')],
    services: [
      line(
        '3114',
        [phone('tel:3114', '3114')],
        t('National suicide prevention number, 24 hours.', 'Numéro national de prévention du suicide, 24 h/24.', 'Número nacional de prevención del suicidio, las 24 horas.', 'Número nacional de prevenção do suicídio, 24 horas.'),
        'https://3114.fr/',
        '3114.fr',
      ),
    ],
  },
  {
    iso: 'BE',
    name: t('Belgium', 'Belgique', 'Bélgica', 'Bélgica'),
    emergencyContacts: [phone('tel:112', '112')],
    services: [
      line(
        'Centre de Prévention du Suicide',
        [phone('tel:080032123', '0800 32 123')],
        t(
          'French-speaking Belgium. Anonymous and free, 24 hours.',
          'Belgique francophone. Anonyme et gratuit, 24 h/24.',
          'Bélgica francófona. Anónimo y gratis, las 24 horas.',
          'Bélgica francófona. Anônimo e grátis, 24 horas.',
        ),
        'https://www.preventionsuicide.be/la-ligne-decoute-0800-32-123',
        'Centre de prévention du suicide',
      ),
      line(
        'Zelfmoordlijn 1813',
        [phone('tel:1813', '1813')],
        t(
          'Dutch-speaking Belgium. The phone line is free, 24 hours. Chat is daily from 17:00 to midnight, and Wednesday from 12:00 to midnight.',
          'Belgique néerlandophone. Le téléphone est gratuit, 24 h/24. Le clavardage est tous les jours de 17 h à minuit, et le mercredi de 12 h à minuit.',
          'Bélgica neerlandófona. El teléfono es gratis, las 24 horas. El chat es todos los días de 17:00 a medianoche, y el miércoles de 12:00 a medianoche.',
          'Bélgica neerlandófona. O telefone é grátis, 24 horas. O chat é todos os dias das 17:00 à meia-noite, e quarta das 12:00 à meia-noite.',
        ),
        'https://www.zelfmoord1813.be/',
        'Zelfmoordlijn 1813',
      ),
    ],
  },
  {
    iso: 'CH',
    name: t('Switzerland', 'Suisse', 'Suiza', 'Suíça'),
    emergencyContacts: [phone('tel:144', '144'), phone('tel:112', '112')],
    services: [
      line(
        'La Main Tendue',
        [phone('tel:143', '143')],
        t('24 hours.', '24 h/24.', 'Las 24 horas.', '24 horas.'),
        'https://www.143.ch/fr/',
        '143.ch',
      ),
      line(
        '147',
        [phone('tel:147', '147')],
        t(
          'For children and young people. 24 hours.',
          'Pour les enfants et les jeunes. 24 h/24.',
          'Para niños y jóvenes. Las 24 horas.',
          'Para crianças e jovens. 24 horas.',
        ),
        'https://www.147.ch/',
        '147.ch',
      ),
    ],
  },
  {
    iso: 'GB',
    name: t('United Kingdom', 'Royaume-Uni', 'Reino Unido', 'Reino Unido'),
    emergencyContacts: [phone('tel:999', '999'), phone('tel:112', '112')],
    services: [
      line(
        'Samaritans',
        [phone('tel:116123', '116 123')],
        t('Free, any time.', 'Gratuit, en tout temps.', 'Gratis, a cualquier hora.', 'Grátis, a qualquer hora.'),
        'https://www.samaritans.org/how-we-can-help/contact-samaritan/talk-us-phone/',
        'Samaritans',
      ),
      line(
        'Shout',
        [phone('sms:85258?body=SHOUT', 'text SHOUT to 85258')],
        t('Text only. Free, 24 hours.', 'Par texto seulement. Gratuit, 24 h/24.', 'Solo texto. Gratis, las 24 horas.', 'Só texto. Grátis, 24 horas.'),
        'https://giveusashout.org/',
        'Shout',
      ),
    ],
  },
  {
    iso: 'IE',
    name: t('Ireland', 'Irlande', 'Irlanda', 'Irlanda'),
    emergencyContacts: [phone('tel:112', '112'), phone('tel:999', '999')],
    services: [
      line(
        'Samaritans',
        [phone('tel:116123', '116 123')],
        t('Free, any time.', 'Gratuit, en tout temps.', 'Gratis, a cualquier hora.', 'Grátis, a qualquer hora.'),
        'https://www.samaritans.org/ireland/',
        'Samaritans Ireland',
      ),
      line(
        'Pieta',
        [phone('tel:1800247247', '1800 247 247'), phone('sms:51444?body=HELP', 'text HELP to 51444')],
        t('Free, 24 hours.', 'Gratuit, 24 h/24.', 'Gratis, las 24 horas.', 'Grátis, 24 horas.'),
        'https://www.pieta.ie/how-we-can-help/helpline/',
        'Pieta',
      ),
      line(
        'Text About It',
        [phone('sms:50808?body=TALK', 'text TALK to 50808')],
        t('Text only. Free, 24 hours.', 'Par texto seulement. Gratuit, 24 h/24.', 'Solo texto. Gratis, las 24 horas.', 'Só texto. Grátis, 24 horas.'),
        'https://www.textaboutit.ie/',
        'Text About It',
      ),
    ],
  },
  {
    iso: 'DE',
    name: t('Germany', 'Allemagne', 'Alemania', 'Alemanha'),
    emergencyContacts: [phone('tel:112', '112')],
    services: [
      line(
        'TelefonSeelsorge',
        [phone('tel:08001110111', '0800 111 0 111'), phone('tel:08001110222', '0800 111 0 222'), phone('tel:116123', '116 123')],
        t('Free, day and night.', 'Gratuit, jour et nuit.', 'Gratis, de día y de noche.', 'Grátis, dia e noite.'),
        'https://www.telefonseelsorge.de/',
        'TelefonSeelsorge',
      ),
    ],
  },
  {
    iso: 'AT',
    name: t('Austria', 'Autriche', 'Austria', 'Áustria'),
    emergencyContacts: [phone('tel:112', '112'), phone('tel:144', '144')],
    services: [
      line(
        'TelefonSeelsorge',
        [phone('tel:142', '142')],
        t('Free, 24 hours, every day.', 'Gratuit, 24 h/24, tous les jours.', 'Gratis, las 24 horas, todos los días.', 'Grátis, 24 horas, todos os dias.'),
        'https://www.telefonseelsorge.at/',
        'TelefonSeelsorge Österreich',
      ),
    ],
  },
  {
    iso: 'IT',
    name: t('Italy', 'Italie', 'Italia', 'Itália'),
    emergencyContacts: [phone('tel:112', '112')],
    services: [
      line(
        'Telefono Amico Italia',
        [phone('tel:+390223272327', '02 2327 2327'), phone('https://wa.me/393240117252', 'WhatsApp 324 011 7252')],
        t(
          'The phone line answers every day, 24 hours, at normal call rates. It is not a free number. WhatsApp is daily from 18:00 to 21:00 only.',
          'La ligne téléphonique répond tous les jours, 24 h/24, au tarif d’un appel normal. Ce n’est pas un numéro gratuit. Le WhatsApp est seulement de 18 h à 21 h, tous les jours.',
          'El teléfono responde todos los días, las 24 horas, con tarifa normal. No es un número gratuito. El WhatsApp es solo de 18:00 a 21:00, todos los días.',
          'O telefone atende todos os dias, 24 horas, com tarifa normal. Não é um número gratuito. O WhatsApp é só das 18:00 às 21:00, todos os dias.',
        ),
        'https://www.telefonoamico.it/',
        'Telefono Amico',
      ),
    ],
  },
  {
    iso: 'NL',
    name: t('Netherlands', 'Pays-Bas', 'Países Bajos', 'Países Baixos'),
    emergencyContacts: [phone('tel:112', '112')],
    services: [
      line(
        '113 Zelfmoordpreventie',
        [phone('tel:113', '113'), phone('tel:08000113', '0800-0113')],
        t(
          '0800-0113 is free. 24 hours. Chat is on 113.nl.',
          'Le 0800-0113 est gratuit. 24 h/24. Le clavardage est sur 113.nl.',
          '0800-0113 es gratis. Las 24 horas. El chat está en 113.nl.',
          '0800-0113 é grátis. 24 horas. O chat está em 113.nl.',
        ),
        'https://www.113.nl/',
        '113',
      ),
    ],
  },
  {
    iso: 'NO',
    name: t('Norway', 'Norvège', 'Noruega', 'Noruega'),
    emergencyContacts: [phone('tel:113', '113'), phone('tel:112', '112')],
    services: [
      line(
        'Mental Helse Hjelpetelefonen',
        [phone('tel:116123', '116 123')],
        t('Open 24 hours, all year.', 'Ouvert 24 h/24, toute l’année.', 'Abierto las 24 horas, todo el año.', 'Aberto 24 horas, o ano todo.'),
        'https://mentalhelse.no/fa-hjelp/hjelpetelefonen/',
        'Mental Helse',
      ),
    ],
  },
  {
    iso: 'FI',
    name: t('Finland', 'Finlande', 'Finlandia', 'Finlândia'),
    emergencyContacts: [phone('tel:112', '112')],
    services: [
      line(
        'MIELI Kriisipuhelin',
        [phone('tel:+358925250111', '09 2525 0111')],
        t('24 hours, every day.', '24 h/24, tous les jours.', 'Las 24 horas, todos los días.', '24 horas, todos os dias.'),
        'https://mieli.fi/tukea-ja-apua/kriisipuhelin/',
        'MIELI',
      ),
    ],
  },
  {
    iso: 'DK',
    name: t('Denmark', 'Danemark', 'Dinamarca', 'Dinamarca'),
    emergencyContacts: [phone('tel:112', '112')],
    services: [
      line(
        'Livslinien',
        [phone('tel:70201201', '70 201 201')],
        t(
          'Every day from 09:00 to 05:00. Not a 24-hour line. Chat hours are shorter.',
          'Tous les jours de 9 h à 5 h. Pas une ligne 24 h/24. Le clavardage a des horaires plus courts.',
          'Todos los días de 09:00 a 05:00. No es una línea de 24 horas. El chat tiene un horario más corto.',
          'Todos os dias das 09:00 às 05:00. Não é uma linha 24 horas. O chat tem horário mais curto.',
        ),
        'https://www.livslinien.dk/',
        'Livslinien',
      ),
    ],
  },
  {
    iso: 'TR',
    name: t('Turkey', 'Turquie', 'Turquía', 'Turquia'),
    emergencyOnly: true,
    emergencyContacts: [phone('tel:112', '112')],
    detail: t(
      'No dedicated crisis line is listed here.',
      'Aucune ligne de crise dédiée n’est indiquée ici.',
      'Aquí no hay una línea de crisis dedicada.',
      'Nenhuma linha de crise dedicada está listada aqui.',
    ),
  },
  {
    iso: 'IN',
    name: t('India', 'Inde', 'India', 'Índia'),
    emergencyContacts: [phone('tel:112', '112')],
    services: [
      line(
        'Tele MANAS',
        [phone('tel:14416', '14416'), phone('tel:18008914416', '1-800-891-4416')],
        t(
          'Toll-free, 24 hours, in many Indian languages.',
          'Sans frais, 24 h/24, dans de nombreuses langues de l’Inde.',
          'Gratuito, las 24 horas, en muchos idiomas de la India.',
          'Gratuito, 24 horas, em muitos idiomas da Índia.',
        ),
        'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2022057&lang=2&reg=3',
        'Press Information Bureau',
      ),
    ],
  },
  {
    iso: 'PH',
    name: t('Philippines', 'Philippines', 'Filipinas', 'Filipinas'),
    emergencyContacts: [phone('tel:911', '911')],
    services: [
      line(
        'NCMH Crisis Hotline',
        [phone('tel:1553', '1553'), phone('tel:09190571553', '0919 057 1553')],
        t(
          '24 hours. A July 2026 advisory lists these two numbers.',
          '24 h/24. Un avis de juillet 2026 indique ces deux numéros.',
          'Las 24 horas. Un aviso de julio de 2026 indica estos dos números.',
          '24 horas. Um aviso de julho de 2026 indica estes dois números.',
        ),
        'https://www.facebook.com/ncmhcrisishotline/posts/1446226184192317/',
        'NCMH',
      ),
    ],
  },
  {
    iso: 'ID',
    name: t('Indonesia', 'Indonésie', 'Indonesia', 'Indonésia'),
    emergencyContacts: [phone('tel:112', '112'), phone('tel:119', '119')],
    services: [
      line(
        'Healing119',
        [phone('tel:119', '119')],
        t(
          'Then extension 8. The service page does not state the hours. It says to call for a suicidal emergency.',
          'Puis le poste 8. La page du service n’indique pas les horaires. Elle dit d’appeler pour une urgence suicidaire.',
          'Luego la extensión 8. La página del servicio no indica el horario. Dice que llames ante una emergencia suicida.',
          'Depois o ramal 8. A página do serviço não informa o horário. Ela pede para ligar numa emergência suicida.',
        ),
        'https://www.healing119.id/',
        'Healing119',
      ),
    ],
  },
  {
    iso: 'JP',
    name: t('Japan', 'Japon', 'Japón', 'Japão'),
    emergencyContacts: [phone('tel:119', '119'), phone('tel:110', '110')],
    services: [
      line(
        'Inochi SOS',
        [phone('tel:0120061338', '0120-061-338')],
        t('Free, 24 hours, every day.', 'Gratuit, 24 h/24, tous les jours.', 'Gratis, las 24 horas, todos los días.', 'Grátis, 24 horas, todos os dias.'),
        'https://www.mhlw.go.jp/mamorouyokokoro/',
        'Ministry of Health, Labour and Welfare',
      ),
      line(
        'Yorisoi Hotline',
        [phone('tel:0120279338', '0120-279-338'), phone('tel:0120279226', '0120-279-226')],
        t(
          'Free, 24 hours. From Fukushima, use 0120-279-226.',
          'Gratuit, 24 h/24. Depuis Fukushima, utilisez le 0120-279-226.',
          'Gratis, las 24 horas. Desde Fukushima, usa el 0120-279-226.',
          'Grátis, 24 horas. De Fukushima, use 0120-279-226.',
        ),
        'https://www.mhlw.go.jp/mamorouyokokoro/',
        'Ministry of Health, Labour and Welfare',
      ),
      line(
        'TELL Lifeline',
        [phone('tel:08003008355', '0800-300-8355')],
        t(
          'English. Hours are limited. Check the site for the current times. Not a 24-hour line.',
          'Anglais. Les horaires sont limités. Vérifiez le site pour les heures actuelles. Pas une ligne 24 h/24.',
          'Inglés. El horario es limitado. Revisa el sitio para las horas actuales. No es una línea de 24 horas.',
          'Inglês. O horário é limitado. Confira o site para os horários atuais. Não é uma linha 24 horas.',
        ),
        'https://telljp.com/lifeline/',
        'TELL',
      ),
    ],
  },
  {
    iso: 'KR',
    name: t('South Korea', 'Corée du Sud', 'Corea del Sur', 'Coreia do Sul'),
    emergencyContacts: [phone('tel:119', '119'), phone('tel:112', '112')],
    services: [
      line(
        '109',
        [phone('tel:109', '109')],
        t(
          'Suicide prevention counselling, 24 hours.',
          'Conseil de prévention du suicide, 24 h/24.',
          'Consejería de prevención del suicidio, las 24 horas.',
          'Aconselhamento de prevenção do suicídio, 24 horas.',
        ),
        'https://www.129.go.kr/109',
        '129.go.kr',
      ),
      line(
        'Lifeline Korea',
        [phone('tel:15889191', '1588-9191')],
        t('24 hours.', '24 h/24.', 'Las 24 horas.', '24 horas.'),
        'https://www.129.go.kr/109',
        '129.go.kr',
      ),
    ],
  },
  {
    iso: 'MY',
    name: t('Malaysia', 'Malaisie', 'Malasia', 'Malásia'),
    emergencyContacts: [phone('tel:999', '999')],
    services: [
      line(
        'Befrienders Kuala Lumpur',
        [phone('tel:+60376272929', '03-7627 2929')],
        t('24 hours.', '24 h/24.', 'Las 24 horas.', '24 horas.'),
        'https://befrienders.org.my/',
        'Befrienders',
      ),
    ],
  },
  {
    iso: 'TH',
    name: t('Thailand', 'Thaïlande', 'Tailandia', 'Tailândia'),
    emergencyContacts: [phone('tel:1669', '1669'), phone('tel:191', '191')],
    services: [
      line(
        'Department of Mental Health',
        [phone('tel:1323', '1323')],
        t('Free, 24 hours.', 'Gratuit, 24 h/24.', 'Gratis, las 24 horas.', 'Grátis, 24 horas.'),
        'https://dmh.go.th/',
        'Department of Mental Health',
      ),
    ],
  },
  {
    iso: 'IL',
    name: t('Israel', 'Israël', 'Israel', 'Israel'),
    emergencyContacts: [phone('tel:101', '101')],
    services: [
      line(
        'ERAN',
        [phone('tel:1201', '1201')],
        t(
          'Hours were not stated on the page read for this update, so this list does not call it a 24-hour line.',
          'Les horaires n’étaient pas indiqués sur la page lue pour cette mise à jour. Cette liste ne la présente donc pas comme une ligne 24 h/24.',
          'El horario no figuraba en la página leída para esta actualización. Esta lista no la presenta como una línea de 24 horas.',
          'O horário não estava na página lida para esta atualização. Esta lista não a apresenta como uma linha 24 horas.',
        ),
        'https://www.eran.org.il/',
        'ERAN',
      ),
    ],
  },
  {
    iso: 'AE',
    name: t('United Arab Emirates', 'Émirats arabes unis', 'Emiratos Árabes Unidos', 'Emirados Árabes Unidos'),
    emergencyContacts: [phone('tel:999', '999'), phone('tel:998', '998')],
    services: [
      line(
        '800 HOPE',
        [phone('tel:8004673', '800 4673')],
        t(
          'Every day from 08:00 to 20:00. Not a 24-hour line. WhatsApp uses the same number.',
          'Tous les jours de 8 h à 20 h. Pas une ligne 24 h/24. Le WhatsApp utilise le même numéro.',
          'Todos los días de 08:00 a 20:00. No es una línea de 24 horas. El WhatsApp usa el mismo número.',
          'Todos os dias das 08:00 às 20:00. Não é uma linha 24 horas. O WhatsApp usa o mesmo número.',
        ),
        'https://u.ae/en/information-and-services/health-and-fitness/FAQs-and-resources/handling-the-covid-19-outbreak/maintaining-mental-health-in-times-of-covid19',
        'u.ae',
      ),
    ],
  },
  {
    iso: 'AU',
    name: t('Australia', 'Australie', 'Australia', 'Austrália'),
    emergencyContacts: [phone('tel:000', '000')],
    services: [
      line(
        'Lifeline',
        [phone('tel:131114', '13 11 14')],
        t('24 hours.', '24 h/24.', 'Las 24 horas.', '24 horas.'),
        'https://www.lifeline.org.au/131114',
        'Lifeline',
      ),
    ],
  },
  {
    iso: 'NZ',
    name: t('New Zealand', 'Nouvelle-Zélande', 'Nueva Zelanda', 'Nova Zelândia'),
    emergencyContacts: [phone('tel:111', '111')],
    services: [
      line(
        '1737, Need to talk?',
        [phone('tel:080017371737', '0800 1737 1737'), phone('sms:1737', 'text 1737')],
        t('Call or text, free, any time.', 'Appelez ou textez, gratuit, en tout temps.', 'Llama o envía un texto, gratis, a cualquier hora.', 'Ligue ou envie uma mensagem, grátis, a qualquer hora.'),
        'https://1737.org.nz/',
        '1737, Need to talk?',
      ),
    ],
  },
  {
    iso: 'ZA',
    name: t('South Africa', 'Afrique du Sud', 'Sudáfrica', 'África do Sul'),
    emergencyContacts: [phone('tel:10111', '10111'), phone('tel:10177', '10177'), phone('tel:112', '112')],
    services: [
      line(
        'SADAG',
        [phone('tel:0800567567', '0800 567 567')],
        t('Suicide crisis line. Toll-free, 24 hours.', 'Ligne de crise suicidaire. Sans frais, 24 h/24.', 'Línea de crisis suicida. Gratuita, las 24 horas.', 'Linha de crise suicida. Gratuita, 24 horas.'),
        'https://www.sadag.org/',
        'SADAG',
      ),
    ],
  },
  {
    iso: 'NG',
    name: t('Nigeria', 'Nigeria', 'Nigeria', 'Nigéria'),
    emergencyContacts: [phone('tel:112', '112')],
    services: [
      line(
        'SURPIN',
        [
          phone('tel:08000787746', '0800 078 7746'),
          phone('tel:09080217555', '0908 021 7555'),
          phone('tel:09034400009', '0903 440 0009'),
          phone('tel:08142241007', '0814 224 1007'),
        ],
        t(
          'The 0800 number is toll-free. 24 hours. This is an NGO line.',
          'Le numéro 0800 est sans frais. 24 h/24. C’est une ligne d’ONG.',
          'El número 0800 es gratuito. Las 24 horas. Es una línea de una ONG.',
          'O número 0800 é gratuito. 24 horas. É uma linha de uma ONG.',
        ),
        'https://www.surpinng.com/',
        'SURPIN',
      ),
    ],
  },
  {
    iso: 'MA',
    name: t('Morocco', 'Maroc', 'Marruecos', 'Marrocos'),
    emergencyOnly: true,
    emergencyContacts: [phone('tel:141', '141'), phone('tel:15', '15'), phone('tel:19', '19'), phone('tel:112', '112')],
    detail: t(
      'No dedicated crisis line is listed here.',
      'Aucune ligne de crise dédiée n’est indiquée ici.',
      'Aquí no hay una línea de crisis dedicada.',
      'Nenhuma linha de crise dedicada está listada aqui.',
    ),
  },
  {
    iso: 'CI',
    name: t('Côte d’Ivoire', 'Côte d’Ivoire', 'Costa de Marfil', 'Costa do Marfim'),
    emergencyContacts: [phone('tel:185', '185'), phone('tel:110', '110')],
    services: [
      line(
        'Programme national de santé mentale',
        [phone('tel:143', '143')],
        t(
          'Free. Monday to Friday, 08:00 to 17:00. Not a 24-hour line.',
          'Gratuit. Du lundi au vendredi, de 8 h à 17 h. Pas une ligne 24 h/24.',
          'Gratis. De lunes a viernes, de 8:00 a 17:00. No es una línea de 24 horas.',
          'Grátis. De segunda a sexta, das 8:00 às 17:00. Não é uma linha 24 horas.',
        ),
        'https://www.pnsantementale.ci/projets/dispositif-143-assistance-psychologique',
        'Programme national de santé mentale',
      ),
    ],
  },
];

applyHelplineLocales(COUNTRIES);

const ZONE_PREFIXES = [
  ['America/Argentina', 'AR'],
  ['America/Buenos_Aires', 'AR'],
  ['America/Cordoba', 'AR'],
  ['America/Mendoza', 'AR'],
  ['America/Toronto', 'CA'],
  ['America/Vancouver', 'CA'],
  ['America/Winnipeg', 'CA'],
  ['America/Edmonton', 'CA'],
  ['America/Halifax', 'CA'],
  ['America/St_Johns', 'CA'],
  ['America/Regina', 'CA'],
  ['America/Whitehorse', 'CA'],
  ['America/Iqaluit', 'CA'],
  ['America/Moncton', 'CA'],
  ['America/Glace_Bay', 'CA'],
  ['America/Goose_Bay', 'CA'],
  ['America/Swift_Current', 'CA'],
  ['America/Rainy_River', 'CA'],
  ['America/Resolute', 'CA'],
  ['America/Rankin_Inlet', 'CA'],
  ['America/Atikokan', 'CA'],
  ['America/Blanc-Sablon', 'CA'],
  ['America/Creston', 'CA'],
  ['America/Dawson', 'CA'],
  ['America/Fort_Nelson', 'CA'],
  ['America/Inuvik', 'CA'],
  ['America/Pangnirtung', 'CA'],
  ['America/Yellowknife', 'CA'],
  ['America/Cambridge_Bay', 'CA'],
  ['America/Thunder_Bay', 'CA'],
  ['America/Indiana', 'US'],
  ['America/Kentucky', 'US'],
  ['America/North_Dakota', 'US'],
  ['America/New_York', 'US'],
  ['America/Chicago', 'US'],
  ['America/Denver', 'US'],
  ['America/Los_Angeles', 'US'],
  ['America/Phoenix', 'US'],
  ['America/Anchorage', 'US'],
  ['America/Detroit', 'US'],
  ['America/Boise', 'US'],
  ['America/Juneau', 'US'],
  ['America/Nome', 'US'],
  ['America/Sitka', 'US'],
  ['America/Adak', 'US'],
  ['America/Menominee', 'US'],
  ['Pacific/Honolulu', 'US'],
  ['America/Mexico_', 'MX'],
  ['America/Cancun', 'MX'],
  ['America/Merida', 'MX'],
  ['America/Monterrey', 'MX'],
  ['America/Mazatlan', 'MX'],
  ['America/Tijuana', 'MX'],
  ['America/Hermosillo', 'MX'],
  ['America/Chihuahua', 'MX'],
  ['America/Bahia_Banderas', 'MX'],
  ['America/Matamoros', 'MX'],
  ['America/Ojinaga', 'MX'],
  ['America/Ciudad_Juarez', 'MX'],
  ['America/Bogota', 'CO'],
  ['America/Lima', 'PE'],
  ['America/Santiago', 'CL'],
  ['America/Punta_Arenas', 'CL'],
  ['Pacific/Easter', 'CL'],
  ['America/Montevideo', 'UY'],
  ['America/Guayaquil', 'EC'],
  ['Pacific/Galapagos', 'EC'],
  ['America/Costa_Rica', 'CR'],
  ['America/Santo_Domingo', 'DO'],
  ['America/Sao_Paulo', 'BR'],
  ['America/Bahia', 'BR'],
  ['America/Belem', 'BR'],
  ['America/Fortaleza', 'BR'],
  ['America/Manaus', 'BR'],
  ['America/Recife', 'BR'],
  ['America/Noronha', 'BR'],
  ['America/Araguaina', 'BR'],
  ['America/Campo_Grande', 'BR'],
  ['America/Cuiaba', 'BR'],
  ['America/Maceio', 'BR'],
  ['America/Porto_Velho', 'BR'],
  ['America/Rio_Branco', 'BR'],
  ['America/Santarem', 'BR'],
  ['Europe/Lisbon', 'PT'],
  ['Atlantic/Madeira', 'PT'],
  ['Atlantic/Azores', 'PT'],
  ['Europe/Madrid', 'ES'],
  ['Africa/Ceuta', 'ES'],
  ['Atlantic/Canary', 'ES'],
  ['Europe/Paris', 'FR'],
  ['Europe/Brussels', 'BE'],
  ['Europe/Zurich', 'CH'],
  ['Europe/London', 'GB'],
  ['Europe/Dublin', 'IE'],
  ['Europe/Berlin', 'DE'],
  ['Europe/Busingen', 'DE'],
  ['Europe/Vienna', 'AT'],
  ['Europe/Rome', 'IT'],
  ['Europe/Amsterdam', 'NL'],
  ['Europe/Oslo', 'NO'],
  ['Europe/Helsinki', 'FI'],
  ['Europe/Copenhagen', 'DK'],
  ['Europe/Istanbul', 'TR'],
  ['Asia/Kolkata', 'IN'],
  ['Asia/Calcutta', 'IN'],
  ['Asia/Manila', 'PH'],
  ['Asia/Jakarta', 'ID'],
  ['Asia/Pontianak', 'ID'],
  ['Asia/Makassar', 'ID'],
  ['Asia/Jayapura', 'ID'],
  ['Asia/Tokyo', 'JP'],
  ['Asia/Seoul', 'KR'],
  ['Asia/Kuala_Lumpur', 'MY'],
  ['Asia/Kuching', 'MY'],
  ['Asia/Bangkok', 'TH'],
  ['Asia/Jerusalem', 'IL'],
  ['Asia/Tel_Aviv', 'IL'],
  ['Asia/Dubai', 'AE'],
  ['Australia/', 'AU'],
  ['Pacific/Auckland', 'NZ'],
  ['Pacific/Chatham', 'NZ'],
  ['Africa/Johannesburg', 'ZA'],
  ['Africa/Lagos', 'NG'],
  ['Africa/Casablanca', 'MA'],
  ['Africa/Abidjan', 'CI'],
];

export function suggestCountry(languages, timeZone, isos) {
  const known = new Set(isos);
  const list = Array.isArray(languages) ? languages : [languages || ''];
  for (const tag of list) {
    const match = String(tag).match(/[-_]([A-Za-z]{2})\b/);
    if (!match) continue;
    let iso = match[1].toUpperCase();
    if (iso === 'UK') iso = 'GB';
    if (known.has(iso)) return iso;
  }
  const tz = String(timeZone || '');
  for (const [prefix, iso] of ZONE_PREFIXES) {
    if (tz.startsWith(prefix) && known.has(iso)) return iso;
  }
  return '';
}

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function link(href, label) {
  const external = href.startsWith('https://');
  return `<a href="${esc(href)}"${external ? ' rel="noopener noreferrer"' : ''}>${esc(label)}</a>`;
}

function textOf(pack, lang) {
  if (!pack) return '';
  const value = pack[lang];
  if (value != null && value !== '') return value;
  return pack.en ?? '';
}

function uiOf(lang) {
  return HELP_UI[lang] || HELP_UI.en;
}

function joinLinks(lang, contacts) {
  const body = contacts.map((item) => link(item.href, item.label));
  if (body.length === 1) return body[0];
  if (lang === 'ja') return body.join('、');
  const or = { en: 'or', fr: 'ou', es: 'o', pt: 'ou', de: 'oder', it: 'o', nl: 'of', ko: '또는', hi: 'या' }[lang] || 'or';
  const and = { en: 'and', fr: 'et', es: 'y', pt: 'e', de: 'und', it: 'e', nl: 'en', ko: '그리고', hi: 'और' }[lang] || 'and';
  const word = contacts.length >= 3 ? and : or;
  const last = body.pop();
  return `${body.join(', ')} ${word} ${last}`;
}

function segments(parts) {
  return parts.map((part) => (part.href ? link(part.href, part.label) : esc(part.text))).join('');
}

function serviceHtml(lang, service) {
  const ui = uiOf(lang);
  let body;
  if (service.parts) body = segments(service.parts[lang] || service.parts.en);
  else {
    const source = link(service.source, service.sourceLabel);
    body = `${esc(service.name)}: ${joinLinks(lang, service.contacts)}. ${esc(textOf(service.detail, lang))} (${source}).`;
  }
  if (service.verified === false) body += ` <span class="help-flag">${esc(ui.unverified)}</span>`;
  return body;
}

function emergencyHtml(lang, country) {
  return joinLinks(lang, country.emergencyContacts);
}

function countrySection(lang, country) {
  const ui = uiOf(lang);
  const lines = country.emergencyOnly
    ? `<p>${esc(textOf(country.detail, lang))}</p>`
    : `<ul>${country.services.map((service) => `<li>${serviceHtml(lang, service)}</li>`).join('')}</ul>`;
  return `<section class="help-country" data-iso="${esc(country.iso)}">
        <h3>${esc(textOf(country.name, lang))}</h3>
        ${lines}
        <p class="help-emergency"><span>${esc(ui.emergency)}</span> ${emergencyHtml(lang, country)}</p>
      </section>`;
}

function countryInline(lang, country) {
  const ui = uiOf(lang);
  const body = country.emergencyOnly
    ? esc(textOf(country.detail, lang))
    : country.services.map((service) => serviceHtml(lang, service)).join(' ');
  return `<strong>${esc(textOf(country.name, lang))}.</strong> ${body} ${esc(ui.emergency)}: ${emergencyHtml(lang, country)}.`;
}

export function helpDialogHtml(lang) {
  const ui = uiOf(lang);
  const group = HELP_GROUPS[lang] || null;
  const emptyLabel = group ? (ui.suggested || ui.choose) : ui.choose;
  const allOption = group ? `\n            <option value="*">${esc(ui.all || ui.choose)}</option>` : '';
  const defaults = group ? ` data-help-default="${esc(group.join(' '))}"` : '';
  const options = COUNTRIES.map((country) => `<option value="${esc(country.iso)}">${esc(textOf(country.name, lang))}</option>`).join('\n            ');
  const sections = COUNTRIES.map((country) => countrySection(lang, country)).join('\n        ');
  return `<dialog id="help-dialog" class="help-dialog" aria-labelledby="help-title"${defaults}>
    <div class="help-panel">
      <div class="help-head">
        <h2 id="help-title">${esc(ui.title)}</h2>
        <button type="button" class="help-close" id="help-close" aria-label="${esc(ui.close)}"><span aria-hidden="true">×</span></button>
      </div>
      <p class="help-lead">${esc(ui.lead)}</p>
      <label class="help-pick">
        <span>${esc(ui.country)}</span>
        <select id="help-country" name="country">
          <option value="">${esc(emptyLabel)}</option>${allOption}
          ${options}
        </select>
      </label>
      <div class="help-list" id="help-list">
        ${sections}
      </div>
      <p class="help-else">${esc(ui.somewhere)} <a href="https://findahelpline.com/" rel="noopener noreferrer">Find a Helpline</a> ${esc(ui.find)}</p>
    </div>
  </dialog>`;
}

export function helpButtonHtml(lang) {
  const ui = uiOf(lang);
  return `<button type="button" class="help-open" id="help-open" aria-haspopup="dialog" aria-controls="help-dialog" aria-label="${esc(ui.open)}">
        <span class="help-open-long">${esc(ui.open)}</span>
        <span class="help-open-short" aria-hidden="true">${esc(ui.short)}</span>
      </button>`;
}

export function othersListHtml(lang) {
  const ui = uiOf(lang);
  const items = COUNTRIES.map((country) => `<li>${countryInline(lang, country)}</li>`).join('\n          ');
  return `<details class="other-countries">
      <summary>${esc(ui.others)}</summary>
      <ul>
          ${items}
          <li>${esc(ui.somewhere)} <a href="https://findahelpline.com/" rel="noopener noreferrer">Find a Helpline</a> ${esc(ui.find)}</li>
      </ul>
    </details>`;
}
