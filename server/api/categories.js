import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return [
    {
      id: 1,
      title: {
        en: 'Research',
        id_ID: '科研项目',
      },
    },
    {
      id: 2,
      title: {
        en: 'Coding',
        id_ID: '编程项目',
      },
    },
    {
      id: 3,
      title: {
        en: 'Multimedia',
        id_ID: '多媒体项目',
      },
    },
  ]
})
