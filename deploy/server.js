/**
 * QaraKino - Unified Deployment Server
 *
 * Serves:
 *   - Client frontend  at /
 *   - Admin panel      at /admin/
 *   - Backend API      at /api/
 *   - Upload files     at /uploads/
 *
 * Usage:
 *   node server.js
 *   PORT=3000 node server.js
 */

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'

// ============================================================
// ESM __dirname polyfill
// ============================================================
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================================
// App initialization
// ============================================================
const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'qarakino-super-secret-key-2024'
const JWT_EXPIRES_IN = '24h'

// ============================================================
// Middleware
// ============================================================
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ============================================================
// Static file serving
// ============================================================

// Client frontend - served at root /
const clientDist = path.join(__dirname, 'client')
const adminDist = path.join(__dirname, 'admin')

// Upload directories
const uploadsDir = path.join(__dirname, 'uploads')
const videosDir = path.join(uploadsDir, 'videos')
const thumbnailsDir = path.join(uploadsDir, 'thumbnails')

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true })
if (!fs.existsSync(thumbnailsDir)) fs.mkdirSync(thumbnailsDir, { recursive: true })

app.use('/uploads', express.static(uploadsDir))

// ============================================================
// Multer configuration (500 MB limit)
// ============================================================
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
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB
})

// ============================================================
// In-memory data store
// ============================================================

// --- Videos (8+ sample entries across categories) ---
let videos = [
  {
    id: 1,
    title: 'ئاخىرقى كىنو',
    titleCn: '最新电影',
    description: 'بۇ بىر ئالىي سۈپەتلىك كىنو، كۆرۈشكە ئەرزىيدۇ.',
    descriptionCn: '这是一部高质量电影，值得观看。',
    category: 'kino',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '02:00:00',
    views: 12500,
    isFeatured: true,
    year: 2024,
    director: 'ئەمەت يۈسۈپ',
    tags: ['كىنو', 'ھەرىكەت', 'دىراما'],
    rating: 4.5,
    ratingCount: 128,
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 2,
    title: 'سېرىال تېلېۋىزىيە',
    titleCn: '热门剧集',
    description: 'دىققەتلىك سېرىال، ھەر قىسىمى سىزنى ھەيران قالدۇرىدۇ.',
    descriptionCn: '精彩电视剧，每一集都会让你惊叹。',
    category: 'serial',
    thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '00:45:00',
    views: 8900,
    isFeatured: true,
    year: 2024,
    director: 'رەشىد ئابدۇللا',
    tags: ['سېرىال', 'مۇھەببەت'],
    rating: 4.2,
    ratingCount: 95,
    createdAt: '2024-02-20T08:30:00.000Z'
  },
  {
    id: 3,
    title: 'كۆڭۈلدىكى مۇزىكا',
    titleCn: '心动音乐',
    description: 'چىرايلىق مۇزىكا كلىپى، كۆڭلىڭىزنى ئېچىدۇ.',
    descriptionCn: '美丽的音乐视频，打开你的心扉。',
    category: 'music',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '00:05:30',
    views: 25000,
    isFeatured: false,
    year: 2023,
    director: 'مەريەم نۇر',
    tags: ['مۇزىكا', 'ناشىدە'],
    rating: 4.8,
    ratingCount: 312,
    createdAt: '2024-03-10T14:00:00.000Z'
  },
  {
    id: 4,
    title: 'كومىدىيە كىنوسى',
    titleCn: '喜剧电影',
    description: 'كۈلۈشكە تولغان كىنو، كەيپىياتىڭىزنى ياخشىلايدۇ.',
    descriptionCn: '充满笑声的电影，改善你的心情。',
    category: 'comedy',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '01:35:00',
    views: 18700,
    isFeatured: false,
    year: 2023,
    director: 'ئىلى ئەھمەد',
    tags: ['كومىدىيە', 'كىنو'],
    rating: 4.0,
    ratingCount: 76,
    createdAt: '2024-04-05T09:15:00.000Z'
  },
  {
    id: 5,
    title: 'تەبىئەت دۇنياسى',
    titleCn: '自然世界',
    description: 'گۈزەل تەبىئەت مەنزىرىلىرى ۋە ھايۋانلار دۇنياسى.',
    descriptionCn: '美丽的自然风景和动物世界。',
    category: 'documentary',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: '01:20:00',
    views: 5200,
    isFeatured: true,
    year: 2024,
    director: 'زۇلپىقار مەت',
    tags: ['سەنئەت', 'تەبىئەت', 'ھايۋانلار'],
    rating: 4.7,
    ratingCount: 203,
    createdAt: '2024-05-12T16:45:00.000Z'
  },
  {
    id: 6,
    title: 'مۇھەببەت ھېكايىسى',
    titleCn: '爱情故事',
    description: 'رومانتىك مۇھەببەت كىنوسى، كۆز يېشى قىلىشىڭىز مۇمكىن.',
    descriptionCn: '浪漫爱情电影，可能会让你流泪。',
    category: 'kino',
    thumbnail: 'https://images.unsplash.com/photo-1518676590747-1e3dcf5a4e32?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: '01:50:00',
    views: 31000,
    isFeatured: false,
    year: 2023,
    director: 'گۈلنار ئوسمان',
    tags: ['مۇھەببەت', 'رومانتىك', 'كىنو'],
    rating: 4.3,
    ratingCount: 167,
    createdAt: '2024-06-01T11:20:00.000Z'
  },
  {
    id: 7,
    title: 'بالىلار ئانىمىسىيەسى',
    titleCn: '儿童动画',
    description: 'بالىلارنىڭ ياقتۇرىدىغان ئانىمىسىيە فىلىمى.',
    descriptionCn: '孩子们喜欢的动画电影。',
    category: 'animation',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: '01:25:00',
    views: 42000,
    isFeatured: true,
    year: 2024,
    director: 'ئابدۇرېھىم خۇدايى',
    tags: ['ئانىمىسىيە', 'بالىلار', 'كۆڭۈللۈك'],
    rating: 4.9,
    ratingCount: 445,
    createdAt: '2024-07-18T13:00:00.000Z'
  },
  {
    id: 8,
    title: 'كۈلدۈرگە كېچىلىكى',
    titleCn: '搞笑之夜',
    description: 'كۈلدۈرگە ئارتىسلىرىنىڭ مەيداندا ئويۇنى.',
    descriptionCn: '搞笑演员的现场表演。',
    category: 'comedy',
    thumbnail: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '01:10:00',
    views: 15800,
    isFeatured: false,
    year: 2024,
    director: 'نۇرمەمەت تۇرسۇن',
    tags: ['كومىدىيە', 'مەيدان', 'كۈلدۈرگە'],
    rating: 3.8,
    ratingCount: 54,
    createdAt: '2024-08-22T19:30:00.000Z'
  },
  {
    id: 9,
    title: 'شىنجاڭ گۈزەللىكى',
    titleCn: '新疆之美',
    description: 'شىنجاڭنىڭ گۈزەل مەنزىرىلىرى ۋە مەدەنىيىتى.',
    descriptionCn: '新疆的美丽风景和文化。',
    category: 'documentary',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    duration: '00:55:00',
    views: 9600,
    isFeatured: false,
    year: 2023,
    director: 'ئايشەم ئىسمايىل',
    tags: ['سەنئەت', 'شىنجاڭ', 'مەدەنىيەت'],
    rating: 4.6,
    ratingCount: 189,
    createdAt: '2024-09-05T07:00:00.000Z'
  },
  {
    id: 10,
    title: 'يېڭى ناخشا',
    titleCn: '新歌',
    description: 'يېڭىدىن چىققان ئۇيغۇر ناخشىسى.',
    descriptionCn: '最新发布的维吾尔歌曲。',
    category: 'music',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: '00:04:15',
    views: 67000,
    isFeatured: true,
    year: 2024,
    director: 'ئەكرەم روزى',
    tags: ['مۇزىكا', 'ناخشا', 'يېڭى'],
    rating: 4.4,
    ratingCount: 278,
    createdAt: '2024-10-10T20:00:00.000Z'
  }
]

// --- Categories ---
let categories = [
  { id: 1, name: 'kino', nameUy: 'كىنو', nameCn: '电影' },
  { id: 2, name: 'serial', nameUy: 'سېرىال', nameCn: '电视剧' },
  { id: 3, name: 'music', nameUy: 'مۇزىكا', nameCn: '音乐' },
  { id: 4, name: 'comedy', nameUy: 'كومىدىيە', nameCn: '喜剧' },
  { id: 5, name: 'documentary', nameUy: 'سەنئەت', nameCn: '纪录片' },
  { id: 6, name: 'animation', nameUy: 'ئانىمىسىيە', nameCn: '动画' }
]

// --- Sliders ---
let sliders = [
  {
    id: 1,
    title: 'ئاخىرقى كىنولار',
    titleCn: '最新电影',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=500&fit=crop',
    videoId: 1
  },
  {
    id: 2,
    title: 'ماھىر سېرىاللار',
    titleCn: '热门剧集',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=500&fit=crop',
    videoId: 2
  },
  {
    id: 3,
    title: 'بالىلار ئانىمىسىيەسى',
    titleCn: '儿童动画',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=500&fit=crop',
    videoId: 7
  }
]

// --- Comments (keyed by video id) ---
let comments = {
  1: [
    { id: 1, text: 'بەك ياخشى كىنو!', author: 'ئابدۇللا', createdAt: '2024-06-01T10:00:00.000Z' },
    { id: 2, text: 'كۆرۈپ بولدۇم، بەك تەسىرلىك', author: 'مەريەم', createdAt: '2024-06-02T15:30:00.000Z' }
  ],
  3: [
    { id: 3, text: 'ناخشىسى بەك چىرايلىق', author: 'رەشىد', createdAt: '2024-07-15T20:00:00.000Z' }
  ]
}

// --- Favorites ---
let favorites = [
  { videoId: 1, addedAt: '2024-05-10T08:00:00.000Z' },
  { videoId: 3, addedAt: '2024-05-12T14:00:00.000Z' },
  { videoId: 7, addedAt: '2024-06-01T09:00:00.000Z' }
]

// --- Watch History ---
let watchHistory = [
  { videoId: 1, watchedAt: '2024-06-01T10:00:00.000Z' },
  { videoId: 2, watchedAt: '2024-06-02T11:30:00.000Z' },
  { videoId: 5, watchedAt: '2024-06-03T16:00:00.000Z' }
]

// --- Auto-increment counters ---
let nextVideoId = 11
let nextCategoryId = 7
let nextSliderId = 4
let nextCommentId = 4

// ============================================================
// Admin credentials (hardcoded for demo)
// ============================================================
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 10)

// ============================================================
// JWT Authentication Middleware
// ============================================================

function generateToken(username) {
  return jwt.sign(
    { username, role: 'admin', iat: Date.now() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '访问被拒绝，缺少认证令牌' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '认证令牌已过期，请重新登录' })
    }
    return res.status(403).json({ error: '认证令牌无效' })
  }
}

// ============================================================
// Helper: safe parse int
// ============================================================
function toInt(val, fallback = 0) {
  const n = parseInt(val, 10)
  return Number.isNaN(n) ? fallback : n
}

// ============================================================
// 1. AUTH API
// ============================================================

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' })
  }

  if (username !== ADMIN_USERNAME || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }

  const token = generateToken(username)
  res.json({
    message: '登录成功',
    token,
    user: { username, role: 'admin' }
  })
})

// ============================================================
// 2. HEALTH CHECK
// ============================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    message: 'QaraKino Server is running!',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

// ============================================================
// 3. VIDEO CRUD API
// ============================================================

app.get('/api/videos', (req, res) => {
  try {
    const { category, search, featured } = req.query
    let filtered = [...videos]

    if (category) {
      filtered = filtered.filter(v => v.category === category)
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(q) ||
        (v.titleCn && v.titleCn.toLowerCase().includes(q)) ||
        (v.description && v.description.toLowerCase().includes(q)) ||
        (v.descriptionCn && v.descriptionCn.toLowerCase().includes(q)) ||
        (v.director && v.director.toLowerCase().includes(q)) ||
        (v.tags && v.tags.some(t => t.toLowerCase().includes(q)))
      )
    }
    if (featured === 'true') {
      filtered = filtered.filter(v => v.isFeatured)
    }

    res.json(filtered)
  } catch (err) {
    res.status(500).json({ error: '获取视频列表失败', detail: err.message })
  }
})

app.get('/api/videos/:id', (req, res) => {
  try {
    const video = videos.find(v => v.id === toInt(req.params.id))
    if (!video) {
      return res.status(404).json({ error: '视频不存在' })
    }
    video.views = (video.views || 0) + 1
    const videoComments = comments[video.id] || []

    res.json({
      ...video,
      comments: videoComments,
      averageRating: video.rating || 0,
      ratingCount: video.ratingCount || 0
    })
  } catch (err) {
    res.status(500).json({ error: '获取视频详情失败', detail: err.message })
  }
})

app.post('/api/videos', authenticateToken, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), (req, res) => {
  try {
    const {
      title, titleCn, description, descriptionCn,
      category, isFeatured, duration, year, director, tags
    } = req.body

    if (!title) {
      return res.status(400).json({ error: '视频标题不能为空' })
    }

    const newVideo = {
      id: nextVideoId++,
      title,
      titleCn: titleCn || '',
      description: description || '',
      descriptionCn: descriptionCn || '',
      category: category || 'kino',
      isFeatured: isFeatured === 'true',
      duration: duration || '00:00',
      year: year ? toInt(year) : new Date().getFullYear(),
      director: director || '',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      thumbnail: req.files?.thumbnail?.[0]
        ? `/uploads/thumbnails/${req.files.thumbnail[0].filename}`
        : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
      videoUrl: req.files?.video?.[0]
        ? `/uploads/videos/${req.files.video[0].filename}`
        : '',
      views: 0,
      rating: 0,
      ratingCount: 0,
      createdAt: new Date().toISOString()
    }

    videos.unshift(newVideo)
    res.status(201).json(newVideo)
  } catch (err) {
    res.status(500).json({ error: '创建视频失败', detail: err.message })
  }
})

app.put('/api/videos/:id', authenticateToken, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), (req, res) => {
  try {
    const index = videos.findIndex(v => v.id === toInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ error: '视频不存在' })
    }

    const {
      title, titleCn, description, descriptionCn,
      category, isFeatured, duration, year, director, tags
    } = req.body

    videos[index] = {
      ...videos[index],
      title: title || videos[index].title,
      titleCn: titleCn !== undefined ? titleCn : videos[index].titleCn,
      description: description !== undefined ? description : videos[index].description,
      descriptionCn: descriptionCn !== undefined ? descriptionCn : videos[index].descriptionCn,
      category: category || videos[index].category,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : videos[index].isFeatured,
      duration: duration || videos[index].duration,
      year: year ? toInt(year) : videos[index].year,
      director: director !== undefined ? director : videos[index].director,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : videos[index].tags,
      thumbnail: req.files?.thumbnail?.[0]
        ? `/uploads/thumbnails/${req.files.thumbnail[0].filename}`
        : videos[index].thumbnail,
      videoUrl: req.files?.video?.[0]
        ? `/uploads/videos/${req.files.video[0].filename}`
        : videos[index].videoUrl
    }

    res.json(videos[index])
  } catch (err) {
    res.status(500).json({ error: '更新视频失败', detail: err.message })
  }
})

app.delete('/api/videos/:id', authenticateToken, (req, res) => {
  try {
    const index = videos.findIndex(v => v.id === toInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ error: '视频不存在' })
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

    delete comments[deleted.id]
    favorites = favorites.filter(f => f.videoId !== deleted.id)
    watchHistory = watchHistory.filter(h => h.videoId !== deleted.id)

    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: '删除视频失败', detail: err.message })
  }
})

// ============================================================
// 4. VIDEO RATING
// ============================================================

app.post('/api/videos/:id/rate', (req, res) => {
  try {
    const video = videos.find(v => v.id === toInt(req.params.id))
    if (!video) {
      return res.status(404).json({ error: '视频不存在' })
    }

    const { rating } = req.body
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: '评分必须在 1 到 5 之间' })
    }

    const currentTotal = (video.rating || 0) * (video.ratingCount || 0)
    const newCount = (video.ratingCount || 0) + 1
    video.rating = Math.round(((currentTotal + rating) / newCount) * 10) / 10
    video.ratingCount = newCount

    res.json({
      message: '评分成功',
      averageRating: video.rating,
      ratingCount: video.ratingCount
    })
  } catch (err) {
    res.status(500).json({ error: '评分失败', detail: err.message })
  }
})

// ============================================================
// 5. COMMENTS API
// ============================================================

app.get('/api/videos/:id/comments', (req, res) => {
  try {
    const videoId = toInt(req.params.id)
    const video = videos.find(v => v.id === videoId)
    if (!video) {
      return res.status(404).json({ error: '视频不存在' })
    }

    const videoComments = comments[videoId] || []
    res.json(videoComments)
  } catch (err) {
    res.status(500).json({ error: '获取评论失败', detail: err.message })
  }
})

app.post('/api/videos/:id/comments', (req, res) => {
  try {
    const videoId = toInt(req.params.id)
    const video = videos.find(v => v.id === videoId)
    if (!video) {
      return res.status(404).json({ error: '视频不存在' })
    }

    const { text, author } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ error: '评论内容不能为空' })
    }

    const newComment = {
      id: nextCommentId++,
      text: text.trim(),
      author: author || 'ئىسىمسىز',
      createdAt: new Date().toISOString()
    }

    if (!comments[videoId]) {
      comments[videoId] = []
    }
    comments[videoId].push(newComment)

    res.status(201).json(newComment)
  } catch (err) {
    res.status(500).json({ error: '发表评论失败', detail: err.message })
  }
})

// ============================================================
// 6. FAVORITES API
// ============================================================

app.get('/api/favorites', (req, res) => {
  try {
    const favoriteVideos = favorites
      .map(f => {
        const video = videos.find(v => v.id === f.videoId)
        if (!video) return null
        return { ...video, addedAt: f.addedAt }
      })
      .filter(Boolean)

    res.json(favoriteVideos)
  } catch (err) {
    res.status(500).json({ error: '获取收藏列表失败', detail: err.message })
  }
})

app.post('/api/favorites/:videoId', (req, res) => {
  try {
    const videoId = toInt(req.params.videoId)
    const video = videos.find(v => v.id === videoId)
    if (!video) {
      return res.status(404).json({ error: '视频不存在' })
    }

    const exists = favorites.find(f => f.videoId === videoId)
    if (exists) {
      return res.status(409).json({ error: '该视频已在收藏列表中' })
    }

    const newFavorite = {
      videoId,
      addedAt: new Date().toISOString()
    }
    favorites.push(newFavorite)

    res.status(201).json({ message: '收藏成功', favorite: newFavorite })
  } catch (err) {
    res.status(500).json({ error: '收藏失败', detail: err.message })
  }
})

app.delete('/api/favorites/:videoId', (req, res) => {
  try {
    const videoId = toInt(req.params.videoId)
    const index = favorites.findIndex(f => f.videoId === videoId)
    if (index === -1) {
      return res.status(404).json({ error: '该视频不在收藏列表中' })
    }

    favorites.splice(index, 1)
    res.json({ message: '取消收藏成功' })
  } catch (err) {
    res.status(500).json({ error: '取消收藏失败', detail: err.message })
  }
})

// ============================================================
// 7. WATCH HISTORY API
// ============================================================

app.get('/api/history', (req, res) => {
  try {
    const historyWithDetails = watchHistory
      .map(h => {
        const video = videos.find(v => v.id === h.videoId)
        if (!video) return null
        return { ...video, watchedAt: h.watchedAt }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))

    res.json(historyWithDetails)
  } catch (err) {
    res.status(500).json({ error: '获取观看历史失败', detail: err.message })
  }
})

app.post('/api/history/:videoId', (req, res) => {
  try {
    const videoId = toInt(req.params.videoId)
    const video = videos.find(v => v.id === videoId)
    if (!video) {
      return res.status(404).json({ error: '视频不存在' })
    }

    watchHistory = watchHistory.filter(h => h.videoId !== videoId)

    watchHistory.push({
      videoId,
      watchedAt: new Date().toISOString()
    })

    res.status(201).json({ message: '观看记录已保存' })
  } catch (err) {
    res.status(500).json({ error: '记录观看历史失败', detail: err.message })
  }
})

// ============================================================
// 8. ENHANCED SEARCH API
// ============================================================

app.get('/api/search', (req, res) => {
  try {
    const { q, category, sort, page, limit } = req.query
    const currentPage = Math.max(toInt(page, 1), 1)
    const currentLimit = Math.min(Math.max(toInt(limit, 12), 1), 100)

    let results = [...videos]

    if (q) {
      const keyword = q.toLowerCase()
      results = results.filter(v =>
        v.title.toLowerCase().includes(keyword) ||
        (v.titleCn && v.titleCn.toLowerCase().includes(keyword)) ||
        (v.description && v.description.toLowerCase().includes(keyword)) ||
        (v.descriptionCn && v.descriptionCn.toLowerCase().includes(keyword)) ||
        (v.director && v.director.toLowerCase().includes(keyword)) ||
        (v.tags && v.tags.some(t => t.toLowerCase().includes(keyword)))
      )
    }

    if (category) {
      results = results.filter(v => v.category === category)
    }

    switch (sort) {
      case 'views':
        results.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'date':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    const total = results.length
    const totalPages = Math.ceil(total / currentLimit)
    const startIndex = (currentPage - 1) * currentLimit
    const paginatedResults = results.slice(startIndex, startIndex + currentLimit)

    res.json({
      results: paginatedResults,
      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages
      }
    })
  } catch (err) {
    res.status(500).json({ error: '搜索失败', detail: err.message })
  }
})

// ============================================================
// 9. CATEGORY CRUD API
// ============================================================

app.get('/api/categories', (req, res) => {
  try {
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: '获取分类列表失败', detail: err.message })
  }
})

app.post('/api/categories', authenticateToken, (req, res) => {
  try {
    const { name, nameUy, nameCn } = req.body
    if (!name) {
      return res.status(400).json({ error: '分类名称不能为空' })
    }

    const exists = categories.find(c => c.name === name)
    if (exists) {
      return res.status(409).json({ error: '该分类已存在' })
    }

    const newCategory = {
      id: nextCategoryId++,
      name,
      nameUy: nameUy || '',
      nameCn: nameCn || ''
    }
    categories.push(newCategory)
    res.status(201).json(newCategory)
  } catch (err) {
    res.status(500).json({ error: '创建分类失败', detail: err.message })
  }
})

app.put('/api/categories/:id', authenticateToken, (req, res) => {
  try {
    const index = categories.findIndex(c => c.id === toInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ error: '分类不存在' })
    }

    const { name, nameUy, nameCn } = req.body
    categories[index] = {
      ...categories[index],
      name: name || categories[index].name,
      nameUy: nameUy !== undefined ? nameUy : categories[index].nameUy,
      nameCn: nameCn !== undefined ? nameCn : categories[index].nameCn
    }

    res.json(categories[index])
  } catch (err) {
    res.status(500).json({ error: '更新分类失败', detail: err.message })
  }
})

app.delete('/api/categories/:id', authenticateToken, (req, res) => {
  try {
    const index = categories.findIndex(c => c.id === toInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ error: '分类不存在' })
    }
    categories.splice(index, 1)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: '删除分类失败', detail: err.message })
  }
})

// ============================================================
// 10. SLIDER CRUD API
// ============================================================

app.get('/api/sliders', (req, res) => {
  try {
    res.json(sliders)
  } catch (err) {
    res.status(500).json({ error: '获取轮播图列表失败', detail: err.message })
  }
})

app.post('/api/sliders', authenticateToken, (req, res) => {
  try {
    const { title, titleCn, image, videoId } = req.body
    if (!title || !image) {
      return res.status(400).json({ error: '轮播图标题和图片不能为空' })
    }

    const newSlider = {
      id: nextSliderId++,
      title,
      titleCn: titleCn || '',
      image,
      videoId: videoId ? toInt(videoId) : null
    }
    sliders.push(newSlider)
    res.status(201).json(newSlider)
  } catch (err) {
    res.status(500).json({ error: '创建轮播图失败', detail: err.message })
  }
})

app.put('/api/sliders/:id', authenticateToken, (req, res) => {
  try {
    const index = sliders.findIndex(s => s.id === toInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ error: '轮播图不存在' })
    }

    const { title, titleCn, image, videoId } = req.body
    sliders[index] = {
      ...sliders[index],
      title: title || sliders[index].title,
      titleCn: titleCn !== undefined ? titleCn : sliders[index].titleCn,
      image: image || sliders[index].image,
      videoId: videoId !== undefined ? (videoId ? toInt(videoId) : null) : sliders[index].videoId
    }

    res.json(sliders[index])
  } catch (err) {
    res.status(500).json({ error: '更新轮播图失败', detail: err.message })
  }
})

app.delete('/api/sliders/:id', authenticateToken, (req, res) => {
  try {
    const index = sliders.findIndex(s => s.id === toInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ error: '轮播图不存在' })
    }
    sliders.splice(index, 1)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: '删除轮播图失败', detail: err.message })
  }
})

// ============================================================
// 11. ENHANCED STATS API
// ============================================================

app.get('/api/stats', (req, res) => {
  try {
    const totalComments = Object.values(comments).reduce(
      (sum, arr) => sum + arr.length, 0
    )

    res.json({
      totalVideos: videos.length,
      totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0),
      totalCategories: categories.length,
      featuredVideos: videos.filter(v => v.isFeatured).length,
      totalComments,
      totalFavorites: favorites.length,
      totalHistoryItems: watchHistory.length
    })
  } catch (err) {
    res.status(500).json({ error: '获取统计数据失败', detail: err.message })
  }
})

// ============================================================
// STATIC FILE SERVING (must be after API routes)
// ============================================================

// Admin panel - served at /admin/
app.use('/admin', express.static(adminDist))

// SPA fallback for admin: any /admin/* request that isn't a file -> index.html
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminDist, 'index.html'))
})

// Client frontend - served at root /
app.use(express.static(clientDist))

// SPA fallback for client: any non-API, non-file request -> index.html
app.get('*', (req, res) => {
  // Skip API routes and admin routes (already handled above)
  if (req.path.startsWith('/api') || req.path.startsWith('/admin') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ error: `路由不存在: ${req.method} ${req.originalUrl}` })
  }
  res.sendFile(path.join(clientDist, 'index.html'))
})

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use((err, req, res, _next) => {
  console.error(`[QaraKino Error] ${new Date().toISOString()} - ${err.message}`)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: '文件大小超出限制（最大 500MB）' })
    }
    return res.status(400).json({ error: `文件上传错误: ${err.message}` })
  }
  res.status(500).json({ error: '服务器内部错误', detail: err.message })
})

// ============================================================
// Server startup
// ============================================================
app.listen(PORT, () => {
  console.log(`\n========================================`)
  console.log(`  QaraKino Unified Server v2.0.0`)
  console.log(`========================================`)
  console.log(`  Server:    http://localhost:${PORT}`)
  console.log(`  Client:    http://localhost:${PORT}/`)
  console.log(`  Admin:     http://localhost:${PORT}/admin/`)
  console.log(`  API:       http://localhost:${PORT}/api/`)
  console.log(`  Health:    http://localhost:${PORT}/api/health`)
  console.log(`  Videos:    ${videos.length} loaded`)
  console.log(`  Categories: ${categories.length} loaded`)
  console.log(`  Sliders:   ${sliders.length} loaded`)
  console.log(`========================================\n`)
})
