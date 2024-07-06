import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
    const education = [
        {
            id: 1,
            title: {
                en: 'École Polytechnique Fédérale de Lausanne',
                id_ID: '洛桑联邦理工学院',
            },
            date: {
                en: 'Sep 2022 — Oct 2024',
                id_ID: '2022年9月 — 2024年10月',
            },
            location: {
                en: 'Lausanne, Switzerland',
                id_ID: '洛桑，瑞士',
            },
            position: {
                en: 'Master of Science in Sustainable Management and Technology',
                id_ID: '可持续管理与技术理学硕士',
            },
        },
        {
            id: 2,
            title: {
                en: 'Wuhan University',
                id_ID: '武汉大学',
            },
            date: {
                en: 'Sep 2018 — Jun 2022',
                id_ID: '2018年9月 — 2022年6月',
            },
            location: {
                en: 'Wuhan, China',
                id_ID: '武汉，中国',
            },
            position: {
                en: 'Bachelor of Management in Electronic Commerce',
                id_ID: '电子商务管理学学士',
            },
        },
    ];

    const experience = [
        {
            id: 1,
            title: {
                en: 'Idiap Research Institute',
                id_ID: 'Idiap研究中心',
            },
            date: {
                en: 'Feb 2024 — Present',
                id_ID: '2024年2月 — 至今',
            },
            location: {
                en: 'Martigny, Switzerland',
                id_ID: '马尔蒂尼，瑞士',
            },
            position: {
                en: 'Research Intern',
                id_ID: '研究实习生',
            },
        },
        {
            id: 2,
            title: {
                en: 'Logitech G',
                id_ID: '罗技G',
            },
            date: {
                en: 'Sep 2023 — Jan 2024',
                id_ID: '2023年9月 — 2024年1月',
            },
            location: {
                en: 'Lausanne, Switzerland',
                id_ID: '洛桑，瑞士',
            },
            position: {
                en: 'Student Consultant',
                id_ID: '学生顾问',
            },
        },
        {
            id: 3,
            title: {
                en: 'Kincentric',
                id_ID: 'Kincentric凯信睿',
            },
            date: {
                en: 'Dec 2021 — Mar 2022',
                id_ID: '2021年12月 — 2022年3月',
            },
            location: {
                en: 'Guangzhou, China',
                id_ID: '广州，中国',
            },
            position: {
                en: 'Consulting Intern',
                id_ID: '咨询实习生',
            },
        },
        {
            id: 4,
            title: {
                en: 'Wuhan University',
                id_ID: '武汉大学',
            },
            date: {
                en: 'Sep 2020 — Mar 2022',
                id_ID: '2020年9月 — 2022年3月',
            },
            location: {
                en: 'Wuhan, China',
                id_ID: '武汉，中国',
            },
            position: {
                en: 'Research Assistant',
                id_ID: '研究助理',
            },
        },
        {
            id: 5,
            title: {
                en: 'JD.COM',
                id_ID: '京东',
            },
            date: {
                en: 'Jun 2021 — Sep 2021',
                id_ID: '2021年6月 — 2021年9月',
            },
            location: {
                en: 'Wuhan, China',
                id_ID: '武汉，中国',
            },
            position: {
                en: 'Business Analyst Intern',
                id_ID: '商业分析实习生',
            },
        },
    ];
    
    return {
        education,
        experience
    };
})
