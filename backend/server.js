import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 确保上传目录存在
const uploadsDir = path.join(__dirname, 'uploads')
const videosDir = path.join(uploadsDir, 'videos')
const thumbnailsDir = path.join(uploadsDir, 'thumbnails')

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true })
if (!fs.existsSync(thumbnailsDir)) fs.mkdirSync(thumbnailsDir, { recursive: true })

app.use('/uploads', express.static(uploadsDir))

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      cb(null, thumbnailsDir)
    } else if (file.fieldname === 'video') {
      cb(null, videosDir)
    } else {
      cb(null, uploadsDir)
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB 限制
})

// 数据存储（内存存储，生产环境建议使用数据库）
let videos = [
  {
    id: 1,
    title: 'ئاخىرقى كىنو',
    titleCn: '最新电影',
    description: 'بۇ بىر ئالىي سۈپەتلىك كىنو',
    descriptionCn: '这是一部高质量电影',
    category: 'kino',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '120:00',
    views: 12500,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'سېرىال تېلېۋىزىيە',
    titleCn: '电视剧',
    description: 'دىققەتلىك سېرىال',
    descriptionCn: '精彩的电视剧',
    category: 'serial',
    thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '45:00',
    views: 8900,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'كۆڭۈلدىكى مۇزىكا',
    titleCn: '心动音乐',
    description: 'چىرايلىق مۇزىكا كلىپى',
    descriptionCn: '美丽的音乐视频',
    category: 'music',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '05:30',
    views: 25000,
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'كومىدىيە كىنوسى',
    titleCn: '喜剧电影',
    description: 'كۈلۈشكە تولغان كىنو',
    descriptionCn: '充满笑声的电影',
    category: 'comedy',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '95:00',
    views: 18700,
    isFeatured: false,
    createdAt: new Date().toISOString()
  }
]

let categories = [
  { id: 1, name: 'kino', nameUy: 'كىنو', nameCn: '电影' },
  { id: 2, name: 'serial', nameUy: 'سېرىال', nameCn: '电视剧' },
  { id: 3, name: 'music', nameUy: 'مۇزىكا', nameCn: '音乐' },
  { id: 4, name: 'comedy', nameUy: 'كومىدىيە', nameCn: '喜剧' },
  { id: 5, name: 'documentary', nameUy: 'سەنئەت', nameCn: '纪录片' }
]

let sliders = [
  { id: 1, title: 'ئاخىرقى كىنولار', titleCn: '最新电影', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=500&fit=crop', videoId: 1 },
  { id: 2, title: 'ماھىر سېرىاللار', titleCn: '热门剧集', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=500&fit=crop', videoId: 2 }
]

let nextVideoId = 5
let nextCategoryId = 6
let nextSliderId = 3

// === 视频 API ===
app.get('/api/videos', (req, res) => {
  const { category, search, featured } = req.query
  let filteredVideos = [...videos]

  if (category) {
    filteredVideos = filteredVideos.filter(v => v.category === category)
  }
  if (search) {
    const searchLower = search.toLowerCase()
    filteredVideos = filteredVideos.filter(v =>
      v.title.toLowerCase().includes(searchLower) ||
      (v.titleCn && v.titleCn.toLowerCase().includes(searchLower)) ||
      (v.description && v.description.toLowerCase().includes(searchLower))
    )
  }
  if (featured === 'true') {
    filteredVideos = filteredVideos.filter(v => v.isFeatured)
  }

  res.json(filteredVideos)
})

app.get('/api/videos/:id', (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id))
  if (!video) {
    return res.status(404).json({ error: 'Video not found' })
  }
  video.views = (video.views || 0) + 1
  res.json(video)
})

app.post('/api/videos', upload.fields([{ name: 'thumbnail' }, { name: 'video' }]), (req, res) => {
  const { title, titleCn, description, descriptionCn, category, isFeatured, duration } = req.body

  const newVideo = {
    id: nextVideoId++,
    title,
    titleCn: titleCn || '',
    description: description || '',
    descriptionCn: descriptionCn || '',
    category: category || 'kino',
    isFeatured: isFeatured === 'true',
    duration: duration || '00:00',
    thumbnail: req.files?.thumbnail?.[0]
      ? `/uploads/thumbnails/${req.files.thumbnail[0].filename}`
      : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    videoUrl: req.files?.video?.[0]
      ? `/uploads/videos/${req.files.video[0].filename}`
      : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    views: 0,
    createdAt: new Date().toISOString()
  }

  videos.unshift(newVideo)
  res.status(201).json(newVideo)
})

app.put('/api/videos/:id', upload.fields([{ name: 'thumbnail' }, { name: 'video' }]), (req, res) => {
  const index = videos.findIndex(v => v.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'Video not found' })
  }

  const { title, titleCn, description, descriptionCn, category, isFeatured, duration } = req.body

  videos[index] = {
    ...videos[index],
    title: title || videos[index].title,
    titleCn: titleCn || videos[index].titleCn,
    description: description || videos[index].description,
    descriptionCn: descriptionCn || videos[index].descriptionCn,
    category: category || videos[index].category,
    isFeatured: isFeatured !== undefined ? isFeatured === 'true' : videos[index].isFeatured,
    duration: duration || videos[index].duration,
    thumbnail: req.files?.thumbnail?.[0]
      ? `/uploads/thumbnails/${req.files.thumbnail[0].filename}`
      : videos[index].thumbnail,
    videoUrl: req.files?.video?.[0]
      ? `/uploads/videos/${req.files.video[0].filename}`
      : videos[index].videoUrl
  }

  res.json(videos[index])
})

app.delete('/api/videos/:id', (req, res) => {
  const index = videos.findIndex(v => v.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'Video not found' })
  }
  const deleted = videos.splice(index, 1)[0]

  if (deleted.thumbnail && deleted.thumbnail.startsWith('/uploads')) {
    const thumbPath = path.join(__dirname, deleted.thumbnail)
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath)
  }
  if (deleted.videoUrl && deleted.videoUrl.startsWith('/uploads')) {
    const videoPath = path.join(__dirname, deleted.videoUrl)
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath)
  }

  res.status(204).send()
})

// === 分类 API ===
app.get('/api/categories', (req, res) => {
  res.json(categories)
})

app.post('/api/categories', (req, res) => {
  const { name, nameUy, nameCn } = req.body
  const newCategory = {
    id: nextCategoryId++,
    name,
    nameUy,
    nameCn
  }
  categories.push(newCategory)
  res.status(201).json(newCategory)
})

app.delete('/api/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' })
  }
  categories.splice(index, 1)
  res.status(204).send()
})

// === 轮播图 API ===
app.get('/api/sliders', (req, res) => {
  res.json(sliders)
})

app.post('/api/sliders', (req, res) => {
  const { title, titleCn, image, videoId } = req.body
  const newSlider = {
    id: nextSliderId++,
    title,
    titleCn: titleCn || '',
    image,
    videoId: videoId ? parseInt(videoId) : null
  }
  sliders.push(newSlider)
  res.status(201).json(newSlider)
})

app.put('/api/sliders/:id', (req, res) => {
  const index = sliders.findIndex(s => s.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'Slider not found' })
  }

  const { title, titleCn, image, videoId } = req.body
  sliders[index] = {
    ...sliders[index],
    title: title || sliders[index].title,
    titleCn: titleCn || sliders[index].titleCn,
    image: image || sliders[index].image,
    videoId: videoId !== undefined ? (videoId ? parseInt(videoId) : null) : sliders[index].videoId
  }

  res.json(sliders[index])
})

app.delete('/api/sliders/:id', (req, res) => {
  const index = sliders.findIndex(s => s.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'Slider not found' })
  }
  sliders.splice(index, 1)
  res.status(204).send()
})

// === 统计 API ===
app.get('/api/stats', (req, res) => {
  res.json({
    totalVideos: videos.length,
    totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0),
    totalCategories: categories.length,
    featuredVideos: videos.filter(v => v.isFeatured).length
  })
})

// === 健康检查 ===
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', message: 'QaraKino Server is running!' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 QaraKino Server is running!`)
  console.log(`📍 Server URL: http://localhost:${PORT}`)
  console.log(`📡 API Docs: http://localhost:${PORT}/api/health\n`)
})
