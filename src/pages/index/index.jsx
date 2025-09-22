import { View, Text, Image, Button, Swiper, SwiperItem } from '@tarojs/components'
import { useLoad, useShareAppMessage, useShareTimeline, createInnerAudioContext } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { weddingConfig, shareConfig } from '../../config/wedding'
import './index.less'


export default function Index () {

  // 音乐播放状态
  const [isPlaying, setIsPlaying] = useState(false) // eslint-disable-line no-unused-vars
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
    // 延迟初始化音频上下文，等待页面完全加载
    setTimeout(() => {
      initAudio()
    }, 2000)
    // 开始文字动画
    startTextAnimation()
    // 延迟3秒后开始自动切换页面
    setTimeout(() => {
      startAutoPlay()
    }, 3000)
  })

  // 初始化音频 - 增强错误处理和重试机制
  const initAudio = () => {
    try {
      console.log('开始初始化音频上下文')
      const innerAudioContext = createInnerAudioContext()
      
      if (!innerAudioContext) {
        console.error('无法创建音频上下文')
        return
      }
      
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
        // 在音频准备就绪后尝试自动播放
        setTimeout(() => {
          tryAutoPlayMusic(innerAudioContext)
        }, 1000)
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
        
        // 记录错误信息
        console.log('音频加载失败，可能是网络问题或资源不存在')
        
        // 不再尝试重新加载，避免无限循环
        // 用户可以手动点击播放按钮重试
      })
      
      innerAudioContext.onEnded(() => {
        // 音频播放结束时的处理（由于loop=true，这个事件一般不会触发）
        console.log('音频播放结束')
        if (innerAudioContext.loop) {
          innerAudioContext.play().catch(err => {
            console.log('重复播放失败：', err)
          })
        } else {
          setIsPlaying(false)
        }
      })
      
      innerAudioContext.onWaiting(() => {
        console.log('音频缓冲中...')
      })
      
      // 设置音频上下文
      setAudioContext(innerAudioContext)
      
      console.log('等待音频加载...')
      
    } catch (error) {
      console.error('初始化音频上下文失败：', error)
      setAudioReady(false)
    }
  }

  // 尝试自动播放音乐 - 修复小程序API兼容性问题
  const tryAutoPlayMusic = (audioContextRef) => {
    if (!audioContextRef) {
      console.log('音频上下文引用不存在')
      return
    }
    
    try {
      // 小程序中play()方法不返回Promise，直接调用即可
      audioContextRef.play()
      console.log('自动播放音乐已启动')
      // 播放状态会通过onPlay事件回调更新
    } catch (error) {
      console.error('自动播放音乐失败：', error)
      setIsPlaying(false)
      console.log('用户可以手动点击音乐按钮来播放音乐')
    }
  }

  // 自动播放音乐 - 增强错误处理，避免无限重试
  // eslint-disable-next-line no-unused-vars
  const autoPlayMusic = () => {
    // 检查音频上下文是否存在
    if (!audioContext) {
      console.log('音频上下文不存在，取消自动播放')
      return
    }
    
    // 检查音频是否准备就绪
    if (!audioReady) {
      console.log('音频上下文未准备就绪，等待中...')
      
      // 只重试3次，避免无限循环
      let retryCount = 0
      const maxRetries = 3
      
      const retryAutoPlay = () => {
        if (retryCount >= maxRetries) {
          console.log('音频初始化失败，停止自动播放尝试')
          return
        }
        
        retryCount++
        console.log(`第${retryCount}次重试自动播放...`)
        
        setTimeout(() => {
          if (audioReady) {
            autoPlayMusic()
          } else {
            retryAutoPlay()
          }
        }, 2000) // 延长重试间隔
      }
      
      retryAutoPlay()
      return
    }
    
    // 尝试播放及错误处理 - 修复小程序API兼容性
    try {
      // 小程序中play()方法不返回Promise，直接调用
      audioContext.play()
      console.log('自动播放音乐已启动')
      // 播放状态会通过onPlay事件回调更新
    } catch (error) {
      console.error('自动播放音乐失败：', error)
      setIsPlaying(false)
      console.log('用户可以手动点击屏幕来播放音乐')
    }
  }

  // 页面卸载时停止音乐和自动播放
  useEffect(() => {
    return () => {
      if (audioContext) {
        // audioContext.destroy()
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

  // 文字动画效果 - 简化为仅在首页加载时执行
  const startTextAnimation = () => {
    // 只有在首页且首次加载时才执行文字动画
    if (currentPage !== 0) {
      setShowText(true)
      setCurrentTextIndex(999) // 直接显示全部文字
      return
    }
    
    setShowText(true)
    setCurrentTextIndex(0)
    
    const currentPageData = getCurrentPageData()
    if (currentPageData && currentPageData.title) {
      const textToAnimate = currentPageData.title
      let currentIndex = 0
      
      // 简化动画，减少性能消耗
      const textTimer = setInterval(() => {
        currentIndex++
        setCurrentTextIndex(currentIndex)
        
        if (currentIndex >= textToAnimate.length - 1) {
          clearInterval(textTimer)
        }
      }, 80) // 加快动画速度
    }
  }

  // 定义页面内容数据 - 参考婚礼纪风格
  const getPageContent = () => {
    const pages = [
      // 1. 封面页 - 精美封面
      { type: 'cover', title: 'Wedding Invitation' },
      
      // 2. 邀请函正文 - 正式邀请
      { 
        type: 'invitation', 
        title: '请柬',
        subtitle: '诚挚邀请您参加我们的婚礼',
        content: '在这个美好的日子里，我们将携手踏入婚姻的殿堂。您的到来将是我们最大的荣幸，请您见证这个特殊的时刻。',
        formal: true
      },
      
      // 3. 新人介绍 - 新郎
      {
        type: 'person',
        role: 'groom',
        title: '新郎',
        name: weddingConfig.groom.name,
        englishName: weddingConfig.groom.englishName,
        photo: weddingConfig.groom.photo,
        description: '一个阳光温暖的男生，喜欢运动和编程，相信爱情的力量。'
      },
      
      // 4. 新人介绍 - 新娘
      {
        type: 'person',
        role: 'bride', 
        title: '新娘',
        name: weddingConfig.bride.name,
        englishName: weddingConfig.bride.englishName,
        photo: weddingConfig.bride.photo,
        description: '一个温柔善良的女生，热爱读书和旅行，相信美好的未来。'
      },
      
      // 5. 爱情故事
      { 
        type: 'story', 
        title: '我们的爱情故事',
        subtitle: 'Our Love Story',
        timeline: [
          {
            date: '2020.05.20',
            title: '初次相遇',
            description: '在那个阳光明媚的午后，我们在咖啡厅初次相遇。'
          },
          {
            date: '2021.02.14',
            title: '确定关系',
            description: '情人节的那个晚上，你成为了我的女朋友。'
          },
          {
            date: '2023.10.01',
            title: '求婚成功',
            description: '在香山的山顶，你含着眼泪说出了"我愿意"。'
          },
          {
            date: '2025.10.03',
            title: '步入婚姻',
            description: '今天，我们将成为彼此的伴侣，相伴一生。'
          }
        ]
      },
      
      // 6. 婚纱照
      weddingConfig.wedding.photoGallery[0],
      
      // 7. 婚礼详情
      { 
        type: 'details',
        title: '婚礼详情',
        subtitle: 'Wedding Details'
      },
      
      // 8. 婚礼现场
      weddingConfig.wedding.photoGallery[1],
      
      // 9. 交通指引
      {
        type: 'location',
        title: '交通指引',
        subtitle: 'How to get there',
        address: weddingConfig.wedding.address,
        location: weddingConfig.wedding.location,
        transport: [
          '🚕 地铁: 2号线大清站C口出，步行500米',
          '🚗 驾车: 提供免费停车位，请提前告知',
          '🚕 打车: 导航“某某酒店宜会厅”'
        ]
      },
      
      // 10. 祝福留言
      {
        type: 'blessing',
        title: '留下您的祝福',
        subtitle: 'Leave your blessing',
        description: '感谢您的关爱与陈伴，请留下您的美好祝福。'
      },
      
      // 11. 感谢页面
      {
        type: 'thanks',
        title: '谢谢您',
        subtitle: 'Thank You',
        content: '感谢您的阅读和关注，期待在婚礼上与您相遇。我们的爱情故事因为有了您的见证而更加美好。',
        quote: '“爱是最美的言语，幸福是最好的结局。”'
      }
    ]
    
    return pages
  }

  // 获取当前页面数据
  const getCurrentPageData = () => {
    const pages = getPageContent()
    return pages[currentPage] || pages[0]
  }

  // 手动播放/暂停音乐 - 修复小程序API兼容性
  const handleMusicToggle = () => {
    if (!audioContext) {
      console.log('音频上下文不存在，重新初始化')
      initAudio()
      return
    }
    
    if (isPlaying) {
      // 暂停音乐
      audioContext.pause()
    } else {
      // 播放音乐 - 修复小程序API兼容性
      if (audioReady) {
        try {
          // 小程序中play()方法不返回Promise，直接调用
          audioContext.play()
          console.log('手动播放音乐已启动')
          // 播放状态会通过onPlay事件回调更新
        } catch (error) {
          console.error('手动播放失败：', error)
          setIsPlaying(false)
        }
      } else {
        console.log('音频还未准备就绪，请稍后再试')
      }
    }
  }
  const onSwiperChange = (e) => {
    const newPage = e.detail.current
    if (newPage !== currentPage) {
      // 立即停止自动播放
      stopAutoPlay()
      
      // 立即更新页面状态，禁用文字动画
      setCurrentPage(newPage)
      setShowText(true) // 直接显示文字，不要动画
      setCurrentTextIndex(999) // 显示全部文字
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

  // 渲染封面页 - 增强婚礼纪风格
  const renderCoverPage = () => (
    <View className='page-content cover'>
      {/* 背景图片 */}
      <Image 
        className='cover-bg-image' 
        src={weddingConfig.wedding.background} 
        mode='aspectFill'
      />
      
      {/* 装饰元素 */}
      <View className='decorative-elements'>
        <View className='floating-heart heart-1'>❤️</View>
        <View className='floating-heart heart-2'>💖</View>
        <View className='floating-heart heart-3'>❤️</View>
        <View className='floating-petals petal-1'>🌸</View>
        <View className='floating-petals petal-2'>🌼</View>
        <View className='floating-petals petal-3'>🌸</View>
      </View>
      
      <View className='cover-overlay'>
        {/* 主标题区域 */}
        <View className='main-title-section'>
          <View className='title-decoration'></View>
          <Text className='main-title'>
            {getCurrentPageData().title.split('').map((char, index) => (
              <Text
                key={index}
                className={`title-char ${showText && index <= currentTextIndex ? 'show' : ''}`}
              >
                {char}
              </Text>
            ))}
          </Text>
          <View className='title-decoration'></View>
        </View>
        
        {/* 新人名字区域 */}
        <View className='couple-names-section'>
          <Text className={`couple-main ${showText ? 'show' : ''}`}>
            {weddingConfig.groom.name} ♥ {weddingConfig.bride.name}
          </Text>
          <Text className={`couple-english ${showText ? 'show' : ''}`}>
            {weddingConfig.groom.englishName} & {weddingConfig.bride.englishName}
          </Text>
        </View>
        
        {/* 日期时间区域 */}
        <View className='datetime-section'>
          <View className={`date-card ${showText ? 'show' : ''}`}>
            <Text className='date-chinese'>{weddingConfig.wedding.date}</Text>
            <Text className='date-english'>{weddingConfig.wedding.englishDate}</Text>
            <Text className='time-info'>{weddingConfig.wedding.time}</Text>
          </View>
        </View>
        
        {/* 新人头像区域 */}
        <View className={`couple-avatars ${showText ? 'show' : ''}`}>
          <View className='avatar-container groom-avatar'>
            <Image className='avatar-photo' src={weddingConfig.groom.photo} mode='aspectFill' />
            <Text className='avatar-name'>{weddingConfig.groom.name}</Text>
            <Text className='avatar-role'>新郎</Text>
          </View>
          
          <View className='love-symbol'>
            <Text className='love-icon'>💖</Text>
            <Text className='love-text'>相爱</Text>
          </View>
          
          <View className='avatar-container bride-avatar'>
            <Image className='avatar-photo' src={weddingConfig.bride.photo} mode='aspectFill' />
            <Text className='avatar-name'>{weddingConfig.bride.name}</Text>
            <Text className='avatar-role'>新娘</Text>
          </View>
        </View>
        
        {/* 邀请词区域 */}
        <View className='invitation-text-section'>
          <Text className={`invitation-quote ${showText ? 'show' : ''}`}>
            &ldquo;{weddingConfig.wedding.quotes[0]}&rdquo;
          </Text>
          <Text className={`invitation-message ${showText ? 'show' : ''}`}>
            诚挚邀请您参加我们的婚礼
          </Text>
        </View>
        
        {/* 操作提示 */}
        <View className={`operation-hints ${showText ? 'show' : ''}`}>
         
          {/* 分享按钮 - 放在明显位置 */}
          <Button 
            className='main-share-btn'
            openType='share'
          >
            {/* <Text className='share-icon'>📤</Text> */}
            <Text className='share-text'>分享邀请函</Text>
          </Button>
        </View>
        
        {/* 滚动指示器 */}
        <View className={`scroll-indicator ${showText ? 'show' : ''}`}>
          <View className='scroll-dot'></View>
          <View className='scroll-line'></View>
          <Text className='scroll-text'>滑动查看</Text>
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
            {photo.title}
          </Text>
          <Text className={`photo-subtitle ${showText ? 'show' : ''}`}>{photo.subtitle}</Text>
          <Text className={`photo-description ${showText ? 'show' : ''}`}>{photo.description}</Text>
        </View>
      </View>
    </View>
  )

  // 渲染邀请函页面
  const renderInvitationPage = (content) => (
    <View className='page-content invitation-page'>
      {/* 背景图片 */}
      <Image 
        className='invitation-bg-image' 
        src={weddingConfig.wedding.backgrounds.invitation} 
        mode='aspectFill'
      />
      {/* 装饰元素 */}
      <View className='invitation-decorations'>
        <View className='decoration-corner top-left'></View>
        <View className='decoration-corner top-right'></View>
        <View className='decoration-corner bottom-left'></View>
        <View className='decoration-corner bottom-right'></View>
        <View className='floating-elements'>
          <View className='floating-flower flower-1'>🌹</View>
          <View className='floating-flower flower-2'>🌿</View>
          <View className='floating-flower flower-3'>🌸</View>
        </View>
      </View>
      <View className='invitation-overlay'>
        <View className='invitation-content'>
          <View className='invitation-header'>
            <View className='title-decoration-line'></View>
            <Text className='invitation-title'>
              {content.title}
            </Text>
            <View className='title-decoration-line'></View>
          </View>
          <Text className={`invitation-subtitle ${showText ? 'show' : ''}`}>{content.subtitle}</Text>
          <View className={`invitation-main ${showText ? 'show' : ''}`}>
            <Text className='invitation-text'>{content.content}</Text>
          </View>
          {/* <View className={`invitation-footer ${showText ? 'show' : ''}`}>
            <View className='signature-decoration'>
              <View className='signature-line'></View>
              <Text className='invitation-signature'>{weddingConfig.groom.name} & {weddingConfig.bride.name}</Text>
              <View className='signature-line'></View>
            </View>
          </View> */}
        </View>
      </View>
    </View>
  )

  // 渲染人物介绍页面
  const renderPersonPage = (content) => (
    <View className='page-content person-page'>
      <Image 
        className='person-bg-image' 
        src={content.photo} 
        mode='aspectFill'
      />
      <View className='person-overlay'>
        <View className='person-content'>
          <View className={`person-avatar ${showText ? 'show' : ''}`}>
            <Image className='avatar-image' src={content.photo} mode='aspectFill' />
            <View className='avatar-border'></View>
          </View>
          <Text className='person-title'>
            {content.title}
          </Text>
          <Text className={`person-name ${showText ? 'show' : ''}`}>{content.name}</Text>
          <Text className={`person-english ${showText ? 'show' : ''}`}>{content.englishName}</Text>
          <Text className={`person-description ${showText ? 'show' : ''}`}>{content.description}</Text>
        </View>
      </View>
    </View>
  )

  // 渲染爱情故事页面
  const renderStoryPage = (content) => (
    <View className='page-content story-page'>
      {/* 背景图片 */}
      <Image 
        className='story-bg-image' 
        src={weddingConfig.wedding.backgrounds.story} 
        mode='aspectFill'
      />
      {/* 装饰元素 */}
      <View className='story-decorations'>
        <View className='romantic-elements'>
          <View className='floating-heart story-heart-1'>❤️</View>
          <View className='floating-heart story-heart-2'>💖</View>
          <View className='floating-rose rose-1'>🌹</View>
          <View className='floating-rose rose-2'>🌿</View>
        </View>
      </View>
      <View className='story-overlay'>
        <View className='story-content'>
          <View className='story-header'>
            <Text className='story-title'>
              {content.title}
            </Text>
            <Text className={`story-subtitle ${showText ? 'show' : ''}`}>{content.subtitle}</Text>
          </View>
          <View className={`timeline ${showText ? 'show' : ''}`}>
            {content.timeline.map((item, index) => (
              <View key={index} className='timeline-item'>
                <View className='timeline-dot'></View>
                <View className='timeline-content'>
                  <Text className='timeline-date'>{item.date}</Text>
                  <Text className='timeline-title'>{item.title}</Text>
                  <Text className='timeline-desc'>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )

  // 渲染交通指引页面
  const renderLocationPage = (content) => (
    <View className='page-content location-page'>
      {/* 背景图片 */}
      <Image 
        className='location-bg-image' 
        src={weddingConfig.wedding.backgrounds.location} 
        mode='aspectFill'
      />
      {/* 装饰元素 */}
      <View className='location-decorations'>
        <View className='travel-elements'>
          <View className='floating-icon icon-1'>🚗</View>
          <View className='floating-icon icon-2'>🚇</View>
          <View className='floating-icon icon-3'>📍</View>
        </View>
      </View>
      <View className='location-overlay'>
        <View className='location-content'>
          <View className='location-header'>
            <Text className='location-title'>
              {content.title}
            </Text>
            <Text className={`location-subtitle ${showText ? 'show' : ''}`}>{content.subtitle}</Text>
          </View>
          
          <View className={`location-info ${showText ? 'show' : ''}`}>
            <View className='location-address'>
              <Text className='address-label'>📍 地址</Text>
              <Text className='address-value'>{content.location}</Text>
              <Text className='address-detail'>{content.address}</Text>
            </View>
            
            <View className='transport-info'>
              <Text className='transport-label'>🚆 交通方式</Text>
              {content.transport.map((item, index) => (
                <Text key={index} className='transport-item'>{item}</Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  // 渲染祝福留言页面
  const renderBlessingPage = (content) => (
    <View className='page-content blessing-page'>
      {/* 背景图片 */}
      <Image 
        className='blessing-bg-image' 
        src={weddingConfig.wedding.backgrounds.blessing} 
        mode='aspectFill'
      />
      {/* 装饰元素 */}
      <View className='blessing-decorations'>
        <View className='wish-elements'>
          <View className='floating-star star-1'>✨</View>
          <View className='floating-star star-2'>🌟</View>
          <View className='floating-wish wish-1'>💝</View>
          <View className='floating-wish wish-2'>🎈</View>
        </View>
      </View>
      <View className='blessing-overlay'>
        <View className='blessing-content'>
          <View className='blessing-header'>
            <Text className='blessing-title'>
              {content.title}
            </Text>
            <Text className={`blessing-subtitle ${showText ? 'show' : ''}`}>{content.subtitle}</Text>
            <Text className={`blessing-description ${showText ? 'show' : ''}`}>{content.description}</Text>
          </View>
          
          <View className={`blessing-form ${showText ? 'show' : ''}`}>
            <View className='form-item'>
              <Text className='form-label'>您的姓名</Text>
              <View className='form-input'>
                <Text className='input-placeholder'>请输入您的姓名</Text>
              </View>
            </View>
            <View className='form-item'>
              <Text className='form-label'>祝福话语</Text>
              <View className='form-textarea'>
                <Text className='textarea-placeholder'>请留下您的祝福...</Text>
              </View>
            </View>
            <View className='form-submit'>
              <Text className='submit-text'>点击发送祝福</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )

  // 渲染感谢页面
  const renderThanksPage = (content) => (
    <View className='page-content thanks-page'>
      {/* 背景图片 */}
      <Image 
        className='thanks-bg-image' 
        src={weddingConfig.wedding.backgrounds.thanks} 
        mode='aspectFill'
      />
      {/* 装饰元素 */}
      <View className='thanks-decorations'>
        <View className='gratitude-elements'>
          <View className='floating-thank thank-1'>🙏</View>
          <View className='floating-thank thank-2'>🌹</View>
          <View className='floating-sparkle sparkle-1'>✨</View>
          <View className='floating-sparkle sparkle-2'>🎆</View>
        </View>
      </View>
      <View className='thanks-overlay'>
        <View className='thanks-content'>
          <View className='thanks-header'>
            <Text className='thanks-title'>
              {content.title}
            </Text>
            <Text className={`thanks-subtitle ${showText ? 'show' : ''}`}>{content.subtitle}</Text>
          </View>
          <Text className={`thanks-content-text ${showText ? 'show' : ''}`}>{content.content}</Text>
          <Text className={`thanks-quote ${showText ? 'show' : ''}`}>{content.quote}</Text>
          
          <View className={`thanks-hearts ${showText ? 'show' : ''}`}>
            <Text className='heart'>❤️</Text>
            <Text className='heart'>💖</Text>
            <Text className='heart'>❤️</Text>
          </View>
        </View>
      </View>
    </View>
  )

  // 渲染婚礼详情页面
  const renderWeddingDetailsPage = () => (
    <View className='page-content details-page'>
      <View className='details-overlay'>
        <View className='details-content'>
          <Text className='details-title'>
            婚礼详情
          </Text>
          
          <View className={`details-info ${showText ? 'show' : ''}`}>
            <View className='info-item'>
              <Text className='info-label'>📅 婚礼日期</Text>
              <Text className='info-value'>{weddingConfig.wedding.date}</Text>
              <Text className='info-value-en'>{weddingConfig.wedding.englishDate}</Text>
            </View>
            
            <View className='info-item'>
              <Text className='info-label'>⏰ 婚礼时间</Text>
              <Text className='info-value'>{weddingConfig.wedding.time}</Text>
            </View>
            
            <View className='info-item'>
              <Text className='info-label'>📍 婚礼地点</Text>
              <Text className='info-value'>{weddingConfig.wedding.location}</Text>
              <Text className='info-address'>{weddingConfig.wedding.address}</Text>
            </View>
          </View>
          
          <Text className={`details-note ${showText ? 'show' : ''}`}>
            期待与您分享这个特殊的时刻
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <View className='index'>
      <View className='main'>
      

        {/* 多页照片展示 - 深度性能优化 */}
        <Swiper
          className='photo-swiper'
          current={currentPage}
          onChange={onSwiperChange}
          circular={false}
          indicatorDots={false}
          autoplay={false}
          vertical
          skipHiddenItemLayout
          disableTouch={false}
          touchable
          easingFunction='linear'
          duration={150}
          interval={4000}
          displayMultipleItems={1}
          previousMargin='0px'
          nextMargin='0px'
          acceleration
          disableProgrammaticAnimation
          cacheExtent={1}
        >
          {/* 封面页 */}
          <SwiperItem>
            <View className='page'>
              {renderCoverPage()}
            </View>
          </SwiperItem>

          {/* 动态页面内容 */}
          {getPageContent().slice(1).map((pageData, index) => (
            <SwiperItem key={index + 1}>
              <View className='page'>
                {pageData.type === 'invitation' && renderInvitationPage(pageData)}
                {pageData.type === 'person' && renderPersonPage(pageData)}
                {pageData.type === 'story' && renderStoryPage(pageData)}
                {pageData.type === 'details' && renderWeddingDetailsPage()}
                {pageData.type === 'location' && renderLocationPage(pageData)}
                {pageData.type === 'blessing' && renderBlessingPage(pageData)}
                {pageData.type === 'thanks' && renderThanksPage(pageData)}
                {pageData.type !== 'invitation' && pageData.type !== 'person' && pageData.type !== 'story' && pageData.type !== 'details' && pageData.type !== 'location' && pageData.type !== 'blessing' && pageData.type !== 'thanks' && renderPhotoPage(pageData)}
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>
    </View>
  )
}