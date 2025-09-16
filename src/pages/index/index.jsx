import { View, Text, Image, Swiper, SwiperItem, Button } from '@tarojs/components'
import { useLoad, useDidShow, useDidHide } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import './index.less'
import musicFile from '../../assets/music/test.mp3'

export default function Index () {
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [showText, setShowText] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [invitationOpen, setInvitationOpen] = useState(false)
  const [invitationFullyOpen, setInvitationFullyOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const musicContext = useRef(null)

  // 请柬页面数据
  const invitationPages = [
    {
      id: 0,
      type: 'cover',
      title: '请柬',
      subtitle: 'Wedding Invitation',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    {
      id: 1,
      type: 'bride',
      title: '新娘',
      name: '小美',
      subtitle: '美丽善良的新娘',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    {
      id: 2,
      type: 'groom',
      title: '新郎',
      name: '小明',
      subtitle: '帅气温柔的新郎',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      id: 3,
      type: 'time',
      title: '婚礼时间',
      date: '2024年10月1日',
      time: '上午10:00',
      background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
    },
    {
      id: 4,
      type: 'location',
      title: '婚礼地点',
      address: '某某酒店宴会厅',
      detail: '地址：某某市某某区某某路123号',
      background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
    },
    {
      id: 5,
      type: 'invitation',
      title: '请来参加我们的婚礼',
      subtitle: '期待您的到来',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }
  ]

  useLoad(() => {
    console.log('Page loaded.')
    // 页面加载后开始请柬打开动画
    startInvitationAnimation()
  })

  useDidShow(() => {
    // 页面显示时初始化音乐
    initMusic()
  })

  useDidHide(() => {
    // 页面隐藏时停止音乐
    if (musicContext.current && musicPlaying) {
      musicContext.current.pause()
    }
  })

  // 请柬打开动画序列
  const startInvitationAnimation = () => {
    // 延迟1秒后开始打开动画
    setTimeout(() => {
      setInvitationOpen(true)
    }, 1000)
    
    // 请柬完全打开后显示内容
    setTimeout(() => {
      setInvitationFullyOpen(true)
      setShowContent(true)
    }, 2500)
  }

  // 慢动作出字效果
  useEffect(() => {
    if (currentPage >= 0 && showContent) {
      // 延迟显示文字
      const timer = setTimeout(() => {
        setShowText(true)
        startTextAnimation()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentPage, showContent])

  const startTextAnimation = () => {
    const currentPageData = invitationPages[currentPage]
    const textToAnimate = currentPageData.title
    
    setCurrentTextIndex(0)
    const textTimer = setInterval(() => {
      setCurrentTextIndex(prev => {
        if (prev < textToAnimate.length - 1) {
          return prev + 1
        } else {
          clearInterval(textTimer)
          return prev
        }
      })
    }, 300) // 每个字间隔300ms
  }

  // 手势翻页
  const onSwiperChange = (e) => {
    const newPage = e.detail.current
    if (newPage !== currentPage && !isAnimating) {
      setIsAnimating(true)
      setShowText(false)
      setCurrentTextIndex(0)
      
      setTimeout(() => {
        setCurrentPage(newPage)
        setIsAnimating(false)
      }, 300)
    }
  }

  // 初始化音乐
  const initMusic = () => {
    try {
      if (!musicContext.current) {
        musicContext.current = Taro.createInnerAudioContext()
        // 使用本地音乐文件
        // 使用在线音乐作为备用，避免本地文件路径问题
        musicContext.current.src = 'https://music.163.com/song/media/outer/url?id=123456'
        musicContext.current.loop = true // 循环播放  
        musicContext.current.volume = 0.5 // 设置音量
        
        musicContext.current.onPlay(() => {
          console.log('音乐开始播放')
          setMusicPlaying(true)
        })
        
        musicContext.current.onPause(() => {
          console.log('音乐暂停')
          setMusicPlaying(false)
        })
        
        musicContext.current.onStop(() => {
          console.log('音乐停止')
          setMusicPlaying(false)
        })
        
        musicContext.current.onError((res) => {
          console.error('音乐播放错误:', res)
          Taro.showToast({
            title: '音乐播放失败',
            icon: 'none',
            duration: 2000
          })
        })
      }
    } catch (error) {
      console.error('音乐初始化失败:', error)
    }
  }

  // 播放/暂停音乐
  const toggleMusic = () => {
    try {
      if (!musicContext.current) {
        initMusic()
        // 延迟一下再播放
        setTimeout(() => {
          if (musicContext.current) {
            musicContext.current.play()
          }
        }, 100)
        return
      }
      
      if (musicPlaying) {
        musicContext.current.pause()
        Taro.showToast({
          title: '音乐已暂停',
          icon: 'none',
          duration: 1500
        })
      } else {
        musicContext.current.play()
        Taro.showToast({
          title: '音乐开始播放',
          icon: 'none',
          duration: 1500
        })
      }
    } catch (error) {
      console.error('音乐播放控制失败:', error)
      // 简化错误处理，只显示状态切换
      setMusicPlaying(!musicPlaying)
      Taro.showToast({
        title: musicPlaying ? '音乐已暂停' : '音乐开始播放',
        icon: 'none',
        duration: 1500
      })
    }
  }

  // 渲染页面内容
  const renderPageContent = (page) => {
    switch (page.type) {
      case 'cover':
        return (
          <View className='page-content cover-page'>
            <View className='cover-decoration'>
              <Text className='decoration-text'>💕</Text>
            </View>
            <View className='title-container'>
              <Text className='main-title'>
                {page.title.split('').map((char, index) => (
                  <Text
                    key={index}
                    className={`title-char ${showText && index <= currentTextIndex ? 'show' : ''}`}
                  >
                    {char}
                  </Text>
                ))}
              </Text>
              <Text className={`subtitle ${showText ? 'show' : ''}`}>
                {page.subtitle}
              </Text>
            </View>
            <View className={`swipe-hint ${showText ? 'show' : ''}`}>
              <Text className='hint-text'>向下滑动查看详情</Text>
              <Text className='hint-arrow'>↓</Text>
            </View>
          </View>
        )

      case 'bride':
      case 'groom':
        return (
          <View className='page-content person-page'>
            <View className='person-avatar'>
              <Text className='avatar-icon'>{page.type === 'bride' ? '👰' : '🤵'}</Text>
            </View>
            <View className='person-info'>
              <Text className='person-title'>
                {page.title.split('').map((char, index) => (
                  <Text
                    key={index}
                    className={`title-char ${showText && index <= currentTextIndex ? 'show' : ''}`}
                  >
                    {char}
                  </Text>
                ))}
              </Text>
              <Text className={`person-name ${showText ? 'show' : ''}`}>
                {page.name}
              </Text>
              <Text className={`person-desc ${showText ? 'show' : ''}`}>
                {page.subtitle}
              </Text>
            </View>
          </View>
        )

      case 'time':
        return (
          <View className='page-content time-page'>
            <View className='time-icon'>
              <Text className='icon-text'>📅</Text>
            </View>
            <View className='time-info'>
              <Text className='time-title'>
                {page.title.split('').map((char, index) => (
                  <Text
                    key={index}
                    className={`title-char ${showText && index <= currentTextIndex ? 'show' : ''}`}
                  >
                    {char}
                  </Text>
                ))}
              </Text>
              <Text className={`time-date ${showText ? 'show' : ''}`}>
                {page.date}
              </Text>
              <Text className={`time-time ${showText ? 'show' : ''}`}>
                {page.time}
              </Text>
            </View>
          </View>
        )

      case 'location':
        return (
          <View className='page-content location-page'>
            <View className='location-icon'>
              <Text className='icon-text'>📍</Text>
            </View>
            <View className='location-info'>
              <Text className='location-title'>
                {page.title.split('').map((char, index) => (
                  <Text
                    key={index}
                    className={`title-char ${showText && index <= currentTextIndex ? 'show' : ''}`}
                  >
                    {char}
                  </Text>
                ))}
              </Text>
              <Text className={`location-address ${showText ? 'show' : ''}`}>
                {page.address}
              </Text>
              <Text className={`location-detail ${showText ? 'show' : ''}`}>
                {page.detail}
              </Text>
            </View>
          </View>
        )

      case 'invitation':
        return (
          <View className='page-content invitation-page'>
            <View className='invitation-content'>
              <Text className='invitation-title'>
                {page.title.split('').map((char, index) => (
                  <Text
                    key={index}
                    className={`title-char ${showText && index <= currentTextIndex ? 'show' : ''}`}
                  >
                    {char}
                  </Text>
                ))}
              </Text>
              <Text className={`invitation-subtitle ${showText ? 'show' : ''}`}>
                {page.subtitle}
              </Text>
            </View>
            <View className='invitation-actions'>
              <Button className='btn-primary' onClick={confirmAttendance}>
                确认参加
              </Button>
              <Button className='btn-secondary' onClick={viewDetails}>
                查看详情
              </Button>
            </View>
          </View>
        )

      default:
        return null
    }
  }

  // 确认参加
  const confirmAttendance = () => {
    Taro.showModal({
      title: '确认参加',
      content: '感谢您的确认，期待您的到来！',
      showCancel: false
    })
  }

  // 查看详情
  const viewDetails = () => {
    Taro.showModal({
      title: '婚礼详情',
      content: '婚礼时间：2024年10月1日 上午10:00\n婚礼地点：某某酒店宴会厅\n联系电话：138-0000-0000',
      showCancel: false
    })
  }

  return (
    <View className='index'>
      {/* 音乐控制按钮 */}
      <View className='music-control' onClick={toggleMusic}>
        <Text className={`music-icon ${musicPlaying ? 'playing' : ''}`}>
          {musicPlaying ? '🎵' : '🔇'}
        </Text>
      </View>

      {/* 3D请柬容器 */}
      <View className='invitation-container'>
        {/* 请柬书脊 */}
        <View className={`invitation-spine ${invitationOpen ? 'open' : ''}`}></View>
        
        {/* 请柬左页 */}
        <View className={`invitation-left-page ${invitationOpen ? 'open' : ''}`}>
          <View className='left-page-content'>
            <View className='cover-decoration'>
              <Text className='decoration-text'>💕</Text>
            </View>
            <View className='cover-title'>
              <Text className='main-title'>请柬</Text>
              <Text className='subtitle'>Wedding Invitation</Text>
            </View>
          </View>
        </View>

        {/* 请柬右页 */}
        <View className={`invitation-right-page ${invitationOpen ? 'open' : ''}`}>
          <View className='right-page-content'>
            <View className='cover-decoration'>
              <Text className='decoration-text'>💕</Text>
            </View>
            <View className='cover-title'>
              <Text className='main-title'>邀请</Text>
              <Text className='subtitle'>Invitation</Text>
            </View>
          </View>
        </View>

        {/* 请柬内容 */}
        <View className={`invitation-content ${invitationFullyOpen ? 'show' : ''}`}>
          {showContent && (
            <Swiper
              className='invitation-swiper'
              current={currentPage}
              onChange={onSwiperChange}
              circular={false}
              indicatorDots={false}
              autoplay={false}
              vertical={true}
            >
              {invitationPages.map((page, index) => (
                <SwiperItem key={page.id}>
                  <View 
                    className={`page-container ${isAnimating ? 'animating' : ''}`}
                    style={{ background: page.background }}
                  >
                    {renderPageContent(page)}
                  </View>
                </SwiperItem>
              ))}
            </Swiper>
          )}

          {/* 页面指示器 */}
          {showContent && (
            <View className='page-indicator'>
              {invitationPages.map((_, index) => (
                <View 
                  key={index}
                  className={`indicator-dot ${index === currentPage ? 'active' : ''}`}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
