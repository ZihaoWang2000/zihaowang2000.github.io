import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return [
    {
      id: 1,
      description: {
        en: 'Hi there! I\'m currently a master\'s student in EPFL, UNIL-HEC and IMD. I\'m equipped with knowledge about technology and management and am very interested in multimedia production and applications.',
        id_ID: '哈喽！我目前是瑞士洛桑联邦理工学院、洛桑大学商学院以及瑞士国际发展与管理学院联合培养项目的硕士生，我对数字化技术和商业结合的新趋势非常感兴趣，并且也很热衷于多媒体创作与应用。',
      },
    },
    {
      id: 2,
      description: {
        en: 'I\'m a hardworking guy when it comes to study and research, and have always got enthusiam for the future. Day Dreamer could be possibly suitable to describe me, but those dreams are in the meanwhile motivating me to be better, and I believe I will realize them at last.',
        id_ID: '我是一个谈及学习和研究时就会变得很勤奋的人，并且对未来始终充满热情。用“白日梦想家”来形容我或许很合适，但这些梦想同时也激励着我变得更好，我相信我千里之行始于足下，也非常愿意为之而奋斗。',
      },
    },
  ]
})
