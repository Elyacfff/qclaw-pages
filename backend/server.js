import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

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
];

let categories = [
  { id: 1, name: 'kino', nameUy: 'كىنو', nameCn: '电影' },
  { id: 2, name: 'serial', nameUy: 'سېرىال', nameCn: '电视剧' },
  { id: 3, name: 'music', nameUy: 'مۇزىكا', nameCn: '音乐' },
  { id: 4, name: 'comedy', nameUy: 'كومىدىيە', nameCn: '喜剧' },
  { id: 5, name: 'documentary', nameUy: 'سەنئەت', nameCn: '纪录片' }
];

let sliders = [
  { id: 1, title: 'ئاخىرقى كىنولار', titleCn: '最新电影', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=500&fit=crop', videoId: 1 },
  { id: 2, title: 'ماھىر سېرىاللار', titleCn: '热门剧集', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=500&fit=crop', videoId: 2 }
];

let nextVideoId = 5;

app.get('/api/videos', (req, res) => {
  const { category, search, featured } = req.query;
  let filteredVideos = [...videos];

  if (category) {
    filteredVideos = filteredVideos.filter(v => v.category === category);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filteredVideos = filteredVideos.filter(v =>
      v.title.toLowerCase().includes(searchLower) ||
      v.titleCn.toLowerCase().includes(searchLower) ||
      v.description.toLowerCase().includes(searchLower)
    );
  }
  if (featured === 'true') {
    filteredVideos = filteredVideos.filter(v => v.isFeatured);
  }

  res.json(filteredVideos);
});

app.get('/api/videos/:id', (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id));
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  video.views = (video.views || 0) + 1;
  res.json(video);
});

app.post('/api/videos', upload.fields([{ name: 'thumbnail' }, { name: 'video' }]), (req, res) => {
  const { title, titleCn, description, descriptionCn, category, isFeatured, duration } = req.body;
  const thumbnail = req.files?.thumbnail?.[0];
  const video = req.files?.video?.[0];

  const newVideo = {
    id: nextVideoId++,
    title,
    titleCn,
    description,
    descriptionCn,
    category,
    isFeatured: isFeatured === 'true',
    duration: duration || '00:00',
    thumbnail: thumbnail ? `/uploads/${thumbnail.filename}` : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    videoUrl: video ? `/uploads/${video.filename}` : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    views: 0,
    createdAt: new Date().toISOString()
  };

  videos.unshift(newVideo);
  res.status(201).json(newVideo);
});

app.put('/api/videos/:id', upload.fields([{ name: 'thumbnail' }, { name: 'video' }]), (req, res) => {
  const index = videos.findIndex(v => v.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const { title, titleCn, description, descriptionCn, category, isFeatured, duration } = req.body;
  const thumbnail = req.files?.thumbnail?.[0];
  const video = req.files?.video?.[0];

  videos[index] = {
    ...videos[index],
    title: title || videos[index].title,
    titleCn: titleCn || videos[index].titleCn,
    description: description || videos[index].description,
    descriptionCn: descriptionCn || videos[index].descriptionCn,
    category: category || videos[index].category,
    isFeatured: isFeatured !== undefined ? isFeatured === 'true' : videos[index].isFeatured,
    duration: duration || videos[index].duration,
    thumbnail: thumbnail ? `/uploads/${thumbnail.filename}` : videos[index].thumbnail,
    videoUrl: video ? `/uploads/${video.filename}` : videos[index].videoUrl
  };

  res.json(videos[index]);
});

app.delete('/api/videos/:id', (req, res) => {
  const index = videos.findIndex(v => v.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Video not found' });
  }
  videos.splice(index, 1);
  res.status(204).send();
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const { name, nameUy, nameCn } = req.body;
  const newCategory = {
    id: Date.now(),
    name,
    nameUy,
    nameCn
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.delete('/api/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  categories.splice(index, 1);
  res.status(204).send();
});

app.get('/api/sliders', (req, res) => {
  res.json(sliders);
});

app.post('/api/sliders', (req, res) => {
  const { title, titleCn, image, videoId } = req.body;
  const newSlider = {
    id: Date.now(),
    title,
    titleCn,
    image,
    videoId: parseInt(videoId)
  };
  sliders.push(newSlider);
  res.status(201).json(newSlider);
});

app.delete('/api/sliders/:id', (req, res) => {
  const index = sliders.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Slider not found' });
  }
  sliders.splice(index, 1);
  res.status(204).send();
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalVideos: videos.length,
    totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0),
    totalCategories: categories.length,
    featuredVideos: videos.filter(v => v.isFeatured).length
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
