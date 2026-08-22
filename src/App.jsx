import { useState, useEffect, useRef } from 'react'
import './App.css'

// ===== 剧情数据 =====
const STORY = {
  start: 's1',
  nodes: {
    s1: {
      bg: 'light',
      text: '凌晨1:47，你被手机震醒。一条陌生短信：\n\n「巷子尽头的红灯笼，还亮着。别去看。」\n\n你坐起来，窗外一片漆黑。',
      choices: [
        { text: '躺下继续睡', to: 's2a' },
        { text: '起身去巷子口看看', to: 's2b' }
      ]
    },
    s2a: {
      bg: 'dark',
      text: '你把手机扣在枕边，闭上眼。\n\n三分钟后，手机又震了一下。\n\n你不想看。可它一直在震。一下，两下，三下——像有人在你耳边不停敲着什么东西。',
      effect: 'shake',
      choices: [
        { text: '还是看看吧', to: 's3' },
        { text: '关机', to: 's2a_dead' }
      ]
    },
    s2a_dead: {
      bg: 'dark',
      text: '你长按关机键。屏幕黑了。\n\n世界安静了。\n\n第二天，邻居敲门没人应。后来警察撬开门，你坐在床上，手机屏幕亮着，上面只有一行字：\n\n「看到了。」',
      effect: 'red',
      choices: [
        { text: '重新开始', to: 's1' }
      ],
      ending: true
    },
    s2b: {
      bg: 'dark',
      text: '你披上外套，推开门。\n\n巷子就在楼下。白天这里堆着纸箱和旧家具，可此刻，巷子深处亮着一团红色的光。\n\n很红，像血一样。',
      effect: 'flash',
      choices: [
        { text: '走进巷子', to: 's3' },
        { text: '退回屋里', to: 's2a' }
      ]
    },
    s3: {
      bg: 'dark',
      text: '越靠近，那股红光越亮。\n\n你闻到了一股纸烧过的味道，混着……香火味。\n\n巷子尽头，一盏红灯笼挂在电线杆上，底下坐着个穿红衣的老太太。她背对着你，一动不动。',
      effect: 'image_lantern',
      choices: [
        { text: '问她：这么晚了怎么还不回家', to: 's4a' },
        { text: '装作没看见，慢慢后退', to: 's4b' }
      ]
    },
    s4a: {
      bg: 'red',
      text: '老太太没有回头。\n\n你听到一个很轻很轻的声音，像纸片摩擦：\n\n「我在等我家囡囡。她说巷口灯笼亮了就回来。」\n\n「你看见我家囡囡了吗？」',
      effect: 'shake',
      choices: [
        { text: '「没、没看见……」', to: 's5a' },
        { text: '「我就是你家囡囡」（鬼使神差）', to: 's5b' }
      ]
    },
    s4b: {
      bg: 'dark',
      text: '你一步步往后退。\n\n红灯笼的光，忽然灭了。\n\n再亮起来的时候，老太太不见了。灯笼底下，只剩一张红色的纸人，脸朝着你的方向。',
      effect: 'image_paper',
      choices: [
        { text: '拔腿就跑', to: 's6a' },
        { text: '盯着那张纸人', to: 's6b' }
      ]
    },
    s5a: {
      bg: 'dark',
      text: '「没看见啊……」老太太的声音拖着长音。\n\n「那你怎么会走到这儿来？」\n\n「这条巷子，只有回家的人才会走。」\n\n她慢慢、慢慢地转过脸——',
      effect: 'image_face',
      choices: [
        { text: '闭上眼睛！', to: 's7' },
        { text: '看她！', to: 's5a_dead' }
      ]
    },
    s5a_dead: {
      bg: 'black',
      text: '你看见了一张纸做的脸。五官是画上去的，嘴角的红色晕开了一大片，像哭，又像笑。\n\n「囡囡，回来啦。」\n\n你再也说不出话。\n\n第二天，巷口多了个红灯笼。灯笼纸上，画着你的脸。',
      effect: 'flash_red',
      choices: [
        { text: '重新开始', to: 's1' }
      ],
      ending: true
    },
    s5b: {
      bg: 'red',
      text: '你说完那句话就后悔了。\n\n老太太的肩膀轻轻抖了一下。\n\n「囡囡……你可算回来了。」\n\n「娘给你留了红鸡蛋，煮了三年了，就等你回来吃。」\n\n你低头，看见自己手里，不知什么时候多了一碗热腾腾的红鸡蛋。',
      effect: 'shake',
      choices: [
        { text: '吃下红鸡蛋', to: 's8_good' },
        { text: '把碗摔了，转身就跑', to: 's5a' }
      ]
    },
    s6a: {
      bg: 'dark',
      text: '你冲出巷子，头也不回跑上楼，摔上门，背靠着门板大口喘气。\n\n手机又震了。\n\n你不敢看。\n\n但这次，屏幕自己亮了——前置摄像头里，你的身后，站着一个红衣老太太。',
      effect: 'image_face',
      choices: [
        { text: '猛地回头', to: 's6a_dead' }
      ]
    },
    s6a_dead: {
      bg: 'black',
      text: '你回过头。\n\n身后什么都没有。\n\n可你再转回来看屏幕时，摄像头里的"你"，正对着你笑。\n\n那是纸人的笑。\n\n手机黑屏了。你再也看不到真实的自己。',
      effect: 'flash_red',
      choices: [
        { text: '重新开始', to: 's1' }
      ],
      ending: true
    },
    s6b: {
      bg: 'dark',
      text: '你盯着那张纸人，一步，一步，往后退。\n\n纸人没有动。\n\n可你数了数——地上有四个脚印。\n\n一个是你自己的。另外三个，是纸做的鞋印，从灯笼底下，一路延伸到你身后。',
      effect: 'shake',
      choices: [
        { text: '逃！', to: 's6a' }
      ]
    },
    s7: {
      bg: 'dark',
      text: '你死死闭上眼睛，背过身，一步一步往巷子外挪。\n\n风很凉，很静。\n\n直到你撞上一个人。\n\n你睁开眼——是个穿白裙的姑娘，站在巷口，脸色惨白。她看着你，嘴唇动了动：\n\n「快走吧。灯笼还在亮着，她还在等。」',
      effect: 'flash',
      choices: [
        { text: '「你是谁？」', to: 's8_good' },
        { text: '头也不回地跑回家', to: 's9' }
      ]
    },
    s8_good: {
      bg: 'light',
      text: '姑娘没有回答，只是笑了笑，转身走进巷子。\n\n你听见身后传来很轻很轻的声音，像纸片摩擦：\n\n「囡囡，回来了就好。」\n\n你醒来的时候，天已经亮了。\n\n手机上有条新短信：「谢谢。灯笼，灭了。」\n\n你不知道那是梦还是真的。但你发誓，再也不在凌晨走进那条巷子。',
      effect: 'sunrise',
      choices: [
        { text: '重新开始', to: 's1' }
      ],
      ending: true,
      good: true
    },
    s9: {
      bg: 'dark',
      text: '你一路跑回家，冲进卧室，锁上门，钻进被子里。\n\n手机屏幕又亮了。\n\n你鬼使神差地打开相册——最新一张照片，拍摄时间：1:47。\n\n照片里，是巷子尽头的红灯笼。\n\n还有灯笼底下，那个穿红衣的老太太。\n\n她对着镜头，笑得很开心。',
      effect: 'image_lantern',
      choices: [
        { text: '删掉照片', to: 's9_dead' },
        { text: '继续看下去', to: 's9_dead' }
      ]
    },
    s9_dead: {
      bg: 'black',
      text: '照片一张一张往后翻。\n\n第二张：你家楼下。\n第三张：楼道里。\n第四张：你家门口。\n\n最后一张，拍摄时间：现在。\n\n画面里，是你在被窝里举着手机的样子。\n\n而你的肩膀后面，露出半张纸做的、微笑的脸。',
      effect: 'flash_red',
      choices: [
        { text: '重新开始', to: 's1' }
      ],
      ending: true
    }
  }
}

// ===== 特效组件 =====
export default function App() {
  const [nodeId, setNodeId] = useState(STORY.start)
  const [shown, setShown] = useState('')
  const [typing, setTyping] = useState(true)
  const [effect, setEffect] = useState('')
  const [bg, setBg] = useState('light')
  const [choicesVisible, setChoicesVisible] = useState(false)
  const timerRef = useRef(null)

  const node = STORY.nodes[nodeId]

  // 逐字浮现
  useEffect(() => {
    setTyping(true)
    setChoicesVisible(false)
    setShown('')
    setEffect(node.effect || '')
    setBg(node.bg || 'light')

    let i = 0
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      i += 2
      setShown(node.text.slice(0, i))
      if (i >= node.text.length) {
        clearInterval(timerRef.current)
        setTyping(false)
        // 特效结束后才显示选项
        setTimeout(() => setChoicesVisible(true), node.effect ? 1200 : 400)
      }
    }, 30)
    return () => clearInterval(timerRef.current)
  }, [nodeId])

  function goTo(id) {
    setNodeId(id)
  }

  const effectClass = effect ? `fx-${effect}` : ''
  const bgClass = `bg-${bg}`

 {effect === 'flash' && <div className="fx-flash"></div>}
{effect === 'flash_red' && <div className="fx-flash-red"></div>}
{effect === 'shake' && <div className="fx-shake"></div>}

{/* 妹妹突脸图：全屏快速弹出 */}
{effect === 'img_face' && (
  <div className="fx-img img-face">
    < img src="https://s41.ax1x.com/2026/08/22/pmz4ui4.jpg" alt="" />
  </div>
)}

{/* 红嫁衣女人：梦里旧房子，缓慢浮现 */}
{effect === 'img_bridal' && (
  <div className="fx-img img-bridal">
    < img src="https://s41.ax1x.com/2026/08/22/pmz4dWd.png" alt="" />
  </div>
)}

{/* 血手印：杂乱铺满屏幕 */}
{effect === 'img_blood' && (
  <div className="fx-blood">
    {[...Array(10)].map((_, i) => (
      <img
        key={i}
        src="https://s41.ax1x.com/2026/08/22/pmz4QzR.png"
        alt=""
        className="blood-print"
        style={{
          left: `${5 + Math.random() * 80}%`,
          top: `${5 + Math.random() * 80}%`,
          width: `${60 + Math.random() * 160}px`,
          transform: `rotate(${Math.random() * 360 - 180}deg)`,
          animationDelay: `${Math.random() * 1.5}s`
        }}
      />
    ))}
  </div>
)}

{/* 红色"姐姐"弹屏：由小到大铺满全屏 */}
{effect === 'sister_pop' && (
  <div className="fx-sister">
    {[...Array(26)].map((_, i) => (
      <span
        key={i}
        className="sister-word"
        style={{
          left: `${Math.random() * 88}%`,
          top: `${Math.random() * 88}%`,
          fontSize: `${24 + Math.random() * 72}px`,
          animationDelay: `${Math.random() * 1.2}s`,
          transform: `rotate(${Math.random() * 30 - 15}deg)`
        }}
      >姐姐</span>
    ))}
  </div>
)}

{/* 拜堂哭求：红字抖动逐行 */}
{effect === 'cry_text' && (
  <div className="fx-cry">
    {[
      '我不要嫁……我不要嫁给他……',
      '娘，你放过我……我是你女儿啊……',
      '姐姐……姐姐你在哪……你说过会回来的……',
      '救我……谁来救救我……',
      '为什么……为什么是我……',
      '姐姐，你骗我。'
    ].map((line, i) => (
      <p key={i} className="cry-line" style={{ animationDelay: `${i * 0.9}s` }}>{line}</p >
    ))}
  </div>
)}

{/* 抖动文字：比如"别回头。" */}
{effect === 'shake_text' && (
  <div className="fx-shake-text">
    <span>别回头。</span>
  </div>
)}


      <div className="game-content">
        <div className="title">{node.ending ? (node.good ? '🌅 结局' : '☠️ 结局') : '巷子尽头的红灯笼'}</div>
        <div className="text">{shown}{typing && <span className="cursor">▍</span>}</div>

        {choicesVisible && !typing && (
          <div className="choices">
            {node.choices.map((c, i) => (
              <button key={i} className="choice" onClick={() => goTo(c.to)}>
                {c.text}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hint">戴上耳机，调暗灯光，效果更佳</div>
    </div>
  )
}
