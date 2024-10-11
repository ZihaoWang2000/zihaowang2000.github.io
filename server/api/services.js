import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return [
    {
      id: 1,
      title: {
        en: 'Multimedia Technology',
        id_ID:'多媒体技术',
      },
      description: {
        en: 'I like to explore multimedia technology such as graphic design, video clip, and effects making.',
        id_ID: '我喜欢探索诸如平面设计、视频剪辑与特效制作之类的多媒体技术。',
      },
      icon: 'devicon:photoshop',
      image: null,
    },
    {
      id: 2,
      title: {
        en: 'Data Analysis',
        id_ID:'数据分析',
      },
      description: {
        en: 'I\'m willing to provide insight into business-related problems with data analysis.',
        id_ID: '我愿意通过数据分析以洞悉业务相关的问题。',
      },
      icon: 'devicon:jupyter',
      image: null,
    },
    {
      id: 3,
      title: {
        en: 'Sustainability',
        id_ID:'可持续发展',
      },
      description: {
        en: 'ESG is the wisest investment.',
        id_ID: ' ESG是最有前瞻性的投资。',
      },
      icon: 'noto:globe-showing-americas',
      image: null,
    },
    {
      id: 4,
      title: {
        en: 'Travel',
        id_ID:'旅行',
      },
      description: {
        en: 'Travelling to all over the world is one of my dreams.',
        id_ID: '环游世界也是我的梦想之一。',
      },
      icon: 'logos:google-maps',
      image: null,
    },
  ]
})
