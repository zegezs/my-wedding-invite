// 婚礼配置信息
export const weddingConfig = {
  // 新郎信息
  groom: {
    name: '张明',
    englishName: 'Ming Zhang',
    photo: 'https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/boy.jpg'
  },
  
  // 新娘信息
  bride: {
    name: '李美',
    englishName: 'Mei Li',
    photo: 'https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/girl.jpg'
  },
  
  // 婚礼信息
  wedding: {
    date: '2025年10月3日',
    englishDate: 'October 1st, 2024',
    time: '10:00 AM',
    location: '某某酒店宴会厅',
    address: '地址：某某市某某区某某路123号',
    
    // 图片配置
    background: 'https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/main.jpg', // 页面背景图
    shareImage: 'https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/red.jpg', // 分享专用图片
    
    // 音乐配置
    music: {
      src: 'https://www.w3schools.com/html/horse.mp3',
      volume: 0.3,
      loop: true
    },
    
    // 文案配置
    quotes: [
      '爱情是一种永恒的力量，它让两颗心合二为一',
      '执子之手，与子偕老',
      '愿得一人心，白首不相离'
    ],
    
    // 照片集配置
    photoGallery: [
      {
        id: 1,
        type: 'couple',
        title: '我们的相遇',
        subtitle: '第一次见面',
        image: 'https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/main.jpg',
        description: '在那个阳光明媚的午后，我们第一次相遇，仿佛整个世界都亮了起来。'
      },
      {
        id: 2,
        type: 'bride',
        title: '美丽的新娘',
        subtitle: '李美的婚纱照',
        image: 'https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/girl.jpg',
        description: '穿上婚纱的那一刻，我知道自己是最幸福的女人。'
      },
      {
        id: 3,
        type: 'groom',
        title: '帅气的新郎',
        subtitle: '张明的正装照',
        image: 'https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/boy.jpg',
        description: '今天我要成为最帅的新郎，娶我最爱的女人。'
      },
      {
        id: 4,
        type: 'couple',
        title: '甜蜜的约会',
        subtitle: '我们的第一次约会',
        image: 'https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/red.jpg',
        description: '还记得那个咖啡厅，我们聊到很晚，从那时起我就知道，你就是我要找的人。'
      },
      {
        id: 5,
        type: 'couple',
        title: '甜蜜的约会',
        subtitle: '我们的第一次约会',
        image: 'https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/main.jpg',
        description: '还记得那个咖啡厅，我们聊到很晚，从那时起我就知道，你就是我要找的人。'
      },
      {
        id: 6,
        type: 'couple',
        title: '幸福的准备',
        subtitle: '婚礼筹备中',
        image: 'https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/girl.jpg',
        description: '我们一起挑选婚纱、布置场地，每一个细节都充满了爱意。'
      }
    ]
  }
}

// 分享配置
export const shareConfig = {
  // 分享给好友
  appMessage: {
    title: `${weddingConfig.groom.name} & ${weddingConfig.bride.name}的婚礼邀请函`,
    path: '/pages/index/index',
    imageUrl: weddingConfig.wedding.shareImage
  },
  
  // 分享到朋友圈
  timeline: {
    title: `${weddingConfig.groom.name} & ${weddingConfig.bride.name}的婚礼邀请函 - 诚邀您参加我们的婚礼`,
    imageUrl: weddingConfig.wedding.shareImage
  }
}
