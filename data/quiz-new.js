/**
 * 航天知识库 - 2024-2026年新增问答题目
 */

const newQuizList = [
  {
    id: 'q039',
    category: 'history',
    difficulty: '简单',
    question: '嫦娥六号创造了什么航天"首次"？',
    options: ['首次月球采样返回', '首次月球背面采样返回', '首次月球南极着陆', '首次月面发射起飞'],
    answer: 1,
    explanation: '2024年嫦娥六号实现了人类首次月球背面采样返回，带回1935.3克月球背面样品。'
  },
  {
    id: 'q040',
    category: 'spacecraft',
    difficulty: '中等',
    question: 'SpaceX星舰的超重型助推器用什么方式回收？',
    options: ['海面软着陆', '降落伞减速', '发射塔"筷子臂"接住', '跑道水平着陆'],
    answer: 2,
    explanation: '2024年10月第五次试飞中，超重型助推器被发射塔架上的"筷子臂"（Mechazilla）精确接住，实现了发射塔回收。'
  },
  {
    id: 'q041',
    category: 'history',
    difficulty: '中等',
    question: '波音星际客机首次载人试飞导致了什么后果？',
    options: ['任务圆满成功', '宇航员滞留空间站超9个月', '飞船未能发射', '飞船对接失败'],
    answer: 1,
    explanation: '推进器故障和氦气泄漏导致NASA决定让星际客机空载返回，两名宇航员滞留ISS超过9个月后乘SpaceX龙飞船返回。'
  },
  {
    id: 'q042',
    category: 'solar-system',
    difficulty: '中等',
    question: '欧罗巴快船探测器的目标天体是？',
    options: ['火星', '土卫六', '木卫二', '谷神星'],
    answer: 2,
    explanation: '欧罗巴快船2024年发射，前往木星的卫星木卫二（欧罗巴），探测其冰壳下可能存在的液态海洋。'
  },
  {
    id: 'q043',
    category: 'spacecraft',
    difficulty: '简单',
    question: '星链计划的主要目标是什么？',
    options: ['载人登月', '提供全球卫星互联网服务', '深空探测', '军事侦察'],
    answer: 1,
    explanation: '星链是SpaceX的低轨卫星互联网星座，截至2024年已部署超6000颗卫星，为100多个国家提供服务。'
  },
  {
    id: 'q044',
    category: 'basics',
    difficulty: '中等',
    question: '月球门户站（Gateway）是什么类型的设施？',
    options: ['月球表面基地', '月球轨道空间站', '地球轨道空间站', '火星中转站'],
    answer: 1,
    explanation: '门户站是环绕月球运行的小型有人照料空间站，作为载人登月的中转站和月球轨道科学平台。'
  },
  {
    id: 'q045',
    category: 'basics',
    difficulty: '简单',
    question: '阿耳忒弥斯协定是关于什么的国际框架？',
    options: ['火星探索合作', '太空资源利用行为准则', '空间碎片清理', '卫星频率分配'],
    answer: 1,
    explanation: '阿耳忒弥斯协定是NASA主导的国际太空合作原则，截至2024年已有40多个国家签署，确立了太空资源利用等行为准则。'
  },
  {
    id: 'q046',
    category: 'spacecraft',
    difficulty: '困难',
    question: '朱雀二号火箭创造了什么世界"首次"？',
    options: ['首枚可重复使用火箭', '首枚液氧甲烷火箭成功入轨', '首枚民营火箭入轨', '首枚海上发射火箭'],
    answer: 1,
    explanation: '2023年12月蓝箭航天朱雀二号成功入轨，成为全球第一枚成功将载荷送入轨道的液氧甲烷火箭。'
  },
  {
    id: 'q047',
    category: 'astronauts',
    difficulty: '困难',
    question: '波音星际客机故障导致宇航员在ISS滞留了多长时间？',
    options: ['约8天', '约3个月', '约6个月', '超过9个月'],
    answer: 3,
    explanation: '威尔莫尔和威廉姆斯原计划驻留8天，因星际客机故障最终滞留超过9个月，2025年3月乘龙飞船返回。'
  },
  {
    id: 'q048',
    category: 'basics',
    difficulty: '中等',
    question: '三体计算星座属于哪一类人造卫星？',
    options: ['通信卫星', '导航卫星', '计算卫星', '遥感卫星'],
    answer: 2,
    explanation: '三体计算星座开创了继通信、导航、遥感卫星之后的第四类人造卫星——计算卫星，实现在轨数据处理。'
  },
  {
    id: 'q049',
    category: 'spacecraft',
    difficulty: '简单',
    question: '中国可重复使用试验航天器的着陆方式是？',
    options: ['伞降海溅', '跑道水平着陆', '垂直着陆', '直升机空中回收'],
    answer: 1,
    explanation: '中国可重复使用试验航天器类似美国X-37B，由火箭垂直发射入轨，返回时像飞机一样在跑道上水平着陆。'
  },
  {
    id: 'q050',
    category: 'solar-system',
    difficulty: '困难',
    question: '韦伯望远镜发现的最遥远星系JADES-GS-z14-0的光来自宇宙诞生后约多久？',
    options: ['约1亿年', '约3亿年', '约5亿年', '约10亿年'],
    answer: 1,
    explanation: 'JADES-GS-z14-0的光来自宇宙诞生后仅约3亿年，是已知最遥远的星系。'
  },
  {
    id: 'q051',
    category: 'basics',
    difficulty: '中等',
    question: '可重复使用火箭的主要经济价值是？',
    options: ['减轻火箭重量', '分摊制造成本到多次发射', '提高载荷能力', '减少发射审批'],
    answer: 1,
    explanation: '回收并重复使用火箭主体，将数千万美元的制造成本分摊到多次发射中，可降低发射成本约10倍。'
  },
  {
    id: 'q052',
    category: 'history',
    difficulty: '中等',
    question: '阿耳忒弥斯计划选择什么作为载人登月着陆器？',
    options: ['蓝色起源蓝月亮', 'SpaceX星舰', '波音星际客机', 'NASA自研着陆器'],
    answer: 1,
    explanation: 'NASA选择SpaceX星舰作为阿耳忒弥斯3号载人登月的着陆器，星舰在月球轨道与猎户座对接后将宇航员送到月面。'
  },
  {
    id: 'q053',
    category: 'astronauts',
    difficulty: '中等',
    question: '桂海潮在中国载人航天中创造了什么"首次"？',
    options: ['首位90后航天员', '首位载荷专家航天员', '首位出舱航天员', '首位女性航天员'],
    answer: 1,
    explanation: '2023年桂海潮作为首位载荷专家航天员乘神舟十六号飞天，打破了纯飞行员背景的传统，是工程师/学者飞天的开端。'
  }
]

module.exports = {
  newQuizList
}
