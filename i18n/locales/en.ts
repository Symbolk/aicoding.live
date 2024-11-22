import { IMAGES } from "../constants";

export default {
  common: {
    platform: "Platform",
    projects: "Projects",
    support: "Support",
    feedback: "Feedback",
    account: "Account",
    billing: "Billing",
    notifications: "Notifications",
    logout: "Log out",
    upgradeToPro: "Upgrade to Pro",
    or: "OR",
    more: "More",
    viewProject: "View Project",
    shareProject: "Share Project",
    deleteProject: "Delete Project",
    enterprise: "Gamify Everything with AI",
    general: "General",
    team: "Team",
    limits: "Limits",
    commandTip: "Short Cut or Command",
    typeTip: "Type a command or search..."
  },
  playground: {
    title: "Playground",
    history: "History",
    starred: "Starred",
    settings: "Settings",
    questionLoading: "Preparing a Pile of Questions...",
    interviewQuestion: "Interview Question",
    interviewAnswer: "Reference Answer",
    interview: {
      loading: 'Loading interview questions...',
      remainingCards: 'Remaining cards',
      showAnswer: 'Show Answer',
      backToQuestion: 'Back to Question',
      cardCount: '{{current}}/{{total}}'
    }
  },
  projects: {
    huggingdog: {
      name: "HuggingDog",
      title: "HuggingDog",
      description: "Retrieve the daily papers + created models + uploaded datasets + launched spaces from HuggingFace. Also, the discussion and comments from HuggingDog."
    },
    askgithub: {
      name: "AskGitHub",
      title: "AskGitHub",
      description: "Pinpoint the just right projects by asking in natural language, AI will do the search and match."
    },
    livebook: {
      name: "LiveBook",
      title: "LiveBook",
      description: "Bring static book into life, with AIGC."
    },
    playground: {
      name: "Playground",
      title: "Playground",
      description: "Some random ideas that haven't become projects yet."
    },
    designEngineering: {
      name: "Design Engineering",
      title: "Design Engineering"
    },
    salesMarketing: {
      name: "Sales & Marketing",
      title: "Sales & Marketing"
    },
    travel: {
      name: "Travel",
      title: "Travel"
    }
  },
  models: {
    title: "Models",
    genesis: "Genesis",
    explorer: "Explorer",
    quantum: "Quantum"
  },
  documentation: {
    title: "Documentation",
    introduction: "Introduction",
    getStarted: "Get Started",
    tutorials: "Tutorials",
    changelog: "Changelog"
  },
  huggingdog: {
    overview: "Overview",
    reports: "Discussion",
    dailyPapers: "Daily Papers",
    createdModels: "Created Models",
    uploadedDatasets: "Uploaded Datasets",
    launchedSpaces: "Launched Spaces",
    fromLastMonth: "From last month",
    monthlyIncrease: "Monthly increase",
    monthlyDataIncrease: "Monthly data increase",
    sinceLastHour: "Since last hour",
    topicTrends: "Topic Trends",
    hotTopics: "Hot Topics",
    summarizedByAI: "Summarized by AI",
    score: "Score",
    goDog: "Go Dog!",
    loading: "Loading...",
    noTopicData: "No topic data available",
    analyzing: "Analyzing...",
    selectDateRange: "Please select date range",
    selectEndDate: "Please select end date",
    from: "From",
    to: "To",
    days: "days",
    total: "Total",
    welcomeTitle: "Welcome to HuggingDog",
    welcomeDescription: "Please select a date range to view the latest updates on HuggingFace",
    selectToday: "Select Today",
    confirm: "Confirm",
  },
  askgithub: {
    title: "What can I help you ship?",
    placeholder: "Ask AskGithub a question...",
    askButton: "Ask!",
    asking: "Answering...",
    error: "An error occurred while processing your request.",
    suggestions: {
      harmony: "I want to learn HarmonyOS App development",
      rlhf: "As a beginner, I want to learn about reinforcement learning for large models",
      blog: "I am building a personal blog website, any frameworks to reference?",
      codingai: "Recommend some papers on Coding for AI"
    },
    stages: {
      thinking: "🤔 Analyzing Query",
      keywords: "🔍 Extracting Keywords",
      searching: "🚀 Searching Repositories",
      summarizing: "📝 Generating Summary"
    },
    finalSummary: "✨ Final Summary",
    recommendedRepos: "📚 Recommended Repositories",
    collapse: "Collapse",
    expand: "Expand"
  },
  livebook: {
    title: "What story shall we bring to life?",
    pasteStory: "Paste Your Story",
    pasteHere: "Paste your story here...",
    uploadFile: "Upload a File",
    chooseFile: "Choose a file or drag it here",
    supportedFormats: "Supports .txt and .pdf",
    liveButton: "Live!",
    scriptGenerating: "Writing Script...",
    scriptGenerated: "Script Writing Complete!",
    sceneRendering: "Rendering Scene...",
    sceneRenderComplete: "Scene Rendering Complete!",
    backToEdit: "Back to Edit",
    useThisStory: "Use This Story",
    examples: {
      spaceWar: {
        title: 'Space War & Giant Apes',
        description: 'An epic story about human space expansion, colonial rule, and encountering powerful adversaries...',
        preview: 'I was 17 when I joined the army. I experienced Earth\'s so-called golden decade. As the Darwin Pioneer expedition successfully discovered the first Earth-like planet, humanity entered the era of interstellar colonization...',
        content: 'I was 17 years old the year I joined the army. I lived through the so-called golden decade of the earth. With the successful discovery of the first terrestrial planet by the Darwin Herald expedition, humanity entered the era of interstellar colonization. The planet represents resources, and resources represent wealth. Humanity is crazy for riches, and plunder restores human nature! More and more planets have been discovered, human beings have eradicated poverty, reveled every night, and the earth has never had a night. The process of colonization will not be smooth sailing, who will willingly be colonized by alien species, even the most primitive races. But human technology has easily intimidated the natives of the colonized planet, who have succumbed to force, and resistance seems ridiculous and naïve to humans. Humanity was carried away by one victory after another, and before all sorts of works of art extolling human colonization appeared, even philosophers began to tout it. We are not the spirits of all things, we are the spirits of the universe, and the tiny galaxy will be the center of the universe. Until we meet more powerful opponents, we call them giant apes. They are bloodthirsty and cruel, we also call them insidious and cunning, they don\'t know how to form friendships, and they think that force can conquer everything. Their modified bodies are incredibly powerful and can even survive in a vacuum. Their fighting style is fierce and brutal, like that of the Vikings of the Middle Ages. The great axes in their hands can split through the hardest matter of the earth, and the human fleet is not destroyed by their artillery fire, but by their warriors! From the time they began to invade the first colonized planet, humanity began to try to negotiate with the enemy. The reply was a ten-second roar! Amazingly, our linguists were able to decipher the roar after humanity had lost most of its colonized planets. "You will become the dust of the universe, and we will take back the earth!"',
        image: IMAGES.spaceWar
      },
      animalFarm: {
        title: 'Animal Farm',
        description: 'A fable about farm animals pursuing equality and freedom...',
        preview: 'Mr. Jones, of the Manor Farm, had locked the hen-houses for the night, but was too drunk to remember to shut the pop-holes...',
        content: `Mr. Jones of the farm had locked the chicken coop before going to bed, but he had drunk too much and forgotten to close several small side doors. He staggered across the yard, the circular light from the lamp he carried swaying back and forth. As soon as he entered the back door, he quickly kicked off his boots, drew the last drink of the day from the beer barrel in the kitchen, and walked towards the bed where Mrs. Jones was already snoring.  
As soon as the light in the bedroom went out, a slight rustling sound swept through all the pens and stables on the farm. Rumors had already circulated during the day that the old Major—the prize-winning boar—had a strange dream the night before and wanted to share it with the other animals. It had been agreed beforehand that once they were sure Mr. Jones would not interfere, all the animals would gather in the big barn. The old Major (everyone called him that, although he was registered as Willingdon Beauty when he was exhibited) was truly respected on the farm, and every animal was willing to lose a few hours of sleep to hear what he had to say.  
At one end of the big barn was a slightly raised platform, where the Major had been provided with a bed of hay, and a lamp hanging from the beam was right above him, making it quite comfortable. He was twelve years old, had recently become somewhat portly, but he still looked like a handsome pig, resembling a wise and kind elder, even though his tusks had never grown out. Before long, the other animals began to arrive one after another, settling in according to their different habits. The first to arrive were three dogs named Bluebell, Jessie, and Pincher; then a few pigs immediately set up camp in front of the platform. Some hens perched on the windowsill; a few pigeons fluttered up to the rafters; the cows and sheep lay down behind the pigs, starting to chew the cud. Two heavy draft horses, one named Boxer and the other Clover, came in together. They walked very slowly, carefully placing their furry hooves on the ground, as if afraid that some small animal might be hiding in the hay. Clover was a strong mare full of maternal instincts, now in her middle age, and after having given birth to four foals, she could no longer regain her former shape. Boxer, on the other hand, was a massive creature, nearly six feet tall, and in terms of strength, he was as strong as two ordinary horses combined. A white stripe down his nose gave him a somewhat foolish appearance, and his intelligence was not particularly outstanding, but due to his indomitable character and tremendous work ethic, he earned everyone's respect. Following the two draft horses were the white goat Muriel and the donkey Benjamin. The latter was the oldest animal on the farm and had the worst temper. He rarely spoke, and when he did, it was usually to make some sarcastic remark, such as saying that God gave him a tail to swat flies, but he would rather have neither the tail nor the flies. Among the animals on the farm, he was the only one who never laughed. If asked why, he would say he saw nothing worth laughing at. However, he did have a deep admiration for Boxer, though he never openly admitted it; the two of them often went together to a small pasture behind the orchard to spend Sundays, grazing side by side, but they never spoke to each other.`,
        image: IMAGES.animalFarm
      },
      moonlightForest: {
        title: 'Legend of the Moonlight Forest',
        description: 'A fantasy tale about innocence and courage...',
        preview: 'In a distant village lived a little girl named Alice. Alice always loved listening to her mother\'s stories, especially those about the mysterious "Moonlight Forest"...',
        content: `In a distant village, there lived a little girl named Ellie. Since she was young, Ellie loved listening to her mother tell stories, especially the one about the mysterious "Moonlight Forest." Whenever night fell and the moonlight bathed the earth, her mother would always tell her, "Remember, the entrance to the Moonlight Forest is only open to those with pure hearts."
One evening, as Ellie was playing in the yard as usual, suddenly a gentle breeze blew by, and the moonlight descended from the sky, shining in front of her. She widened her eyes and found herself standing in an unfamiliar place—a silvery forest, where the leaves of the trees sparkled in the moonlight, as if sprinkled with stars.
Curiously, Ellie walked into the forest, her footsteps light on the soft grass, and the surroundings were silent, with only the sound of her footsteps echoing. Suddenly, she heard a whispering sound, and following the sound, she saw a little fox sitting on an ancient tree root, looking at her.
"Little girl, how did you get here?" the fox asked, its eyes wide with curiosity.
"I don't know, the moonlight brought me here," Ellie replied cautiously.
The fox smiled, its eyes sparkling with wisdom: "This is the Moonlight Forest, and only those with pure hearts can find it. Many magical creatures live here, but there is also a dangerous secret."
Ellie asked curiously, "What secret?"
The fox's expression suddenly became serious: "The life force of the Moonlight Forest comes from an ancient tree called the 'Star Tree.' However, a dark vine has begun to grow from the other end of the forest, devouring the power of the Star Tree. If it continues to spread, the entire forest will disappear, and the moonlight will no longer shine."
Ellie asked nervously, "What should we do?"
The fox looked at her, a glimmer of hope in its eyes: "Only a pure heart can break the vine's curse. Are you willing to help us?"
Ellie nodded without hesitation: "I am willing!"
So, the fox led Ellie through the forest to a dark place where black vines coiled around an ancient tree like poisonous snakes. The vines twisted and turned, exuding an evil aura, and the air around them became heavy.
Ellie stood before the vines, closed her eyes, and took a deep breath. She let go of all her fears and doubts, imagining the warmth of the moonlight and the vitality of the forest. She gently reached out her hand and touched one end of the vine. The moment her fingers made contact with the vine, a silvery light burst forth from her body, and the vine seemed to sense something, beginning to shake violently.
Ellie focused her energy, gathering all her love and kindness in her heart. As her spirit became purer, the vine began to shrink slowly, eventually being completely dispelled by the moonlight. The ancient Star Tree regained its vitality, its leaves sparkling with dazzling light, and the entire forest was once again filled with life, the moonlight becoming even brighter.
The fox jumped out, happily exclaiming, "You did it, Ellie! You saved the Moonlight Forest!"
Ellie looked at the Star Tree before her, her heart filled with joy and pride. She knew that she had not only unraveled an ancient mystery but, more importantly, discovered a power hidden deep within herself—a pure heart can conquer any darkness.
From that day on, Ellie became a friend of the Moonlight Forest, and whenever the moonlight rose, she would come here to protect this magical place with the fox. And the Moonlight Forest would forever shine under the night sky, becoming the most beautiful legend in people's hearts.`,
        image: IMAGES.moonlightForest
      }
    },
    scriptViewer: {
      sceneRenderStart: "Scene rendering started!",
      sceneRendering: "Scene rendering in progress...",
      sceneRenderComplete: "Scene rendering completed!"
    }
  },
  contributors: {
    title: 'AI Contributors',
    roles: {
      development: 'Development',
      architecture: 'Architecture',
      design: 'Design',
      image: 'Text2Image',
      text: 'Text Generation'
    }
  },
  commandMenu: {
    searchPlaceholder: "Type a command or search...",
    noResults: "No results found.",
    projectsHeading: "Projects"
  }
} 