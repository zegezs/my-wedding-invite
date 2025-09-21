import { View, Text, Image, Button, Swiper, SwiperItem } from '@tarojs/components'
import { useLoad, useShareAppMessage, useShareTimeline, createInnerAudioContext } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { weddingConfig, shareConfig } from '../../config/wedding'
import './index.less'


export default function Index () {

  // 音乐播放状态
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioContext, setAudioContext] = useState(null)
  const [audioReady, setAudioReady] = useState(false)
  
  // 页面状态
  const [currentPage, setCurrentPage] = useState(0)
  const [showText, setShowText] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [autoPlayTimer, setAutoPlayTimer] = useState(null)

  useLoad(() => {
    console.log('页面加载完成')
    // 初始化音频上下文
    initAudio()
    // 开始文字动画
    startTextAnimation()
    // 延迟3秒后开始自动播放
    setTimeout(() => {
      startAutoPlay()
    }, 3000)
  })

  // 初始化音频
  const initAudio = () => {
    const innerAudioContext = createInnerAudioContext()
    
    // 使用配置文件中的音频源
    innerAudioContext.src = weddingConfig.wedding.music.src
    
    // 音频配置
    innerAudioContext.loop = weddingConfig.wedding.music.loop // 循环播放
    innerAudioContext.volume = weddingConfig.wedding.music.volume // 音量设置
    innerAudioContext.autoplay = false // 禁止自动播放
    
    // 音频事件监听
    innerAudioContext.onCanplay(() => {
      console.log('音频已准备就绪')
      setAudioReady(true)
    })
    
    innerAudioContext.onPlay(() => {
      setIsPlaying(true)
      console.log('音乐开始播放')
    })
    
    innerAudioContext.onPause(() => {
      setIsPlaying(false)
      console.log('音乐暂停')
    })
    
    innerAudioContext.onStop(() => {
      setIsPlaying(false)
      console.log('音乐停止')
    })
    
    innerAudioContext.onError((res) => {
      console.error('音频播放错误：', res)
      setIsPlaying(false)
      setAudioReady(false)
      // 尝试使用备用音频源
      setTimeout(() => {
        innerAudioContext.src = 'https://file-examples.com/storage/fe68c2b3b8491ac9f4abda8/2017/11/file_example_MP3_700KB.mp3'
      }, 1000)
    })
    
    innerAudioContext.onEnded(() => {
      // 音频播放结束时的处理（由于loop=true，这个事件一般不会触发）
      console.log('音频播放结束')
      if (innerAudioContext.loop) {
        innerAudioContext.play()
      } else {
        setIsPlaying(false)
      }
    })
    
    innerAudioContext.onWaiting(() => {
      console.log('音频缓冲中...')
    })
    
    setAudioContext(innerAudioContext)
  }

  // 控制音乐播放/暂停
  const toggleMusic = () => {
    if (!audioContext) {
      console.log('音频上下文未初始化')
      return
    }
    
    try {
      if (isPlaying) {
        audioContext.pause()
      } else {
        // 播放前检查音频状态
        audioContext.play().then(() => {
          console.log('音频播放成功')
        }).catch((error) => {
          console.error('音频播放失败：', error)
          setIsPlaying(false)
        })
      }
    } catch (error) {
      console.error('音频操作失败：', error)
      setIsPlaying(false)
    }
  }

  // 页面卸载时停止音乐和自动播放
  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.destroy()
      }
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer)
      }
    }
  }, [audioContext, autoPlayTimer])

  // 开始自动播放
  const startAutoPlay = () => {
    if (isAutoPlaying) return
    
    setIsAutoPlaying(true)
    const timer = setInterval(() => {
      setCurrentPage(prev => {
        const nextPage = prev + 1
        const maxPage = weddingConfig.wedding.photoGallery.length
        
        if (nextPage > maxPage) {
          // 到达最后一页，停止自动播放
          clearInterval(timer)
          setIsAutoPlaying(false)
          return prev
        }
        
        return nextPage
      })
    }, 4000) // 每4秒切换一次
    
    setAutoPlayTimer(timer)
  }

  // 停止自动播放
  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer)
      setAutoPlayTimer(null)
    }
    setIsAutoPlaying(false)
  }

  // 文字动画效果 - 优化性能
  const startTextAnimation = () => {
    setShowText(true)
    setCurrentTextIndex(0)
    
    const currentPageData = getCurrentPageData()
    if (currentPageData && currentPageData.title) {
      const textToAnimate = currentPageData.title
      let currentIndex = 0
      
      const textTimer = setInterval(() => {
        currentIndex++
        setCurrentTextIndex(currentIndex)
        
        if (currentIndex >= textToAnimate.length - 1) {
          clearInterval(textTimer)
        }
      }, 150) // 减少间隔时间，提升响应速度
    }
  }

  // 获取当前页面数据
  const getCurrentPageData = () => {
    if (currentPage === 0) {
      return {
        title: 'Wedding Invitation',
        subtitle: `${weddingConfig.groom.name} & ${weddingConfig.bride.name}`
      }
    } else {
      return weddingConfig.wedding.photoGallery[currentPage - 1]
    }
  }

  // 页面切换处理 - 优化性能
  const onSwiperChange = (e) => {
    const newPage = e.detail.current
    if (newPage !== currentPage) {
      // 停止自动播放
      stopAutoPlay()
      
      // 批量更新状态，减少重渲染
      setCurrentPage(newPage)
      setShowText(false)
      setCurrentTextIndex(0)
      
      // 延迟开始文字动画，避免卡顿
      setTimeout(() => {
        startTextAnimation()
      }, 100)
    }
  }

  // 手动切换页面
  const goToPage = (pageIndex) => {
    if (pageIndex !== currentPage) {
      stopAutoPlay()
      setCurrentPage(pageIndex)
      setShowText(false)
      setCurrentTextIndex(0)
      
      setTimeout(() => {
        startTextAnimation()
      }, 100)
    }
  }

  // 转发给好友 - 使用配置的分享图片
  useShareAppMessage(() => {
    return shareConfig.appMessage
  })

  // 分享到朋友圈 - 使用配置的分享图片
  useShareTimeline(() => {
    return shareConfig.timeline
  })

  // 渲染封面页
  const renderCoverPage = () => (
    <View className='page-content cover'>
      {/* 背景图片 */}
      <Image 
        className='cover-bg-image' 
        src={weddingConfig.wedding.background} 
        mode='aspectFill'
      />
      <View className='cover-overlay'>
        <Text className='title'>
          {getCurrentPageData().title.split('').map((char, index) => (
            <Text
              key={index}
              className={`title-char ${showText && index <= currentTextIndex ? 'show' : ''}`}
            >
              {char}
            </Text>
          ))}
        </Text>
        <Text className={`couple ${showText ? 'show' : ''}`}>
          {weddingConfig.groom.name} & {weddingConfig.bride.name}
        </Text>
        <Text className={`english-names ${showText ? 'show' : ''}`}>
          {weddingConfig.groom.englishName} & {weddingConfig.bride.englishName}
        </Text>
        <Text className={`date ${showText ? 'show' : ''}`}>{weddingConfig.wedding.date}</Text>
        <Text className={`english-date ${showText ? 'show' : ''}`}>{weddingConfig.wedding.englishDate}</Text>
        <Text className={`time ${showText ? 'show' : ''}`}>{weddingConfig.wedding.time}</Text>
        <Text className={`subtitle ${showText ? 'show' : ''}`}>诚邀您参加我们的婚礼</Text>
        
        {/* 新人照片展示 */}
        <View className={`couple-photos ${showText ? 'show' : ''}`}>
          <View className='photo-item'>
            <Image className='person-photo' src={weddingConfig.bride.photo} mode='aspectFill' />
            <Text className='person-name'>{weddingConfig.bride.name}</Text>
            <Text className='person-english'>{weddingConfig.bride.englishName}</Text>
          </View>
          <Text className='heart'>💕</Text>
          <View className='photo-item'>
            <Image className='person-photo' src={weddingConfig.groom.photo} mode='aspectFill' />
            <Text className='person-name'>{weddingConfig.groom.name}</Text>
            <Text className='person-english'>{weddingConfig.groom.englishName}</Text>
          </View>
        </View>
        
        <Text className={`quote ${showText ? 'show' : ''}`}>&ldquo;{weddingConfig.wedding.quotes[0]}&rdquo;</Text>
        
        {/* 滑动提示 */}
        <View className={`swipe-hint ${showText ? 'show' : ''}`}>
          <Text className='hint-text'>向下滑动查看我们的故事</Text>
          <Text className='hint-arrow'>↓</Text>
        </View>
      </View>
    </View>
  )

  // 渲染照片页面
  const renderPhotoPage = (photo) => (
    <View className='page-content photo-page'>
      <Image 
        className='photo-bg-image' 
        src={photo.image} 
        mode='aspectFill'
      />
      <View className='photo-overlay'>
        <View className='photo-content'>
          <Text className='photo-title'>
            {photo.title.split('').map((char, index) => (
              <Text
                key={index}
                className={`title-char ${showText && index <= currentTextIndex ? 'show' : ''}`}
              >
                {char}
              </Text>
            ))}
          </Text>
          <Text className={`photo-subtitle ${showText ? 'show' : ''}`}>{photo.subtitle}</Text>
          <Text className={`photo-description ${showText ? 'show' : ''}`}>{photo.description}</Text>
        </View>
      </View>
    </View>
  )

  return (
    <View className='index'>
      <View className='main'>
        {/* 音乐控制按钮 */}
        <View className='music-control' onClick={toggleMusic}>
          <Text className={`music-icon ${isPlaying ? 'playing' : ''}`}>
            {!audioReady ? '🔊' : isPlaying ? '🎵' : '🔇'}
          </Text>
        </View>

        {/* 分享按钮 */}
        <Button 
          className='share-control' 
          openType='share'
        >
          📤
        </Button>

        {/* 多页照片展示 */}
        <Swiper
          className='photo-swiper'
          current={currentPage}
          onChange={onSwiperChange}
          circular={false}
          indicatorDots={false}
          autoplay={false}
          vertical={true}
          skipHiddenItemLayout={true}
          disableTouch={false}
          touchable={true}
          easingFunction='easeOutCubic'
          duration={300}
          interval={4000}
          displayMultipleItems={1}
          previousMargin='0px'
          nextMargin='0px'
        >
          {/* 封面页 */}
          <SwiperItem>
            <View className='page'>
              {renderCoverPage()}
            </View>
          </SwiperItem>

          {/* 照片页面 */}
          {weddingConfig.wedding.photoGallery.map((photo) => (
            <SwiperItem key={photo.id}>
              <View className='page'>
                {renderPhotoPage(photo)}
              </View>
            </SwiperItem>
          ))}
        </Swiper>

        {/* 页面指示器 */}
        {/* <View className='page-indicator'>
          {Array.from({ length: weddingConfig.wedding.photoGallery.length + 1 }, (_, index) => (
            <View 
              key={index}
              className={`indicator-dot ${index === currentPage ? 'active' : ''}`}
              onClick={() => goToPage(index)}
            />
          ))}
        </View> */}

        {/* 自动播放控制按钮 */}
        <View className='auto-play-control' onClick={isAutoPlaying ? stopAutoPlay : startAutoPlay}>
          <Text className='auto-play-icon'>
            {isAutoPlaying ? '⏸️' : '▶️'}
          </Text>
        </View>
      </View>
    </View>
  )
}