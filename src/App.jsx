import { useState, useEffect, useRef } from 'react'
import './App.css'

// ===================== 剧情数据 =====================
const STORY = {
  start: 'm1',
  nodes: {
    m1: {
      bg: 'light',
      text: '周末午后，你窝在沙发里追剧。\n\n「咚咚咚。」\n\n敲门声。你住的是老小区，平时很少有人来。',
      choices: [
        { text: '去开门', to: 'm2' },
        { text: '不理，继续看剧', to: 'm5' }
      ]
    },
    m2: {
      bg: 'light',
      text: '你拉开门。\n\n楼道里空无一人，只有楼梯口站着个小孩，正朝你笑。她见你出来，转身就跑，留下一串清脆的笑声。\n\n你隐约听见她说了句什么，却听不真切。',
      choices: [
        { text: '跟上去看看', to: 'm3' },
        { text: '小孩恶作剧而已，不跟她计较', to: 'm4' }
      ]
    },
    m3: {
      bg: 'light',
      fragment: 0,
      text: '你追到楼梯口，小孩已经不见了。\n\n地上掉着一张黑白照片。你捡起来——照片里是两个穿同样裙子的小女孩，一个扎着辫子，一个披着头发，站在一栋很旧的老房子前面。\n\n你翻了翻，背面什么都没有。\n\n你莫名觉得心里发毛，把照片塞进口袋，回了家。',
      choices: [
        { text: '（获得记忆碎片·零）回家', to: 'm5' }
      ]
    },
    m4: {
      bg: 'light',
      text: '小孩恶作剧而已。你摇摇头关上门，回到沙发继续看剧。\n\n可一下午，你总觉得窗外有什么在看着你。',
      choices: [
        { text: '傍晚了，出门买夜宵', to: 'm5' }
      ]
    },
    m5: {
      bg: 'dark',
      text: '傍晚，你出门买夜宵。\n\n天已经擦黑，路灯亮了起来。',
      choices: [
        { text: '走大路', to: 'm6a' },
        { text: '抄近路，走小路', to: 'm6b' }
      ]
    },
    m6a: {
      bg: 'dark',
      text: '大路上冷冷清清，一个人都没有。\n\n明明才八九点，街上却安静得不像话。你裹了裹外套，觉得有些冷。',
      choices: [
        { text: '继续走，去小吃街', to: 'm7' }
      ]
    },
    m6b: {
      bg: 'dark',
      sound: 'heartbeat',
      text: '小路上很黑。\n\n你走了没几步，就听见身后有脚步声。你停，那声音也停。你走，那声音又跟着响起来。\n\n你不敢回头，加快脚步。',
      choices: [
        { text: '加快脚步，冲去小吃街', to: 'm7' }
      ]
    },
    m7: {
      bg: 'dark',
      text: '终于到了小吃街。\n\n可是——一个人都没有。\n\n烧烤摊的灯还亮着，炉子还冒着热气，摊位前的塑料凳一排排摆着，却连一个人影都没有。\n\n你正觉得奇怪，肩膀上，忽然被人轻轻拍了一下。',
      choices: [
        { text: '回头看', to: 'm8' },
        { text: '不敢回头，继续往前走', to: 'm9' }
      ]
    },
    m8: {
      bg: 'dark',
      text: '你猛地回头——\n\n身后空无一人。\n\n街道还是空的，灯还是亮的，什么都没有。你心跳得厉害，不敢再待下去，加快脚步往家走。',
      choices: [
        { text: '赶紧回家', to: 'm10' }
      ]
    },
    m9: {
      bg: 'black',
      effect: 'img_face',
      sound: 'jump',
      text: '你不敢回头，闷头往前走。\n\n可下一秒，一张惨白的脸突然贴到你眼前——\n\n你吓得尖叫一声，那脸却一瞬就消失了。\n\n你站在原地发抖，四处张望，周围什么也没有。\n\n你连夜宵都不买了，跌跌撞撞跑回家。',
      choices: [
        { text: '跑回家', to: 'm10' }
      ]
    },
    m10: {
      bg: 'dark',
      text: '回到家，你锁上门，心跳还没平复。\n\n你摸出手机想给闺蜜发消息吐槽，屏幕却先亮了起来。\n\n屏保不知道什么时候被换掉了——\n\n是一张照片。照片里，一个女孩直勾勾地盯着镜头，眼神阴森。四周全是黑的，只能看清她惨白的脸，和身上那一抹刺眼的红。',
      choices: [
        { text: '看着屏幕，吓呆了', to: 'm11' },
        { text: '吓得把手机丢出去', to: 'm12' }
      ]
    },
    m11: {
      bg: 'black',
      effect: 'shake_text',
      text: '你盯着那张脸，浑身发冷。\n\n照片里的女孩，嘴角的弧度越来越大，越来越大——\n\n然后，她缓缓抬起手，指向你身后。\n\n你僵硬地回过头。',
      choices: [
        { text: '（回过头去）', to: 'end_small' }
      ]
    },
    m12: {
      bg: 'dark',
      text: '你吓得把手机一把丢了出去。\n\n手机摔在地上，屏幕还亮着，那张脸还在。几秒后，屏幕终于暗了下去。\n\n你缓了很久才捡起手机，把它关机塞进抽屉。\n\n你告诉自己：一定是撞上不干净的东西了。明天，得去找个道士看看。\n\n晚上，你不敢关灯，缩在被子里。实在太困，你睡着了。',
      choices: [
        { text: '（睡去）', to: 'm13' }
      ]
    },
    m13: {
      bg: 'dark',
      effect: 'img_bridal',
      text: '你做了个梦。\n\n梦里是一栋很旧的老房子。你走进去，看见客厅正中央坐着一个女孩——\n\n她穿着红嫁衣，头上盖着红盖头，背对着你，肩膀一抽一抽的，像是在哭。',
      choices: [
        { text: '走近她', to: 'm13b' }
      ]
    },
    m13b: {
      bg: 'black',
      effect: 'sister_pop',
      sound: 'jump',
      text: '你一步步走近。\n\n她的哭声，渐渐停了。\n\n然后，一声阴森的笑，从盖头底下传了出来。\n\n下一秒，铺天盖地的红色字迹朝你涌来——\n\n「姐姐」「姐姐」「姐姐」\n\n你惊叫着醒了过来。',
      choices: [
        { text: '（惊醒）', to: 'm14' }
      ]
    },
    m14: {
      bg: 'light',
      text: '你满头大汗地醒来。\n\n手机不知什么时候回到了枕边。你拿起来一看，屏保已经恢复正常了。\n\n你给朋友发了消息，又上网发了个求助帖。\n\n这时你想起来——去年你爬山，在道观里碰见个道士，说你「命中带煞」。你当时嗤之以鼻，长这么大哪碰过什么奇怪的事。\n\n可今天……',
      choices: [
        { text: '算了，应该没什么，接着睡', to: 'm15' },
        { text: '不行，得去找那个道士', to: 'm16' }
      ]
    },
    m15: {
      bg: 'black',
      effect: 'img_blood',
      text: '你看了看时间，心想大概是最近太累了，做噩梦而已。\n\n你重新躺下，闭上眼。\n\n黑暗中，有什么东西，正从四面八方向你爬来——',
      choices: [
        { text: '（闭上眼）', to: 'end_believe' }
      ]
    },
    m16: {
      bg: 'light',
      text: '第二天一早，你收拾东西赶去那座道观。\n\n道士见你来，倒也不意外。你把这几天的事一五一十说了。\n\n他听完，沉默片刻，说：「你是被怨鬼缠上了。怨气很重，怕是缠了你很久了。」\n\n他给了你一张符，让你随身带着，贴身放好。\n\n你收下符，道了谢，下山。\n\n走到半山腰，你耳边忽然响起一阵很轻很轻的笑声。',
      choices: [
        { text: '停下来仔细听', to: 'm17a' },
        { text: '大概是风声，听错了', to: 'm17b' }
      ]
    },
    m17a: {
      bg: 'dark',
      text: '你停下脚步，屏住呼吸。\n\n那笑声越来越近，越来越清楚——\n\n是一个女孩的声音，带着哭腔，在你耳边轻轻叫了一声：\n\n「姐姐。」\n\n你浑身汗毛都竖了起来。',
      choices: [
        { text: '快步下山回家', to: 'm18' }
      ]
    },
    m17b: {
      bg: 'dark',
      text: '你摇摇头，大概是风声。\n\n可你捏了捏口袋里那张符，总觉得它……没什么用。',
      choices: [
        { text: '回家', to: 'm18' }
      ]
    },
    m18: {
      bg: 'dark',
      sound: 'drone',
      text: '回到家，你疲惫地瘫在沙发上，打开电视想放松一下。\n\n电视里放着综艺，一切正常。\n\n可看着看着，画面忽然变成了雪花。「沙沙沙——」\n\n你正要换台，画面猛地一变——\n\n你不在沙发上了。你在一栋很旧的老房子里，手脚都被绳子绑着。\n\n是梦里的那栋房子。\n\n一个红嫁衣的身影，缓缓向你走来。',
      choices: [
        { text: '（挣扎）', to: 'v1' }
      ]
    },
    v1: {
      bg: 'dark',
      fragment: 1,
      text: '你被绑着，动弹不得。眼前一阵恍惚，你发现——你变成了另一个人。\n\n你是个扎着辫子的小姑娘。面前，一个披着头发的女孩正蹲下来，用她自己的发带，给你扎头发。\n\n「为什么要换呀？」你问。\n\n她笑了笑：「你不是一直说，凭什么我比你早出生几分钟就是姐姐吗？今天让你当姐姐好不好。」\n\n你虽然疑惑，但还是信她，点了头。',
      choices: [
        { text: '（获得记忆碎片·一）让她换', to: 'v2' }
      ]
    },
    v2: {
      bg: 'dark',
      fragment: 2,
      text: '换好衣服和头发，姐姐拉着你往外跑。\n\n「我们去哪儿？」你问。\n\n「离开这个村子。」她说。\n\n你们趁着夜色往村口跑。可刚跑出村口，就被几个大人围住了——\n\n是你们爹娘喊来的。\n\n你们被按倒，绑了起来，关进柴房。',
      choices: [
        { text: '（获得记忆碎片·二）被关进柴房', to: 'v3' }
      ]
    },
    v3: {
      bg: 'dark',
      fragment: 3,
      text: '柴房里又黑又冷。你听见外面有人说话，说村长家的儿子要配冥婚，说今晚就要把人接走。\n\n你怕极了，缩在角落里。姐姐被绑在另一边，一直盯着你看。\n\n门开了。\n\n爹娘走进来，一把抓住你——抓住披着头发的你——往外拖。\n\n你回头看姐姐，她拼命挣扎，却挣不开绳子。\n\n你不明白。你们不是换了衣服和头发吗？为什么被带走的还是你？\n\n你忽然想通了——姐姐跟你换衣服，是为了让她自己不被带走吧。\n\n她骗了你。',
      choices: [
        { text: '（获得记忆碎片·三）被拖走', to: 'v4' }
      ]
    },
    v4: {
      bg: 'red',
      text: '你被换上了红嫁衣，头上盖着红盖头，被按着拜堂。\n\n堂屋里点着白蜡烛，供着灵位。你一直盼着姐姐来救你——\n\n可她一直没来。\n\n你哭，你喊，没有一个人理你。',
      choices: [
        { text: '求饶，哭喊', to: 'v5' },
        { text: '拼命挣扎', to: 'v6' }
      ]
    },
    v5: {
      bg: 'black',
      effect: 'cry_text',
      text: '你拼命求饶，哭喊着，可没有人理会你。\n\n你的声音在空荡荡的堂屋里回荡，只有蜡烛的火光在跳。',
      choices: [
        { text: '（喊到声音嘶哑）', to: 'end_experience' }
      ]
    },
    v6: {
      bg: 'black',
      fragment: 4,
      sound: 'jump',
      text: '你拼命挣扎！绳子勒进肉里，你不管不顾地挣——\n\n「呼——」\n\n你猛地从幻境中醒过来。\n\n你还在自己家里，满头大汗，浑身发抖。你大口喘着气，仿佛刚从水里捞出来。\n\n可脑袋，像要炸开一样疼。',
      choices: [
        { text: '（获得记忆碎片·四）捂着头', to: 'v7' }
      ]
    },
    v7: {
      bg: 'black',
      fragment: 5,
      text: '你捂着头，一阵阵剧痛袭来。\n\n恍惚间，你听见了陌生的对话——\n\n一个男人的声音：「让她去配冥婚也是没办法，家里已经穷成这样了。」\n\n一个女人的声音：「死她一个，换我们一家人的生活。」\n\n男人又说：「就让那个小的去吧。」\n\n你猛地睁开眼。\n\n……他们要带走的，从来不是妹妹。\n\n是姐姐。\n\n你浑身发凉。',
      choices: [
        { text: '（获得记忆碎片·五）你明白了什么', to: 'v8' }
      ]
    },
    v8: {
      bg: 'dark',
      text: '门外忽然传来敲门声。\n\n「咚、咚、咚。」越来越快。\n\n你走到门边，颤声问：「谁啊？」\n\n没有人回答。\n\n敲门声越来越响，越来越急。然后——\n\n门自己开了。\n\n门外，空无一人。',
      choices: [
        { text: '出去看看', to: 'v8a' },
        { text: '赶紧关门', to: 'v8b' }
      ]
    },
    v8a: {
      bg: 'dark',
      text: '你探出头。\n\n走廊里很安静，静得能听见自己的心跳。走廊尽头的灯，一闪，一闪，像是随时会灭。\n\n你心里发毛，退回屋里，用力关上门。',
      choices: [
        { text: '退回屋里', to: 'v9' }
      ]
    },
    v8b: {
      bg: 'black',
      effect: 'img_face',
      sound: 'jump',
      text: '你一把关上门！\n\n可一转身，一张惨白的脸就贴在眼前——\n\n你吓得后退一步，那脸又消失了。\n\n你手忙脚乱地摸口袋，想拿那张符——\n\n摸出来，符已经烧成了灰。\n\n你冲过去想开门，门却从外面被锁死了。\n\n身后，传来一个又哭又笑的声音：\n\n「姐姐……我好痛啊……」\n\n「他们拿钉子，钉进我的骨头……我好痛啊……」\n\n「来陪我吧。」\n\n你抱着头，那笑声钻进来，你的头越来越疼，眼前一黑——',
      choices: [
        { text: '（失去意识）', to: 'v9' }
      ]
    },
    v9: {
      bg: 'light',
      sound: 'stop',
      text: '你醒来的时候，已经是第二天中午。\n\n阳光透过窗帘照进来，一切看起来都那么正常。\n\n可你知道，那不是梦。\n\n你又去找了那个道士。道士听完你的经历，叹了口气：\n\n「想让冤魂消失，只有一个办法——用你自己，来献祭。」\n\n你沉默了很久。\n\n当晚，你坐在客厅里，等着她来。',
      choices: [
        { text: '（等）', to: 'v_final' }
      ]
    },
    v_final: {
      bg: 'dark',
      text: '午夜，门无声地开了。\n\n妹妹的冤魂站在门口，一身红衣，脸色惨白。你摸出那张新的符，她愣了片刻，不敢靠近。\n\n你正要出手——\n\n她却忽然蹲了下来，小声地，抽泣起来：\n\n「姐姐……为什么……为什么要这样对我？」\n\n「你对我最好了对不对，姐姐……」\n\n「我不想消失……我以后不会再缠着你了……放过我好不好？」\n\n「你以前最疼我了……阿姐……」\n\n你的手，僵在半空。',
      choices: []
    },
    end_small: {
      bg: 'black',
      text: '你回过头——\n\n身后什么都没有。\n\n可那天之后，你总觉得有什么东西跟着你。你搬了家，换了号码。\n\n手机里那张照片还在，只是照片里的女孩，一天比一天离得更近。\n\n🏁 结局【小命更重要】',
      ending: true
    },
    end_believe: {
      bg: 'black',
      text: '第二天醒来，阳光正好，一切正常。\n\n你笑着想，果然是自己吓自己。\n\n你掀开被子下床——\n\n脚踝上，一圈青紫的指印，像是被谁攥了一整夜。\n\n🏁 结局【宁可信其有 不可信其无】',
      ending: true
    },
    end_experience: {
      bg: 'black',
      text: '你被按着拜完了堂。\n\n红盖头落下来的一瞬，你看见床头坐着一个穿寿衣的男孩，正朝你笑。\n\n从那以后，村里人都说，老宅里多了两个孩子的哭声。\n\n🏁 结局【亲身体验】',
      ending: true
    },
    end_good: {
      bg: 'light',
      text: '你走过去，握住了妹妹冰凉的手。\n\n她抬起头，眼泪顺着惨白的脸往下淌：「姐姐……」\n\n「对不起。」你说，「姐姐来晚了。」\n\n这一次，你没有放手。\n\n你们一起，在晨光里化作了点点光尘，飘散了。\n\n第二天，巷口的那盏红灯笼，不见了。\n\n你，再也没有梦见过她。\n\n🏁 结局【魂飞魄散】',
      ending: true,
      good: true
    },
    end_bad_empty: {
      bg: 'black',
      effect: 'flash_red',
      text: '你终究，还是不忍心下手。\n\n她的手缩了回去。你眼前一黑，倒了下去。\n\n再次睁开眼，天已大亮。你躺在床上，头痛欲裂，庆幸那只是一场梦。\n\n你下床，想去倒杯水。\n\n脚脖子，突然被一只手攥住了。\n\n你僵硬地低头——\n\n床底的阴影里，露出半张惨白的脸，正仰头看着你。\n\n她笑了：\n\n「姐姐，这么容易相信别人，是会吃亏的。」\n\n「……来陪我吧。」\n\n🏁 结局【床底贴脸】',
      ending: true
    },
    end_bad_full: {
      bg: 'black',
      effect: 'flash_red',
      text: '你终究，还是不忍心下手。\n\n她的手缩了回去。你眼前一黑，倒了下去。\n\n再次睁开眼，天已大亮。你躺在床上，头痛欲裂，庆幸那只是一场梦。\n\n你下床，想去倒杯水。\n\n脚脖子，突然被一只手攥住了。\n\n你僵硬地低头——\n\n床底的阴影里，露出半张惨白的脸，正仰头看着你。\n\n她的眼睛，忽然红了：\n\n「姐姐，你还是那么心善。」\n\n「……来陪我吧。」\n\n🏁 结局【床底贴脸】',
      ending: true
    }
  }
}

// 集齐碎片后，终章追加的完整真相
const TRUTH_TEXT = '\n\n记忆如潮水般涌来——\n\n那年偷听的夜晚、逃跑的村口、换掉的衣裳、拜堂时她回望的眼神……\n\n全都想起来了。\n\n你和她换了衣服，是想替她去死。\n\n可正因为换了衣服，爹娘按「披发的姐姐」认人，抓走的却是真正的她。\n\n你想救她，却害了她。\n\n而她到死都以为，是你把她推出去顶了包。\n\n这个误会，困了她几百年。'

// ===================== 音效管理器 =====================
const SoundFX = {
  ctx: null,
  master: null,
  _droneOsc: null,

  init() {
    if (this.ctx) return
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.6
      this.master.connect(this.ctx.destination)
    } catch (e) {}
  },

  heartbeat() {
    this.init()
    if (!this.ctx) return
    const t = this.ctx.currentTime
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const start = t + i * 0.45
      osc.type = 'sine'
      osc.frequency.setValueAtTime(55, start)
      osc.frequency.exponentialRampToValueAtTime(40, start + 0.12)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.8, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15)
      osc.connect(gain)
      gain.connect(this.master)
      osc.start(start)
      osc.stop(start + 0.2)
    }
  },

  jump() {
    this.init()
    if (!this.ctx) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, t)
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.3)
    gain.gain.setValueAtTime(0.9, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(t)
    osc.stop(t + 0.45)
  },

  drone() {
    this.init()
    if (!this.ctx) return
    if (this._droneOsc) this.stopDrone()
    const t = this.ctx.currentTime
    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.value = 55
    osc2.type = 'sine'
    osc2.frequency.value = 55.5
    gain.gain.value = 0.15
    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.master)
    osc1.start(t)
    osc2.start(t)
    this._droneOsc = [osc1, osc2]
  },

  stopDrone() {
    if (this._droneOsc) {
      this._droneOsc.forEach(o => { try { o.stop() } catch (e) {} })
      this._droneOsc = null
    }
  }
}

// ===================== 主组件 =====================
export default function App() {
  const [boot, setBoot] = useState(() => localStorage.getItem('horror_save') ? 'menu' : 'play')
  const [nodeId, setNodeId] = useState(STORY.start)
  const [fragments, setFragments] = useState(() => {
    try { return JSON.parse(localStorage.getItem('horror_frags')) || [] } catch (e) { return [] }
  })
  const [shown, setShown] = useState('')
  const [typing, setTyping] = useState(true)
  const [effect, setEffect] = useState('')
  const [bg, setBg] = useState('light')
  const [choicesVisible, setChoicesVisible] = useState(false)
  const timerRef = useRef(null)

  const node = STORY.nodes[nodeId]
  const hasAll = [0, 1, 2, 3, 4, 5].every(f => fragments.includes(f))

  // 收集碎片
  useEffect(() => {
    if (node && node.fragment !== undefined && !fragments.includes(node.fragment)) {
      setFragments(prev => {
        const next = [...prev, node.fragment]
        localStorage.setItem('horror_frags', JSON.stringify(next))
        return next
      })
    }
  }, [nodeId])

  // 自动存档（结局不存）
  useEffect(() => {
    if (node && !node.ending && boot === 'play') {
      localStorage.setItem('horror_save', nodeId)
    }
  }, [nodeId, boot])

  // 打字机 + 特效 + 音效
  useEffect(() => {
    if (!node) return
    setTyping(true)
    setChoicesVisible(false)
    setBg(node.bg || 'light')
    setEffect(node.effect || '')

    // 音效
    if (node.sound === 'heartbeat') SoundFX.heartbeat()
    if (node.sound === 'jump') SoundFX.jump()
    if (node.sound === 'drone') SoundFX.drone()
    if (node.sound === 'stop') SoundFX.stopDrone()

    // 终章集齐碎片时追加真相
    const fullText = nodeId === 'v_final' && hasAll ? node.text + TRUTH_TEXT : node.text

    if (node.ending) {
      setShown(fullText)
      setTyping(false)
      setTimeout(() => setChoicesVisible(true), 400)
      return
    }

    setShown('')
    let i = 0
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      i += 2
      setShown(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(timerRef.current)
        setTyping(false)
        setTimeout(() => setChoicesVisible(true), node.effect ? 1200 : 400)
      }
    }, 30)
    return () => clearInterval(timerRef.current)
  }, [nodeId])

  // 终章动态选项
  function currentChoices() {
    if (nodeId === 'v_final') {
      if (hasAll) {
        return [
          { text: '同归于尽', to: 'end_good' },
          { text: '不忍心下手', to: 'end_bad_full' }
        ]
      }
      return [
        { text: '不忍心下手', to: 'end_bad_empty' }
      ]
    }
    return node ? node.choices || [] : []
  }

  function goTo(id) {
    if (id === 'restart') {
      localStorage.removeItem('horror_save')
      setNodeId(STORY.start)
      setBoot('play')
      return
    }
    setNodeId(id)
  }

  function backToMenu() {
    SoundFX.stopDrone()
    setBoot('menu')
  }

  function startGame(clear) {
    if (clear) {
      localStorage.removeItem('horror_save')
      localStorage.removeItem('horror_frags')
      setFragments([])
    }
    setNodeId(STORY.start)
    setBoot('play')
  }

  // 开始菜单
  if (boot === 'menu') {
    return (
      <div className="boot">
        <div className="boot-title">红灯笼</div>
        <div className="boot-sub">— 巷子尽头的红嫁衣 —</div>
        <div className="boot-frags">记忆碎片 {fragments.length} / 6</div>
        <div className="boot-btns">
          <button className="boot-btn primary" onClick={() => { setBoot('play'); setNodeId(localStorage.getItem('horror_save') || STORY.start) }}>
            继续游戏
          </button>
          <button className="boot-btn" onClick={() => startGame(false)}>
            从头开始
          </button>
          <button className="boot-btn danger" onClick={() => startGame(true)}>
            全新开始（清空碎片）
          </button>
        </div>
        <div className="boot-hint">建议戴耳机、调暗灯光游玩</div>
      </div>
    )
  }

  if (!node) return null

  const effectClass = effect ? `fx-${effect}` : ''
  const bgClass = `bg-${bg}`

  return (
    <div className={`game ${bgClass} ${effectClass}`}>
      {effect === 'flash' && <div className="fx-flash"></div>}
      {effect === 'flash_red' && <div className="fx-flash-red"></div>}
      {effect === 'shake' && <div className="fx-shake"></div>}

      {effect === 'img_face' && (
        <div className="fx-img img-face">
          <img src="https://s41.ax1x.com/2026/08/22/pmz4ui4.jpg" alt="" />
        </div>
      )}
      {effect === 'img_bridal' && (
        <div className="fx-img img-bridal">
          <img src="https://s41.ax1x.com/2026/08/22/pmz4dWd.png" alt="" />
        </div>
      )}
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
            <p key={i} className="cry-line" style={{ animationDelay: `${i * 0.9}s` }}>{line}</p>
          ))}
        </div>
      )}
      {effect === 'shake_text' && (
        <div className="fx-shake-text">
          <span>别回头。</span>
        </div>
      )}

      <div className="frag-counter">
        记忆碎片 {fragments.length} / 6
      </div>

      <div className="game-content">
        <div className="title">
          {node.ending
            ? (node.good ? '🌅 结局' : '☠️ 结局')
            : (nodeId.startsWith('v') ? '幻境 · 妹妹的记忆' : '红灯笼')}
        </div>
        <div className="text">{shown}{typing && <span className="cursor">▍</span>}</div>

        {choicesVisible && !typing && (
          <div className="choices">
            {node.ending ? (
              <button className="choice" onClick={backToMenu}>回到开始</button>
            ) : (
              currentChoices().map((c, i) => (
                <button key={i} className="choice" onClick={() => goTo(c.to)}>
                  {c.text}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="hint">戴上耳机，调暗灯光，效果更佳</div>
    </div>
  )
}
