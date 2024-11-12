import { NextApiRequest, NextApiResponse } from 'next'
import { createChatCompletion } from '@/lib/01ai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content } = req.body

    try {
    //   const response = await createChatCompletion([
    //     {
    //       role: "system",
    //       content: `你是一个专业的剧本创作助手。请将用户提供的内容转换为规范的剧本格式。
    //       剧本应该包含：
    //       1. 场景描述：详细的环境和氛围描述（场景应该尽可能少，可以合并到一起的就合并）
    //       2. 角色对话：包含角色名称和对话内容
    //       3. 旁白：用于描述情节发展和过渡
    //       4. 动作指示：描述角色的动作和表情
          
    //       请以JSON格式返回，结构如下：
    //       {
    //         "title": "剧本标题",
    //         "scenes": [
    //           {
    //             "id": "场景ID",
    //             "type": "scene|dialogue|narration|action",
    //             "content": "具体内容",
    //             "character": "说话的角色（对话类型时）",
    //             "timestamp": "时间戳"
    //           }
    //         ]
    //       }`
    //     },
    //     {
    //       role: "user",
    //       content: content
    //     }
    //   ])
    const response = `
{
  "title": "动物庄园",
  "scenes": [
    {
      "id": "scene_1",
      "type": "scene",
      "content": "晚上，曼娜庄园。琼斯先生锁上鸡舍，醉酒后忘记关牲口进出的门洞。马灯摇曳，他步履蹒跚地穿过院子，踢掉靴子，喝掉最后一杯啤酒，摸索着上床，鼾声四起。",
      "timestamp": "2023-10-01T20:00:00Z"
    },
    {
      "id": "scene_2",
      "type": "narration",
      "content": "庄园陷入黑暗，一阵躁动随之而来。动物们听闻老麦哲的梦，决定在琼斯先生离开后在大谷仓集合。",
      "timestamp": "2023-10-01T20:10:00Z"
    },
    {
      "id": "scene_3",
      "type": "scene",
      "content": "大谷仓内，一角的平台上铺着稻草垫子，麦哲坐在那里，头顶横梁上挂着一盏马灯。他十二岁，略显发福，但仍威严。长獠牙下是智慧与慈祥的面容。",
      "timestamp": "2023-10-01T20:15:00Z"
    },
    {
      "id": "scene_4",
      "type": "dialogue",
      "character": "麦哲",
      "content": "同志们，你们已经听说了，昨天晚上，我做了个奇怪的梦。但在讲这个梦之前，我想先讲点别的。同志们，我感觉我将不久于世，在我死之前，我有必要给大家传授一些我领悟到的哲理。",
      "timestamp": "2023-10-01T20:20:00Z"
    },
    {
      "id": "scene_5",
      "type": "dialogue",
      "character": "麦哲",
      "content": "同志们，我们现在的生活是什么样子的？我们的生命痛苦、劳累并且短暂。我们出生后，被那些人强迫工作，直到用尽最后一丝力气，而他们给我们的仅仅是少到只能维持生命的食物。",
      "timestamp": "2023-10-01T20:25:00Z"
    },
    {
      "id": "scene_6",
      "type": "action",
      "content": "麦哲抬起头，环视周围的动物，语气变得激昂。",
      "timestamp": "2023-10-01T20:27:00Z"
    },
    {
      "id": "scene_7",
      "type": "dialogue",
      "character": "麦哲",
      "content": "任何一个英格兰的动物在他一岁以后都不会再知道快乐和闲适的意思。任何一个英格兰的动物都没有自由。一个动物的一生就是痛苦和奴役的一生，这是一个不争的事实。",
      "timestamp": "2023-10-01T20:30:00Z"
    },
    {
      "id": "scene_8",
      "type": "narration",
      "content": "动物们开始骚动，低声议论。三条狗——布鲁贝尔、杰西和品彻坐在最前面，猪们则在讲台前的稻草上就坐。",
      "timestamp": "2023-10-01T20:35:00Z"
    },
    {
      "id": "scene_9",
      "type": "dialogue",
      "character": "麦哲",
      "content": "但自然法则就是这样的吗？难道是因为这片土地过于贫瘠以至于不能让我们过上体面的生活？不，同志们，一千个不！英格兰土地肥沃，气候适宜，现在生活在这里的动物的数量远远没有达到这片土地可以养活的数量。",
      "timestamp": "2023-10-01T20:40:00Z"
    },
    {
      "id": "scene_10",
      "type": "action",
      "content": "麦哲停顿一下，扫视全场，动物们聚精会神。",
      "timestamp": "2023-10-01T20:45:00Z"
    },
    {
      "id": "scene_11",
      "type": "dialogue",
      "character": "麦哲",
      "content": "仅仅这个农场就可以养活十二匹马，二十头牛，成百上千的羊，并让他们过上我们难以想象的舒适体面的生活。可为什么我们的生活如此糟糕呢？因为我们所有的劳动成果几乎都被人类窃取了。",
      "timestamp": "2023-10-01T20:50:00Z"
    },
    {
      "id": "scene_12",
      "type": "dialogue",
      "character": "麦哲",
      "content": "同志们，这就是我们所有问题的答案。一切都可以归结为一个词——人类。我们真正的敌人只有人类。把人类赶走，我们将永不再有饥饿和过度的劳作。",
      "timestamp": "2023-10-01T20:55:00Z"
    },
    {
      "id": "scene_13",
      "type": "narration",
      "content": "动物们开始激动，低声议论纷纷。布克瑟和克莱弗慢慢走进谷仓，小心翼翼地寻找位置坐下。",
      "timestamp": "2023-10-01T21:00:00Z"
    },
    {
      "id": "scene_14",
      "type": "dialogue",
      "character": "麦哲",
      "content": "人是唯一只消费不生产的生物。他不产奶，不下蛋，羸弱的身体拉不了犁，跑起来慢的连兔子也抓不到。然而他却是所有动物的主人。",
      "timestamp": "2023-10-01T21:05:00Z"
    },
    {
      "id": "scene_15",
      "type": "action",
      "content": "麦哲的声音变得低沉而有力，动物们屏息凝神。",
      "timestamp": "2023-10-01T21:10:00Z"
    },
    {
      "id": "scene_16",
      "type": "dialogue",
      "character": "麦哲",
      "content": "他在驱使我们工作，除了给我们少的可怜的食物避免我们饿死之外，剩余的一切都收归他自己所有。我们在土地上劳作，用我们的粪便给土地施肥，而我们中任何一个所能拥有的不过是自己身上的那张皮。",
      "timestamp": "2023-10-01T21:15:00Z"
    },
    {
      "id": "scene_17",
      "type": "dialogue",
      "character": "麦哲",
      "content": "在我面前这些的牛，你们去年共产了几千加仑的奶？要是这些奶都用来哺育我们的小牛呢？可是每一滴都流进了我们敌人的喉咙。",
      "timestamp": "2023-10-01T21:20:00Z"
    },
    {
      "id": "scene_18",
      "type": "dialogue",
      "character": "麦哲",
      "content": "还有母鸡，你们去年共下了多少蛋？又有多少孵出了小鸡呢？其余都在市场上变成钱落进了琼斯和他的雇员的口袋。",
      "timestamp": "2023-10-01T21:25:00Z"
    },
    {
      "id": "scene_19",
      "type": "dialogue",
      "character": "麦哲",
      "content": "还有你，克莱弗，你生的四个小马驹哪去了？谁来赡养你，让你安度晚年呢？他们每一个都在一岁的时候被卖了——你再也见不到他们中任何一个了。",
      "timestamp": "2023-10-01T21:30:00Z"
    },
    {
      "id": "scene_20",
      "type": "dialogue",
      "character": "麦哲",
      "content": "作为你生育和在地里劳作的回报，除了少的可怜的一些草料和一间马厩之外，还有什么呢？",
      "timestamp": "2023-10-01T21:35:00Z"
    }
  ]
} 
`;

    //   let scriptData = response.choices[0].message.content.trim()
    let scriptData = response
      if (scriptData.startsWith('```json')) {
        scriptData = scriptData.slice(7, -3)
      }
      console.log(scriptData);
      const script = JSON.parse(scriptData)
      res.status(200).json(script)
    } catch (error: any) {
      console.error('Script generation error:', error)
      res.status(500).json({ error: error.message || 'Error generating script' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 