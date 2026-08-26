/**
 * 航天知识库 - 趣味问答数据
 * 覆盖五大类的科普知识测验
 */

const quizList = [
  {
    id: 'q001',
    category: 'spacecraft',
    difficulty: '简单',
    question: '土星五号运载火箭是为哪个航天计划设计的？',
    options: ['阿波罗计划', '天空实验室计划', '航天飞机计划', '国际空间站计划'],
    answer: 0,
    explanation: '土星五号是阿波罗计划中使用的三级液体燃料运载火箭，它将阿波罗飞船送上了月球。'
  },
  {
    id: 'q002',
    category: 'spacecraft',
    difficulty: '简单',
    question: '中国目前运载能力最强的火箭是？',
    options: ['长征二号F', '长征三号B', '长征五号', '长征七号'],
    answer: 2,
    explanation: '长征五号是中国目前运载能力最强的火箭，近地轨道运力达25吨，是中国空间站建设和深空探测的核心力量。'
  },
  {
    id: 'q003',
    category: 'spacecraft',
    difficulty: '中等',
    question: '哈勃太空望远镜的主镜直径是多少？',
    options: ['1.2米', '2.4米', '3.5米', '6.5米'],
    answer: 1,
    explanation: '哈勃主镜直径2.4米。而詹姆斯·韦伯望远镜的主镜直径达6.5米，是哈勃的近7倍面积。'
  },
  {
    id: 'q004',
    category: 'spacecraft',
    difficulty: '中等',
    question: '国际空间站在什么高度运行？',
    options: ['约100公里', '约200公里', '约400公里', '约1000公里'],
    answer: 2,
    explanation: '国际空间站在约400公里高的近地轨道上运行，以27,600公里/小时的速度绕地球飞行。'
  },
  {
    id: 'q005',
    category: 'spacecraft',
    difficulty: '困难',
    question: '旅行者1号何时穿越日球层顶，进入星际空间？',
    options: ['2005年', '2012年', '2018年', '2020年'],
    answer: 1,
    explanation: '2012年8月，旅行者1号穿越日球层顶，成为首个进入星际空间的人造物体。旅行者2号于2018年紧随其后。'
  },
  {
    id: 'q006',
    category: 'spacecraft',
    difficulty: '中等',
    question: 'SpaceX的猎鹰9号火箭首次成功回收是在哪一年？',
    options: ['2013年', '2015年', '2017年', '2019年'],
    answer: 1,
    explanation: '2015年12月21日，猎鹰9号一级火箭首次成功着陆回收，结束了火箭"用完即弃"的历史。'
  },
  {
    id: 'q007',
    category: 'spacecraft',
    difficulty: '简单',
    question: '好奇号火星车的动力来源是什么？',
    options: ['太阳能电池板', '放射性同位素热电机', '化学电池', '核裂变反应堆'],
    answer: 1,
    explanation: '好奇号使用放射性同位素热电机（RTG）为动力，不依赖太阳能，因此不受火星沙尘影响，可全天候工作。'
  },
  {
    id: 'q008',
    category: 'spacecraft',
    difficulty: '中等',
    question: '中国空间站的三个主要舱段是？',
    options: ['天宫、天舟、神舟', '天和、问天、梦天', '核心舱、实验舱、货运舱', '天和、巡天、问天'],
    answer: 1,
    explanation: '中国空间站由天和核心舱、问天实验舱和梦天实验舱三舱组成，形成T字基本构型。'
  },

  {
    id: 'q009',
    category: 'history',
    difficulty: '简单',
    question: '人类第一颗人造卫星叫什么名字？',
    options: ['探险者1号', '斯普特尼克1号', '东方红一号', '先驱者1号'],
    answer: 1,
    explanation: '1957年10月4日，苏联发射了斯普特尼克1号（Sputnik 1），这是人类历史上第一颗人造卫星。'
  },
  {
    id: 'q010',
    category: 'history',
    difficulty: '简单',
    question: '第一个进入太空的人类是谁？',
    options: ['尼尔·阿姆斯特朗', '尤里·加加林', '杨利伟', '约翰·格伦'],
    answer: 1,
    explanation: '1961年4月12日，苏联宇航员尤里·加加林乘东方一号飞船进入太空，绕地球飞行108分钟。'
  },
  {
    id: 'q011',
    category: 'history',
    difficulty: '简单',
    question: '人类首次登月是在哪一年？',
    options: ['1965年', '1969年', '1972年', '1975年'],
    answer: 1,
    explanation: '1969年7月20日，阿波罗11号成功登月，阿姆斯特朗成为第一个踏上月球的人。'
  },
  {
    id: 'q012',
    category: 'history',
    difficulty: '中等',
    question: '中国首位进入太空的航天员是谁？',
    options: ['杨利伟', '费俊龙', '聂海胜', '翟志刚'],
    answer: 0,
    explanation: '2003年10月15日，杨利伟乘神舟五号飞船进入太空，中国成为第三个独立掌握载人航天技术的国家。'
  },
  {
    id: 'q013',
    category: 'history',
    difficulty: '中等',
    question: '嫦娥四号创造了什么航天"首次"？',
    options: ['首次月球采样返回', '首次月背软着陆', '首次月球极地着陆', '首次月球背面采样'],
    answer: 1,
    explanation: '2019年1月3日，嫦娥四号在月球背面着陆，成为人类首个在月球背面软着陆的探测器。'
  },
  {
    id: 'q014',
    category: 'history',
    difficulty: '中等',
    question: '天问一号在火星上着陆的火星车叫什么？',
    options: ['玉兔号', '祝融号', '好奇号', '毅力号'],
    answer: 1,
    explanation: '天问一号搭载的火星车名为"祝融号"，2021年5月15日在火星乌托邦平原着陆。'
  },
  {
    id: 'q015',
    category: 'history',
    difficulty: '困难',
    question: '人类第一个空间站叫什么？',
    options: ['和平号', '礼炮一号', '天空实验室', '天宫一号'],
    answer: 1,
    explanation: '1971年4月，苏联发射了礼炮一号，这是人类第一个空间站，开创了长期在轨驻留的时代。'
  },
  {
    id: 'q016',
    category: 'history',
    difficulty: '困难',
    question: '和平号空间站共在轨运行了多少年？',
    options: ['5年', '10年', '15年', '20年'],
    answer: 2,
    explanation: '和平号空间站从1986年发射核心舱到2001年坠毁，在轨运行了15年，设计寿命仅5年。'
  },

  {
    id: 'q017',
    category: 'solar-system',
    difficulty: '简单',
    question: '太阳系中最大的行星是？',
    options: ['土星', '木星', '天王星', '海王星'],
    answer: 1,
    explanation: '木星是太阳系最大的行星，质量是其他七大行星总和的2.5倍。'
  },
  {
    id: 'q018',
    category: 'solar-system',
    difficulty: '简单',
    question: '太阳系中最热的行星是？',
    options: ['水星', '金星', '火星', '水星'],
    answer: 1,
    explanation: '金星因极端温室效应表面温度约465°C，比距太阳更近的水星还热，是太阳系最热的行星。'
  },
  {
    id: 'q019',
    category: 'solar-system',
    difficulty: '简单',
    question: '火星为什么呈红色？',
    options: ['大气中充满红色气体', '表面富含氧化铁', '反射太阳红光', '岩浆颜色为红'],
    answer: 1,
    explanation: '火星表面富含氧化铁（即"铁锈"），因此呈现红色，又称"红色星球"。'
  },
  {
    id: 'q020',
    category: 'solar-system',
    difficulty: '中等',
    question: '太阳系最高的山在哪个行星上？',
    options: ['地球', '火星', '木星', '金星'],
    answer: 1,
    explanation: '火星上的奥林匹斯山高约22公里，是珠穆朗玛峰的近3倍，是太阳系最高的火山。'
  },
  {
    id: 'q021',
    category: 'solar-system',
    difficulty: '中等',
    question: '哪颗行星因为自转轴倾角达98°而"侧躺"公转？',
    options: ['天王星', '海王星', '土星', '木星'],
    answer: 0,
    explanation: '天王星自转轴倾角98°，几乎与轨道面平行，可能源于远古巨大撞击。'
  },
  {
    id: 'q022',
    category: 'solar-system',
    difficulty: '中等',
    question: '冥王星在2006年被重新归类为什么？',
    options: ['小行星', '彗星', '矮行星', '卫星'],
    answer: 2,
    explanation: '2006年国际天文学联合会将冥王星重新归类为"矮行星"，因为它未能清除其轨道附近的其它天体。'
  },
  {
    id: 'q023',
    category: 'solar-system',
    difficulty: '困难',
    question: '太阳系中风速最快的行星是？',
    options: ['木星', '土星', '海王星', '天王星'],
    answer: 2,
    explanation: '海王星上观测到风速达2,100公里/小时的大气风暴，是太阳系最猛烈的风。'
  },
  {
    id: 'q024',
    category: 'solar-system',
    difficulty: '困难',
    question: '土星的平均密度与水相比如何？',
    options: ['比水大很多', '比水略大', '比水略小', '与水相同'],
    answer: 2,
    explanation: '土星平均密度仅0.69克/立方厘米，比水还低——理论上如果有足够大的浴缸，土星能浮在水上。'
  },

  {
    id: 'q025',
    category: 'astronauts',
    difficulty: '简单',
    question: '第一个踏上月球的人是谁？',
    options: ['巴兹·奥尔德林', '尼尔·阿姆斯特朗', '迈克尔·柯林斯', '皮特·康拉德'],
    answer: 1,
    explanation: '1969年7月20日，阿波罗11号指令长阿姆斯特朗成为第一个踏上月球的人，留下了"个人一小步，人类一大步"的名言。'
  },
  {
    id: 'q026',
    category: 'astronauts',
    difficulty: '简单',
    question: '中国首位进入太空的女航天员是谁？',
    options: ['王亚平', '刘洋', '陈冬', '刘伯明'],
    answer: 1,
    explanation: '2012年6月，刘洋乘神舟九号飞船进入太空，成为中国首位女航天员。'
  },
  {
    id: 'q027',
    category: 'astronauts',
    difficulty: '中等',
    question: '世界第一位女宇航员是哪个国家的？',
    options: ['美国', '苏联', '中国', '英国'],
    answer: 1,
    explanation: '1963年6月，苏联宇航员捷列什科娃乘东方六号进入太空，成为世界第一位女宇航员。'
  },
  {
    id: 'q028',
    category: 'astronauts',
    difficulty: '中等',
    question: '斯科特·凯利在国际空间站驻留了多长时间？',
    options: ['6个月', '近一年（340天）', '一年半', '两年'],
    answer: 1,
    explanation: '斯科特·凯利在空间站连续驻留了340天，接近一年，目的是研究长期太空飞行对人体的影响。'
  },
  {
    id: 'q029',
    category: 'astronauts',
    difficulty: '困难',
    question: '聂海胜共执行了几次载人航天飞行任务？',
    options: ['1次', '2次', '3次', '4次'],
    answer: 2,
    explanation: '聂海胜先后执行了神舟六号、神舟十号、神舟十二号三次飞行任务，是中国执行任务次数最多的航天员之一。'
  },
  {
    id: 'q030',
    category: 'astronauts',
    difficulty: '困难',
    question: '人类单次太空飞行时间最长纪录保持者是？',
    options: ['斯科特·凯利', '波利亚科夫', '加加林', '阿姆斯特朗'],
    answer: 1,
    explanation: '俄罗斯宇航员波利亚科夫医生1994-1995年在和平号空间站连续驻留438天，创造了人类单次太空飞行时间最长纪录。'
  },

  {
    id: 'q031',
    category: 'basics',
    difficulty: '简单',
    question: '第一宇宙速度大约是多少？',
    options: ['7.9公里/秒', '11.2公里/秒', '16.7公里/秒', '20公里/秒'],
    answer: 0,
    explanation: '第一宇宙速度（环绕速度）约7.9公里/秒，是物体贴近地球表面做圆周运动所需的速度。'
  },
  {
    id: 'q032',
    category: 'basics',
    difficulty: '简单',
    question: '第二宇宙速度又称什么？',
    options: ['环绕速度', '逃逸速度', '太阳系速度', '银河系速度'],
    answer: 1,
    explanation: '第二宇宙速度又称"逃逸速度"，约11.2公里/秒，是挣脱地球引力束缚所需的最小速度。'
  },
  {
    id: 'q033',
    category: 'basics',
    difficulty: '中等',
    question: '地球同步轨道的轨道高度约为多少？',
    options: ['400公里', '2,000公里', '20,000公里', '35,786公里'],
    answer: 3,
    explanation: '地球同步轨道在赤道上空约35,786公里处，卫星公转周期与地球自转周期相等。'
  },
  {
    id: 'q034',
    category: 'basics',
    difficulty: '中等',
    question: '太空中"失重"的真正原因是什么？',
    options: ['太空中没有引力', '航天器在自由落体', '引力被离心力抵消', '太空气体浮力'],
    answer: 1,
    explanation: '太空中的"失重"不是因为没有引力，而是航天器和其中的一切以相同加速度自由落体，产生了相对"失重"的效果。'
  },
  {
    id: 'q035',
    category: 'basics',
    difficulty: '中等',
    question: '火箭推进的基本原理遵循哪条物理定律？',
    options: ['牛顿第一定律', '牛顿第二定律', '牛顿第三定律', '万有引力定律'],
    answer: 2,
    explanation: '火箭推进遵循牛顿第三定律——向后高速喷出燃气，获得向前的反作用力。'
  },
  {
    id: 'q036',
    category: 'basics',
    difficulty: '困难',
    question: '火星探测器的发射窗口大约每隔多久出现一次？',
    options: ['1个月', '6个月', '26个月', '10年'],
    answer: 2,
    explanation: '火星发射窗口每26个月才出现一次，因为需要火星与地球处于特定的相对位置。这就是各国探测器集中在同一时期发射的原因。'
  },
  {
    id: 'q037',
    category: 'basics',
    difficulty: '困难',
    question: '第三宇宙速度是飞出什么所需的逃逸速度？',
    options: ['地球', '月球', '太阳系', '银河系'],
    answer: 2,
    explanation: '第三宇宙速度约16.7公里/秒，是飞出太阳系引力束缚所需的最小速度。'
  },
  {
    id: 'q038',
    category: 'basics',
    difficulty: '困难',
    question: '开普勒第二定律（面积定律）意味着天体在什么位置运动得更快？',
    options: ['近点', '远点', '不受影响', '取决于天体类型'],
    answer: 0,
    explanation: '开普勒第二定律——天体与中心天体连线在等时间内扫过等面积——意味着天体在近点附近运动更快，远点附近更慢。'
  }
]

const { newQuizList } = require('./quiz-new.js')
const allQuizList = [...quizList, ...newQuizList]

module.exports = {
  quizList: allQuizList
}
