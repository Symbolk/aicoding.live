export interface StoryExample {
  title: string
  description: string
  preview: string
  content: string
  image: string
}

export interface LiveBookTranslations {
  title: string
  pasteStory: string
  pasteHere: string
  uploadFile: string
  chooseFile: string
  supportedFormats: string
  liveButton: string
  generating: string
  backToEdit: string
  useThisStory: string
  examples: {
    spaceWar: StoryExample
    animalFarm: StoryExample
    moonlightForest: StoryExample
  }
  scriptViewer: {
    sceneRenderStart: string
    sceneRendering: string
    sceneRenderComplete: string
  }
}

export interface ContributorsTranslations {
  title: string
  roles: {
    development: string
    architecture: string
    design: string
    image: string
    text: string
  }
}

export interface Translations {
  // ... existing translations ...
  contributors: ContributorsTranslations
  playground: {
    interview: {
      loading: string
      remainingCards: string
      showAnswer: string
      backToQuestion: string
      cardCount: string
    }
  }
}

// ... 其他翻译接口定义 