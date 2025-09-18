import { View, Text, Image } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'

// 引入图片资源
import boyImage from '../../assets/boy.jpg'
import girlImage from '../../assets/girl.jpg'
import mainImage from '../../assets/main.jpg'

export default function Index () {
  useLoad(() => {
    console.log('页面加载完成')
  })

  return (
    <View className='index'>
      <View className='main'>
        <View className='page'>
          <View className='page-content cover'>
            {/* 背景图片 */}
            <Image 
              className='cover-bg-image' 
              src={mainImage} 
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
                  <Image className='person-photo' src={girlImage} mode='aspectFill' />
                  <Text className='person-name'>李美</Text>
                  <Text className='person-english'>Mei Li</Text>
                </View>
                <Text className='heart'>💕</Text>
                <View className='photo-item'>
                  <Image className='person-photo' src={boyImage} mode='aspectFill' />
                  <Text className='person-name'>张明</Text>
                  <Text className='person-english'>Ming Zhang</Text>
                </View>
              </View>
              
              <Text className='quote'>&ldquo;爱情是一种永恒的力量，它让两颗心合二为一&rdquo;</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}