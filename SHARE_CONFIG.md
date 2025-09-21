# 分享功能配置说明

## 概述
婚礼请柬的分享功能已经优化，现在使用统一的配置文件来管理所有分享相关的设置，包括分享图片、标题等。

## 配置文件位置
`src/config/wedding.js`

## 如何修改分享图片

### 1. 修改专门的分享图片
在 `src/config/wedding.js` 文件中，找到 `weddingConfig.wedding.shareImage` 字段：

```javascript
wedding: {
  // ... 其他配置
  shareImage: 'https://your-image-url.com/share-image.jpg', // 修改这里的图片URL
}
```

### 2. 使用页面背景图作为分享图片
如果您想使用页面背景图作为分享图片，可以这样修改：

```javascript
wedding: {
  background: 'https://your-image-url.com/background.jpg',
  shareImage: 'https://your-image-url.com/background.jpg', // 使用相同的背景图
}
```

### 3. 使用新人照片作为分享图片
您也可以使用新郎或新娘的照片作为分享图片：

```javascript
wedding: {
  shareImage: weddingConfig.groom.photo, // 使用新郎照片
  // 或者
  shareImage: weddingConfig.bride.photo, // 使用新娘照片
}
```

## 分享配置说明

### 分享给好友
- 标题：自动生成，格式为 `{新郎姓名} & {新娘姓名}的婚礼邀请函`
- 图片：使用 `weddingConfig.wedding.shareImage`
- 路径：`/pages/index/index`

### 分享到朋友圈
- 标题：自动生成，格式为 `{新郎姓名} & {新娘姓名}的婚礼邀请函 - 诚邀您参加我们的婚礼`
- 图片：使用 `weddingConfig.wedding.shareImage`

## 图片要求
- 建议尺寸：5:4 比例（如 500x400px）
- 格式：JPG、PNG
- 大小：建议不超过 32KB（微信分享限制）
- 内容：建议包含婚礼主题元素，如新人照片、婚礼日期等

## 注意事项
1. 确保图片URL可以正常访问
2. 图片需要支持HTTPS协议
3. 建议使用CDN或稳定的图片托管服务
4. 修改配置后需要重新编译项目才能生效

## 测试分享功能
1. 在微信开发者工具中预览
2. 点击"分享给好友"按钮
3. 检查分享卡片是否显示正确的图片和标题
4. 在真机上测试分享到朋友圈功能
