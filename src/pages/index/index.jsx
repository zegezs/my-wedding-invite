import { View, Text, Image, Button } from '@tarojs/components'
import { useLoad, useShareAppMessage, useShareTimeline, createInnerAudioContext } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.less'


export default function Index () {
  // 音乐播放状态
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioContext, setAudioContext] = useState(null)
  const [audioReady, setAudioReady] = useState(false)

  useLoad(() => {
    console.log('页面加载完成')
    // 初始化音频上下文
    initAudio()
  })

  // 初始化音频
  const initAudio = () => {
    const innerAudioContext = createInnerAudioContext()
    
    // 使用可靠的在线音频源（W3Schools 测试音频）
    innerAudioContext.src = 'https://www.w3schools.com/html/horse.mp3'
    
    // 音频配置
    innerAudioContext.loop = true // 循环播放
    innerAudioContext.volume = 0.3 // 音量设置为30%，适合背景音乐
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

  // 页面卸载时停止音乐
  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.destroy()
      }
    }
  }, [audioContext])

  // 转发给好友
  useShareAppMessage(() => {
    return {
      title: '张明 & 李美的婚礼邀请函',
      path: '/pages/index/index',
      imageUrl: 'https://adc-lab-8vy6pdmg-twymyrsj.oss-cn-hangzhou.aliyuncs.com/main.jpg'
    }
  })

  // 分享到朋友圈
  useShareTimeline(() => {
    return {
      title: '张明 & 李美的婚礼邀请函 - 诚邀您参加我们的婚礼',
      imageUrl: 'https://adc-lab-8vy6pdmg-twymyrsj.oss-cn-hangzhou.aliyuncs.com/main.jpg'
    }
  })

  return (
    <View className='index'>
      <View className='main'>
        <View className='page'>
          <View className='page-content cover'>
            {/* 背景图片 */}
            <Image 
              className='cover-bg-image' 
              src='https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/main.jpg' 
              mode='aspectFill'
            />
            <View className='cover-overlay'>
              <Text className='title'>Wedding Invitation</Text>
              <Text className='couple'>张明 & 李美</Text>
              <Text className='english-names'>Ming Zhang & Mei Li</Text>
              <Text className='date'>2025年10月3日</Text>
              <Text className='english-date'>October 1st, 2024</Text>
              <Text className='time'>10:00 AM</Text>
              <Text className='subtitle'>诚邀您参加我们的婚礼</Text>
              
              {/* 新人照片展示 */}
              <View className='couple-photos'>
                <View className='photo-item'>
                  <Image className='person-photo' src='https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/girl.jpg' mode='aspectFill' />
                  <Text className='person-name'>李美</Text>
                  <Text className='person-english'>Mei Li</Text>
                </View>
                <Text className='heart'>💕</Text>
                <View className='photo-item'>
                  <Image className='person-photo' src='https://adc-lab-8vy6pdmg-twymyrs.oss-cn-beijing.aliyuncs.com/boy.jpg' mode='aspectFill' />
                  <Text className='person-name'>张明</Text>
                  <Text className='person-english'>Ming Zhang</Text>
                </View>
              </View>
              
              <Text className='quote'>&ldquo;爱情是一种永恒的力量，它让两颗心合二为一&rdquo;</Text>
              
              {/* 转发和音乐控制按钮 */}
              <View className='control-buttons'>
                {/* 音乐控制按钮 */}
                <Button 
                  className='music-btn' 
                  onClick={toggleMusic}
                  hoverClass='btn-hover'
                  disabled={!audioReady}
                >
                  {!audioReady ? '🔊 加载中...' : isPlaying ? '🎵 暂停音乐' : '🎵 播放音乐'}
                </Button>
                
                {/* 分享按钮 */}
                <Button 
                  className='share-btn' 
                  openType='share'
                  hoverClass='btn-hover'
                >
                  分享给好友
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}