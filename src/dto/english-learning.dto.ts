import { IsString, IsEnum, IsOptional, IsNotEmpty, IsArray, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// English Learning specific DTOs

export enum EnglishLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export enum ExerciseType {
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  READING = 'reading',
  WRITING = 'writing',
  MIXED = 'mixed'
}

export enum Topic {
  FAMILY = 'family',
  WORK = 'work',
  TRAVEL = 'travel',
  FOOD = 'food',
  WEATHER = 'weather',
  EDUCATION = 'education',
  HEALTH = 'health',
  ENVIRONMENT = 'environment',
  TECHNOLOGY = 'technology',
  CULTURE = 'culture'
}

export class ExerciseRequestDto {
  @ApiProperty({
    description: 'Type of exercise requested',
    enum: ExerciseType,
    example: ExerciseType.GRAMMAR
  })
  @IsEnum(ExerciseType)
  @IsNotEmpty()
  type: ExerciseType;

  @ApiProperty({
    description: 'English proficiency level',
    enum: EnglishLevel,
    example: EnglishLevel.B1
  })
  @IsEnum(EnglishLevel)
  @IsNotEmpty()
  level: EnglishLevel;

  @ApiPropertyOptional({
    description: 'Specific topic for the exercise',
    enum: Topic,
    example: Topic.WORK
  })
  @IsEnum(Topic)
  @IsOptional()
  topic?: Topic;

  @ApiPropertyOptional({
    description: 'Number of exercises to return',
    example: 5,
    minimum: 1,
    maximum: 20
  })
  @IsNumber()
  @Min(1)
  @Max(20)
  @IsOptional()
  count?: number;

  @ApiPropertyOptional({
    description: 'Additional context or requirements',
    example: 'Focus on present perfect tense'
  })
  @IsString()
  @IsOptional()
  context?: string;
}

export class ExerciseResponseDto {
  @ApiProperty({
    description: 'Whether the exercise request was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'List of exercises returned',
    type: 'array',
    items: {
      type: 'object'
    }
  })
  @IsArray()
  exercises: Exercise[];

  @ApiProperty({
    description: 'Total number of exercises found',
    example: 5
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: 'Exercise type requested',
    enum: ExerciseType,
    example: ExerciseType.GRAMMAR
  })
  @IsEnum(ExerciseType)
  type: ExerciseType;

  @ApiProperty({
    description: 'Difficulty level of exercises',
    enum: EnglishLevel,
    example: EnglishLevel.B1
  })
  @IsEnum(EnglishLevel)
  level: EnglishLevel;

  @ApiPropertyOptional({
    description: 'Topic of exercises if specified',
    enum: Topic,
    example: Topic.WORK
  })
  @IsEnum(Topic)
  @IsOptional()
  topic?: Topic;
}

export class Exercise {
  @ApiProperty({
    description: 'Unique identifier for the exercise',
    example: 'ex_001'
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Type of exercise',
    enum: ExerciseType,
    example: ExerciseType.GRAMMAR
  })
  @IsEnum(ExerciseType)
  type: ExerciseType;

  @ApiProperty({
    description: 'Difficulty level',
    enum: EnglishLevel,
    example: EnglishLevel.B1
  })
  @IsEnum(EnglishLevel)
  level: EnglishLevel;

  @ApiPropertyOptional({
    description: 'Topic of the exercise',
    enum: Topic,
    example: Topic.WORK
  })
  @IsEnum(Topic)
  @IsOptional()
  topic?: Topic;

  @ApiProperty({
    description: 'Question or instruction for the exercise',
    example: 'Choose the correct form of the verb in present perfect tense.'
  })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'Options for multiple choice questions',
    type: 'array',
    items: {
      type: 'string'
    },
    example: ['A) have gone', 'B) has gone', 'C) went', 'D) going']
  })
  @IsArray()
  @IsOptional()
  options?: string[];

  @ApiProperty({
    description: 'Correct answer',
    example: 'B) has gone'
  })
  @IsString()
  correctAnswer: string;

  @ApiProperty({
    description: 'Explanation of the correct answer',
    example: 'We use "has gone" with third person singular subjects (he, she, it) in present perfect tense.'
  })
  @IsString()
  explanation: string;

  @ApiPropertyOptional({
    description: 'Additional hints or tips',
    example: 'Remember: has + past participle for he/she/it, have + past participle for I/you/we/they'
  })
  @IsString()
  @IsOptional()
  hint?: string;

  @ApiPropertyOptional({
    description: 'Audio file URL for listening exercises',
    example: 'https://example.com/audio/exercise_001.mp3'
  })
  @IsString()
  @IsOptional()
  audioUrl?: string;

  @ApiPropertyOptional({
    description: 'Image URL for visual exercises',
    example: 'https://example.com/images/exercise_001.jpg'
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Estimated time to complete in minutes',
    example: 5
  })
  @IsNumber()
  estimatedTime: number;

  @ApiProperty({
    description: 'Points awarded for correct answer',
    example: 10
  })
  @IsNumber()
  points: number;
}

export class VocabularyRequestDto {
  @ApiProperty({
    description: 'Topic for vocabulary learning',
    enum: Topic,
    example: Topic.FAMILY
  })
  @IsEnum(Topic)
  @IsNotEmpty()
  topic: Topic;

  @ApiProperty({
    description: 'English proficiency level',
    enum: EnglishLevel,
    example: EnglishLevel.A2
  })
  @IsEnum(EnglishLevel)
  @IsNotEmpty()
  level: EnglishLevel;

  @ApiPropertyOptional({
    description: 'Number of vocabulary words to return',
    example: 10,
    minimum: 5,
    maximum: 50
  })
  @IsNumber()
  @Min(5)
  @Max(50)
  @IsOptional()
  count?: number;
}

export class VocabularyResponseDto {
  @ApiProperty({
    description: 'Whether the vocabulary request was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'List of vocabulary words',
    type: 'array',
    items: {
      type: 'object'
    }
  })
  @IsArray()
  vocabulary: VocabularyWord[];

  @ApiProperty({
    description: 'Total number of vocabulary words found',
    example: 10
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: 'Topic of vocabulary words',
    enum: Topic,
    example: Topic.FAMILY
  })
  @IsEnum(Topic)
  topic: Topic;

  @ApiProperty({
    description: 'Difficulty level of vocabulary words',
    enum: EnglishLevel,
    example: EnglishLevel.A2
  })
  @IsEnum(EnglishLevel)
  level: EnglishLevel;
}

export class VocabularyWord {
  @ApiProperty({
    description: 'The vocabulary word',
    example: 'mother'
  })
  @IsString()
  word: string;

  @ApiProperty({
    description: 'Definition of the word',
    example: 'A female parent'
  })
  @IsString()
  definition: string;

  @ApiProperty({
    description: 'Example sentence using the word',
    example: 'My mother is a teacher.'
  })
  @IsString()
  example: string;

  @ApiProperty({
    description: 'Pronunciation in IPA format',
    example: '/ˈmʌðər/'
  })
  @IsString()
  pronunciation: string;

  @ApiProperty({
    description: 'Part of speech',
    example: 'noun'
  })
  @IsString()
  partOfSpeech: string;

  @ApiPropertyOptional({
    description: 'Synonyms of the word',
    type: 'array',
    items: {
      type: 'string'
    },
    example: ['mom', 'mama', 'mum']
  })
  @IsArray()
  @IsOptional()
  synonyms?: string[];

  @ApiPropertyOptional({
    description: 'Audio file URL for pronunciation',
    example: 'https://example.com/audio/mother.mp3'
  })
  @IsString()
  @IsOptional()
  audioUrl?: string;
}

export class LearningPathRequestDto {
  @ApiProperty({
    description: 'Current English proficiency level',
    enum: EnglishLevel,
    example: EnglishLevel.A2
  })
  @IsEnum(EnglishLevel)
  @IsNotEmpty()
  currentLevel: EnglishLevel;

  @ApiProperty({
    description: 'Target English proficiency level',
    enum: EnglishLevel,
    example: EnglishLevel.B2
  })
  @IsEnum(EnglishLevel)
  @IsNotEmpty()
  targetLevel: EnglishLevel;

  @ApiPropertyOptional({
    description: 'Learning goals and preferences',
    example: 'Focus on business English and speaking skills'
  })
  @IsString()
  @IsOptional()
  goals?: string;

  @ApiPropertyOptional({
    description: 'Available study time per week in hours',
    example: 10,
    minimum: 1,
    maximum: 40
  })
  @IsNumber()
  @Min(1)
  @Max(40)
  @IsOptional()
  studyTimePerWeek?: number;
}

export class LearningPathResponseDto {
  @ApiProperty({
    description: 'Whether the learning path request was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Personalized learning path',
    type: 'array',
    items: {
      type: 'object'
    }
  })
  @IsArray()
  learningPath: LearningStep[];

  @ApiProperty({
    description: 'Estimated time to complete the learning path in weeks',
    example: 12
  })
  @IsNumber()
  estimatedDuration: number;

  @ApiProperty({
    description: 'Current proficiency level',
    enum: EnglishLevel,
    example: EnglishLevel.A2
  })
  @IsEnum(EnglishLevel)
  currentLevel: EnglishLevel;

  @ApiProperty({
    description: 'Target proficiency level',
    enum: EnglishLevel,
    example: EnglishLevel.B2
  })
  @IsEnum(EnglishLevel)
  targetLevel: EnglishLevel;
}

export class LearningStep {
  @ApiProperty({
    description: 'Step number in the learning path',
    example: 1
  })
  @IsNumber()
  stepNumber: number;

  @ApiProperty({
    description: 'Title of the learning step',
    example: 'Present Perfect Tense Basics'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of what will be learned',
    example: 'Learn the basic structure and usage of present perfect tense'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Type of learning activity',
    enum: ExerciseType,
    example: ExerciseType.GRAMMAR
  })
  @IsEnum(ExerciseType)
  type: ExerciseType;

  @ApiProperty({
    description: 'Difficulty level of this step',
    enum: EnglishLevel,
    example: EnglishLevel.A2
  })
  @IsEnum(EnglishLevel)
  level: EnglishLevel;

  @ApiProperty({
    description: 'Estimated time to complete this step in hours',
    example: 3
  })
  @IsNumber()
  estimatedTime: number;

  @ApiProperty({
    description: 'Resources and materials for this step',
    type: 'array',
    items: {
      type: 'string'
    },
    example: ['Grammar exercises', 'Video lessons', 'Practice tests']
  })
  @IsArray()
  resources: string[];

  @ApiProperty({
    description: 'Prerequisites for this step',
    type: 'array',
    items: {
      type: 'string'
    },
    example: ['Basic understanding of past tense', 'Knowledge of auxiliary verbs']
  })
  @IsArray()
  prerequisites: string[];
}

export class ProgressTrackingDto {
  @ApiProperty({
    description: 'User session ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({
    description: 'Exercise ID that was completed',
    example: 'ex_001'
  })
  @IsString()
  @IsNotEmpty()
  exerciseId: string;

  @ApiProperty({
    description: 'Whether the answer was correct',
    example: true
  })
  @IsString()
  @IsNotEmpty()
  isCorrect: boolean;

  @ApiProperty({
    description: 'Time taken to complete the exercise in seconds',
    example: 120
  })
  @IsNumber()
  @IsNotEmpty()
  timeTaken: number;

  @ApiPropertyOptional({
    description: 'User answer if applicable',
    example: 'B) has gone'
  })
  @IsString()
  @IsOptional()
  userAnswer?: string;
}

export class ProgressResponseDto {
  @ApiProperty({
    description: 'Whether the progress update was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Current proficiency level',
    enum: EnglishLevel,
    example: EnglishLevel.B1
  })
  @IsEnum(EnglishLevel)
  currentLevel: EnglishLevel;

  @ApiProperty({
    description: 'Overall progress percentage',
    example: 65
  })
  @IsNumber()
  progressPercentage: number;

  @ApiProperty({
    description: 'Total points earned',
    example: 1250
  })
  @IsNumber()
  totalPoints: number;

  @ApiProperty({
    description: 'Streak of consecutive correct answers',
    example: 5
  })
  @IsNumber()
  currentStreak: number;

  @ApiProperty({
    description: 'Skills that need improvement',
    type: 'array',
    example: [ExerciseType.GRAMMAR, ExerciseType.LISTENING]
  })
  @IsArray()
  skillsToImprove: ExerciseType[];

  @ApiProperty({
    description: 'Recommended next exercises',
    type: 'array',
    items: {
      type: 'object'
    }
  })
  @IsArray()
  recommendedExercises: Exercise[];
}

export class ExerciseExplanation {
  @ApiProperty({ example: 'What is the past simple of "go"?' })
  question: string;

  @ApiProperty({ example: 'went' })
  correctAnswer: string;

  @ApiProperty({ type: 'array', items: { type: 'string' }, example: ['go', 'goed', 'gone'] })
  wrongAnswers: string[];

  @ApiProperty({ example: 'The past simple of irregular verb "go" is "went".' })
  explanation: string;

  @ApiProperty({ example: 'Irregular verbs have unique past simple forms that must be memorized.' })
  grammarRule: string;

  @ApiProperty({ example: 'Think of "go" → "went" as a special pair to remember.' })
  memoryTip: string;

  @ApiProperty({ example: 'Other irregular verbs: see → saw, do → did, have → had' })
  relatedKnowledge: string;

  @ApiProperty({ example: 'Why is "goed" wrong? Regular verbs add -ed, but "go" is irregular.' })
  whyWrongAnswers: string;

  @ApiProperty({ enum: ExerciseType, example: ExerciseType.GRAMMAR })
  type: ExerciseType;

  @ApiProperty({ enum: EnglishLevel, example: EnglishLevel.A1 })
  level: EnglishLevel;

  @ApiPropertyOptional({ enum: Topic, example: Topic.EDUCATION })
  topic?: Topic;
}

export class ExerciseWithExplanationRequestDto {
  @ApiProperty({
    description: 'Exercise ID to get explanation for',
    example: 1,
  })
  @IsNotEmpty()
  exerciseId: number;

  @ApiPropertyOptional({
    description: 'Include detailed grammar analysis',
    example: true,
  })
  @IsOptional()
  includeGrammarAnalysis?: boolean;

  @ApiPropertyOptional({
    description: 'Include memory tips and tricks',
    example: true,
  })
  @IsOptional()
  includeMemoryTips?: boolean;

  @ApiPropertyOptional({
    description: 'Include related exercises',
    example: true,
  })
  @IsOptional()
  includeRelatedExercises?: boolean;
}
