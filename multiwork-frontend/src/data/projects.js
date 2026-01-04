import logo1 from '../assets/svg/projects/logo1.svg'
import logo2 from '../assets/svg/projects/logo2.svg'
import logo3 from '../assets/svg/projects/logo3.svg'
import logo4 from '../assets/svg/projects/logo4.svg'
import logo5 from '../assets/svg/projects/logo5.svg'

const magenta = '#D1085B'
const green = '#39AA8F'
const blue = '#4ED9EC'
const golden = '#FEB700'

const projects = [
  {
    id: 0,
    logo: logo1,
    title: 'IT Sprout',
    desc: 'New dual education system. Transformation of education into your dream IT profession. We help you succeed in your career, as well as increase your experience and showcase your expertise in modern technologies.',
    status: 'In Progress',
    color: green,
    members: 24,
    joined: true
  },
  {
    id: 1,
    logo: logo2,
    title: 'B.A.B.L.O Biz',
    desc: 'Best Advice for Business Launch Optimization. Use A.I. to instantly see how your business can succeed, and what to watch out for',
    status: 'Finished',
    color: golden,
    members: 8,
    joined: true
  },
  {
    id: 2,
    logo: logo3,
    title: 'HeyBoss',
    desc: 'Join HeyBoss today and unlock new opportunities for your team. Our platform is ready to help you achieve success and bring your most ambitious projects to life',
    status: 'Pivot',
    color: magenta,
    members: 5,
    joined: true
  },
  {
    id: 3,
    logo: logo4,
    title: 'eSupport',
    desc: 'Our scouts analyze the profiles of specialists on the platform, looking for suitable direct contracts from international clients, and receive a fee from specialists for their work',
    status: 'In Progress',
    color: green,
    members: 4,
    joined: false
  },
  {
    id: 4,
    logo: logo5,
    title: 'CourseGarden',
    desc: "AI-Assistant that can create a complete mini-course. Whether you're a teacher, trainer, or just someone who wants to share knowledge, our mini-courses are the perfect solution for creating engaging and informative content",
    status: 'New',
    color: blue,
    members: 3,
    joined: false
  },
]
export default projects
