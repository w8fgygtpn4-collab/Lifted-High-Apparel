const images = {
 'photo-1472396961693-142e6e269027':'forest',
 'photo-1448375240586-882707db888b':'forest',
 'photo-1464822759023-fed622ff2c3b':'mountains',
 'photo-1470252649378-9c29740c9fa8':'valley',
 'photo-1470770841072-f978cf4d019e':'lake',
 'photo-1441974231531-c6227db76b6e':'wilderness'
};
export const photo = id => `/images/${images[id] || 'wilderness'}.webp`;
export const collections = [
 {slug:'rooted',name:'ROOTED',tagline:'Stand firm. Grow deep.',verse:'Colossians 2:7',description:'Grounded in Christ. Growing into who we’re called to be.',image:photo('photo-1448375240586-882707db888b')},
 {slug:'mountains',name:'MOUNTAINS',tagline:'Faith for the climb.',verse:'Matthew 17:20',description:'For the uphill days, the open trails, and the faith that carries us.',image:photo('photo-1464822759023-fed622ff2c3b')},
 {slug:'made-new',name:'MADE NEW',tagline:'A new day. A new creation.',verse:'2 Corinthians 5:17',description:'A reminder that your story is still unfolding. Made new. Made with purpose.',image:photo('photo-1470252649378-9c29740c9fa8')}
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
