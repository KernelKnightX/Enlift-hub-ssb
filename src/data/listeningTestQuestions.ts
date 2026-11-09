export type ListeningWordCategory =
  | 'nature'
  | 'objects'
  | 'places'
  | 'vehicles'
  | 'emotions'
  | 'actions';

export interface ListeningQuestion {
  id: string;
  category: ListeningWordCategory;
  audioWords: string[];
  options: string[];
  correctAnswers: string[];
}

export interface PreparedListeningQuestion extends ListeningQuestion {
  testQuestionId: string;
  shuffledOptions: string[];
}

export const LISTENING_TEST_TOTAL_QUESTIONS = 30;
export const LISTENING_TEST_SELECTION_SECONDS = 8;
export const LISTENING_TEST_REQUIRED_SELECTIONS = 4;

export const listeningTestQuestions: ListeningQuestion[] = [
  {
    id: 'listen-001',
    category: 'nature',
    audioWords: ['River', 'Pencil', 'Mountain', 'Bridge'],
    options: ['River', 'Chair', 'Pencil', 'Table', 'Mountain', 'Book', 'Bridge', 'Cloud', 'Road', 'Tree', 'Sun', 'Train'],
    correctAnswers: ['River', 'Pencil', 'Mountain', 'Bridge'],
  },
  {
    id: 'listen-002',
    category: 'objects',
    audioWords: ['Compass', 'Bottle', 'Notebook', 'Lantern'],
    options: ['Compass', 'Helmet', 'Bottle', 'Window', 'Notebook', 'Lantern', 'Rope', 'Medal', 'Signal', 'Canvas', 'Marker', 'Radio'],
    correctAnswers: ['Compass', 'Bottle', 'Notebook', 'Lantern'],
  },
  {
    id: 'listen-003',
    category: 'places',
    audioWords: ['Harbour', 'Valley', 'Outpost', 'Station'],
    options: ['Harbour', 'Canyon', 'Valley', 'Outpost', 'Airport', 'Station', 'Village', 'Tunnel', 'Market', 'Camp', 'Border', 'Bridge'],
    correctAnswers: ['Harbour', 'Valley', 'Outpost', 'Station'],
  },
  {
    id: 'listen-004',
    category: 'vehicles',
    audioWords: ['Jeep', 'Submarine', 'Glider', 'Truck'],
    options: ['Jeep', 'Bicycle', 'Submarine', 'Glider', 'Scooter', 'Truck', 'Cruiser', 'Cart', 'Metro', 'Tank', 'Raft', 'Bus'],
    correctAnswers: ['Jeep', 'Submarine', 'Glider', 'Truck'],
  },
  {
    id: 'listen-005',
    category: 'emotions',
    audioWords: ['Courage', 'Calm', 'Focus', 'Trust'],
    options: ['Courage', 'Fear', 'Calm', 'Focus', 'Doubt', 'Trust', 'Anger', 'Pride', 'Hope', 'Panic', 'Joy', 'Guilt'],
    correctAnswers: ['Courage', 'Calm', 'Focus', 'Trust'],
  },
  {
    id: 'listen-006',
    category: 'actions',
    audioWords: ['Climb', 'Signal', 'Observe', 'Report'],
    options: ['Climb', 'Signal', 'Carry', 'Observe', 'March', 'Report', 'Repair', 'Guard', 'Search', 'Lift', 'Cross', 'Follow'],
    correctAnswers: ['Climb', 'Signal', 'Observe', 'Report'],
  },
  {
    id: 'listen-007',
    category: 'nature',
    audioWords: ['Forest', 'Thunder', 'Pebble', 'Stream'],
    options: ['Forest', 'Thunder', 'Pebble', 'Stream', 'Desert', 'Branch', 'Flame', 'Snow', 'Island', 'Breeze', 'Stone', 'Flower'],
    correctAnswers: ['Forest', 'Thunder', 'Pebble', 'Stream'],
  },
  {
    id: 'listen-008',
    category: 'objects',
    audioWords: ['Medal', 'Rucksack', 'Whistle', 'Map'],
    options: ['Medal', 'Rucksack', 'Whistle', 'Map', 'Cup', 'Anchor', 'Cable', 'Tent', 'Torch', 'Badge', 'Plate', 'Camera'],
    correctAnswers: ['Medal', 'Rucksack', 'Whistle', 'Map'],
  },
  {
    id: 'listen-009',
    category: 'places',
    audioWords: ['Bunker', 'Academy', 'Ridge', 'Dock'],
    options: ['Bunker', 'Academy', 'Ridge', 'Dock', 'Port', 'Depot', 'Hill', 'Arena', 'Shelter', 'Fort', 'Base', 'Court'],
    correctAnswers: ['Bunker', 'Academy', 'Ridge', 'Dock'],
  },
  {
    id: 'listen-010',
    category: 'vehicles',
    audioWords: ['Fighter', 'Convoy', 'Frigate', 'Ambulance'],
    options: ['Fighter', 'Convoy', 'Frigate', 'Ambulance', 'Tractor', 'Carrier', 'Wagon', 'Rocket', 'Boat', 'Van', 'Train', 'Helicopter'],
    correctAnswers: ['Fighter', 'Convoy', 'Frigate', 'Ambulance'],
  },
];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function buildListeningTestQuestions(
  sourceQuestions: ListeningQuestion[] = listeningTestQuestions,
): PreparedListeningQuestion[] {
  const sourceBank = sourceQuestions.length > 0 ? sourceQuestions : listeningTestQuestions;
  const randomizedBank = shuffle(sourceBank);

  return Array.from({ length: LISTENING_TEST_TOTAL_QUESTIONS }, (_, index) => {
    const source = randomizedBank[index % randomizedBank.length];

    return {
      ...source,
      testQuestionId: `${source.id}-${index + 1}`,
      shuffledOptions: shuffle(source.options),
    };
  });
}
