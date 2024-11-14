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
}

// ... 其他翻译接口定义 