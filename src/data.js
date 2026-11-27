export const brandPhotos = {
  hero: { src: '/images/dawn-overlook.webp', alt: 'A hiker overlooking an evergreen valley at dawn' },
  storyPreview: { src: '/images/lakeside-pause.webp', alt: 'A backpacker resting on a boulder beside a quiet lake' },
  story: { src: '/images/woodland-walk.webp', alt: 'Two hikers walking through sunlit woods' },
  gallery: [
    { src: '/images/valley-dawn.webp', alt: 'Morning mist over a valley of evergreens' },
    { src: '/images/camp-mug.webp', alt: 'Hands pouring a warm drink into a camping mug' },
    { src: '/images/fern-detail.webp', alt: 'Dew on green ferns in the shade' },
    { src: '/images/ridge-walk.webp', alt: 'Two friends walking along an open ridgeline' },
  ],
};

export const collections = [
  {
    slug: 'rooted', name: 'ROOTED', verse: 'Colossians 2:7',
    description: 'Everyday pieces that remind you to stay grounded in Christ as you grow.',
    image: '/images/cedar-roots.webp', imageAlt: 'Exposed cedar roots and ferns on the forest floor',
  },
  {
    slug: 'mountains', name: 'MOUNTAINS', verse: 'Matthew 17:20',
    description: 'Outdoor-inspired pieces for the open trail and the days that ask you to trust God uphill.',
    image: '/images/alpine-climb.webp', imageAlt: 'A hiker ascending a rocky ridge below an alpine peak',
  },
  {
    slug: 'made-new', name: 'MADE NEW', verse: '2 Corinthians 5:17',
    description: 'Pieces inspired by new life in Christ and the freedom to grow into who God made you to be.',
    image: '/images/morning-meadow.webp', imageAlt: 'Warm morning light spreading over a misty meadow',
  },
];
export let products = [
 {id:'rooted-heavyweight-tee',name:'Rooted Heavyweight Tee',price:34,collection:'rooted',type:'tee',color:'Moss',hex:'#626b4d',colors:['Moss','Bone','Washed black'],description:'A little reminder to grow deep. A relaxed, heavyweight cotton tee with a quiet, nature-inspired print.'},
 {id:'mountains-crewneck',name:'Mountains Crewneck',price:62,collection:'mountains',type:'sweatshirt',color:'Oat',hex:'#d9cdb6',colors:['Oat','Forest'],description:'Made for cool mornings and the long way home. An easygoing fleece crewneck inspired by a faith that stands firm.'},
 {id:'made-new-tee',name:'Made New Everyday Tee',price:32,collection:'made-new',type:'tee',color:'Faded clay',hex:'#bc8d73',colors:['Faded clay','Bone'],description:'New mercies. Everyday comfort. A soft cotton tee with a subtle sunrise graphic and an easy, lived-in fit.'},
 {id:'trail-cap',name:'The Everyday Trail Cap',price:28,collection:'mountains',type:'hat',color:'Forest',hex:'#354936',colors:['Forest','Sand'],description:'Your go-anywhere companion. An unstructured cotton cap with a small embroidered mountain mark.'},
 {id:'rooted-journal',name:'Rooted Field Journal',price:18,collection:'rooted',type:'journal',color:'Earth',hex:'#987354',colors:['Earth'],description:'Room for prayers, trail notes, and everything in between. A simple companion for a slower moment.'},
 {id:'made-new-blanket',name:'First Light Blanket',price:58,collection:'made-new',type:'blanket',color:'Sand',hex:'#c7b596',colors:['Sand'],description:'A soft layer for quiet mornings, campfire evenings, and wherever the day takes you.'},
 {id:'rooted-crewneck',name:'Be Still Crewneck',price:62,collection:'rooted',type:'sweatshirt',color:'Moss',hex:'#626b4d',colors:['Moss','Oat'],description:'Take a breath. A comfortable fleece layer with a simple reminder to be still.'},
 {id:'mountains-tee',name:'Stand Firm Tee',price:34,collection:'mountains',type:'tee',color:'Stone',hex:'#ada694',colors:['Stone','Forest'],description:'Built around a simple conviction. A relaxed cotton tee for everyday adventure.'}
];
export function setCatalog(next) { products = next; }
export const catalog = {list:()=>products,get:id=>products.find(p=>p.id===id),byCollection:slug=>products.filter(p=>p.memberships ? p.memberships.includes(slug) : p.collection===slug)};
