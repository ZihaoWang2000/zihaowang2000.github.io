import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return [
    {
      id: 1,
      location: {
        en: 'IMD Campus',
        id_ID: 'IMD校园',
      },
      time: {
        en: 'January 29, 2024',
        id_ID: '2024年1月29日',
      },
      title: {
        en: 'Transformative Project Presentation',
        id_ID: '变革性项目演示',
      },
      image: 'https://raw.githubusercontent.com/ZihaoWang2000/MyPhoto/main/DSC00206.jpg',
    },
    {
      id: 2,
      location: {
        en: 'IMD Campus',
        id_ID: 'IMD校园',
      },
      time: {
        en: 'January 29, 2024',
        id_ID: '2024年1月29日',
      },
      title: {
        en: 'Transformative Project Presentation',
        id_ID: '变革性项目演示',
      },
      image: 'https://raw.githubusercontent.com/ZihaoWang2000/MyPhoto/main/DSC00610.jpg',
    },
  ]
})
