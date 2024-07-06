import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return [
    {
      id: 1,
      title: {
        en: 'Identifying Seasonal Snacking Patterns and Routines',
        id_ID: '利用众包饮食记录识别季节性零食模式和惯例',
      },
      category: {
        id: 1, //see categories.js
        date: {
          en: 'Present',
          id_ID: '进行中',
        },
        title: {
          en: 'Research',
          id_ID: '科研项目',
        },
      },
      content: {
        en: 'This study emphasizes on identifying the seasonal snacking patterns and routines on the basis of dietary logging data collected through mobile surveys in the Netherlands.',
        id_ID: '该研究着重于根据荷兰移动调查收集的饮食记录数据来确定季节性零食模式和惯例。',
      },
      desc: {
          en: 'View Project',
          id_ID: '查看项目',
        },
      image: '/images/foodloop.png',
      url: 'https://www.wur.nl/nl/onderzoek-resultaten/leerstoelgroepen/agrotechnologie-en-voedselwetenschappen/levensmiddelentechnologie/food-quality-and-design-1/foodloop/het-foodloop-onderzoek.htm',
    },
    {
      id: 2,
      title: {
        en: 'Logitech: Sustainable Product-Service System Design',
        id_ID: '罗技：针对赛车模拟设备的可持续产品–服务系统设计',
      },
      category: {
        id: 1, //see categories.js
        date: {
          en: 'January 2024',
          id_ID: '2024年1月',
        },
        title: {
          en: 'Research',
          id_ID: '科研项目',
        },
      },
      content: {
        en: 'The focus of this project is on the transition from current models of Logitech G racing sim gears to Product-Service Systems (PSS) to promote circular economy principles.',
        id_ID: '该项目的重点是从罗技G赛车模拟器的当前商业模型过渡到产品服务系统 (PSS)，以满足循环经济原则。',
      },
      desc: {
          en: 'View Project',
          id_ID: '查看项目',
        },
      image: '/images/TP.png',
      url: 'https://e4s.center/education/e4s-smt-master/transformative-projects/2022-2024-transformative-projects/transformative-projects-2024-logitech/',
    },
    {
      id: 3,
      title: {
        en: 'CatchUP: An Online MCQs Generator',
        id_ID: 'CatchUP：一个在线多选题生成器',
      },
      category: {
        id: 2, //see categories.js
        date: {
          en: 'November 2023',
          id_ID: '2023年11月',
        },
        title: {
          en: 'Coding',
          id_ID: '编程项目',
        },
      },
      content: {
        en: 'This is a minimum viable product (MVP) of MCQ generators. ChatPDF API is called to create this website.',
        id_ID: '这是多选题生成器的最小可行产品 (MVP)，建设网站的过程中调用了ChatPDF的API。',
      },
      desc: {
          en: 'View Project',
          id_ID: '查看项目',
        },
      image: '/images/catchup.png',
      url: 'https://github.com/ZihaoWang2000/CatchUP-MCQs-Generator-MVP',
    },
    {
      id: 4,
      title: {
        en: 'French Text Classification',
        id_ID: '法语文本分类',
      },
      category: {
        id: 2, //see categories.js
        date: {
          en: 'June 2023',
          id_ID: '2023年11月',
        },
        title: {
          en: 'Coding',
          id_ID: '编程项目',
        },
      },
      content: {
        en: 'This is a classification task for french text difficulty. Big language model such as BERT is leveraged.',
        id_ID: '这是法语文本难度的分类任务，文本特征提取的过程中使用了如BERT之类的大语言模型。',
      },
      desc: {
          en: 'View Project',
          id_ID: '查看项目',
        },
      image: '/images/french.png',
      url: 'https://github.com/ZihaoWang2000/French-Text-Classification',
    },
    {
      id: 5,
      title: {
        en: 'MG Animation for Bulgari Contest',
        id_ID: '用于宝格丽比赛的MG宣传动画',
      },
      category: {
        id: 3, //see categories.js
        date: {
          en: 'April 2023',
          id_ID: '2023年4月',
        },
        title: {
          en: 'Multimedia',
          id_ID: '多媒体项目',
        },
      },
      content: {
        en: 'The MG animation is made using AE templates to showcase the business plans, whereas are not used for commercial purposes.',
        id_ID: 'MG动画是使用AE模板制作的，用于展示商业计划，但不用作商业用途。',
      },
      desc: {
          en: 'Not Available',
          id_ID: '暂不可用',
        },
      image: '/images/bulgari.png',
      url: null,
    },
    {
      id: 6,
      title: {
        en: 'Bachelor Graduation Commemorative Video',
        id_ID: '本科毕业纪念视频',
      },
      category: {
        id: 3, //see categories.js
        date: {
          en: 'June 2022',
          id_ID: '2022年6月',
        },
        title: {
          en: 'Multimedia',
          id_ID: '多媒体项目',
        },
      },
      content: {
        en: 'In 2024, when I was faced with a new media event planning topic and looked at the camera in my hand, my mind drifted back to 2018 - that college time filled with youth, sweat, laughter and regret. And I seem to have followed my thoughts and returned to that year... I hope that this time I will have no regrets.',
        id_ID: '2024年，当我面对着一个新媒体的活动策划题目，看着手中的相机，思绪飘回了2018年——那段带着青春、汗水、欢笑和遗憾的大学时光。而我，似乎也跟随着我的思绪，回到了那一年……希望重回的这一次，不再有遗憾。',
      },
      desc: {
          en: 'View Project',
          id_ID: '查看项目',
        },
      image: '/images/graduation.png',
      url: 'https://www.bilibili.com/video/BV1Xf4y1o7ZT/?spm_id_from=333.999.0.0&vd_source=304bb866d2c2e8d8e5c808c8c369891f',
    },
    {
      id: 7,
      title: {
        en: 'Research on Answer Characteristics and User Knowledge Demands of Social Q&A Community',
        id_ID: '社会化问答社区回答特征与用户知识需求研究',
      },
      category: {
        id: 1, //see categories.js
        date: {
          en: 'April 2022',
          id_ID: '2022年4月',
        },
        title: {
          en: 'Research',
          id_ID: '科研项目',
        },
      },
      content: {
        en: 'This research conducted statistical and sentiment analysis of characteristic indicators of answers under distinct topics, to reveal basic characteristic difference, and utilized social network analysis and text clustering to analyze the co-occurrence characteristics of high-frequency words and the correlation between users\' sentiment tendencies and high-frequency words. The thesis is awarded the outstanding thesis of the cohort.',
        id_ID: '本研究对不同主题下答案的特征指标进行统计和情感分析，揭示基本特征差异，并利用社交网络分析和文本聚类分析高频词的共现特征和用户情感之间的相关性趋势和高频词。论文获得了专业优秀论文的荣誉。',
      },
      desc: {
          en: 'View Project',
          id_ID: '查看项目',
        },
      image: '/images/bachelor.jpg',
      url: 'https://github.com/ZihaoWang2000/Zhihu_Crawler_Analysis',
    },
    {
      id: 8,
      title: {
        en: 'Research on the User Behavior in Academic Social Networking Sites',
        id_ID: '学术社交网络用户行为研究',
      },
      category: {
        id: 1, //see categories.js
        date: {
          en: 'January 2022',
          id_ID: '2022年1月',
        },
        title: {
          en: 'Research',
          id_ID: '科研项目',
        },
      },
      content: {
        en: 'This study shortlisted the top 5 institutions in industry, university and research field respectively that were released by Nature Index as the research objects with the extracted data from ResearchGate, in order to study the user behavior (questioning and answering) in academic social networking sites.',
        id_ID: '本研究利用ResearchGate提取的数据，分别选取Nature Index发布的产学研领域排名前5位的机构作为研究对象，研究学术社交网站中的用户行为（即提问和回答）。',
      },
      desc: {
          en: 'View Project',
          id_ID: '查看项目',
        },
      image: '/images/aslib.png',
      url: 'https://doi.org/10.1108/AJIM-05-2021-0141',
    },
    {
      id: 9,
      title: {
        en: 'Bizhuang: A Cosmetics Price Comparison WeChat Mini-App',
        id_ID: '比妆：化妆品比价微信小程序',
      },
      category: {
        id: 2, //see categories.js
        date: {
          en: 'June 2021',
          id_ID: '2021年6月',
        },
        title: {
          en: 'Coding',
          id_ID: '编程项目',
        },
      },
      content: {
        en: 'This platform covers the main functions of user registration, products searching, comparison of the similar products\' prices across the entire network, and visualization of the historical price of a product, etc.',
        id_ID: '该平台涵盖了用户注册、商品搜索、全网同类商品价格对比、商品历史价格可视化等主要功能。',
      },
      desc: {
          en: 'View Project',
          id_ID: '查看项目',
        },
      image: '/images/bizhuang.gif',
      url: 'https://github.com/ZihaoWang2000/WechatMiniprogram',
    },
  ]
})
