const tracks = [
	{ title: 'SoundHelix Song 1', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', art: 'https://picsum.photos/seed/pixel1/64' },
	{ title: 'SoundHelix Song 2', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', art: 'https://picsum.photos/seed/pixel2/64' },
	{ title: 'SoundHelix Song 3', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', art: 'https://picsum.photos/seed/pixel3/64' }
];

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const currentEl = document.getElementById('current');
const durationEl = document.getElementById('duration');
const playlistEl = document.getElementById('playlist');
const titleEl = document.getElementById('track-title');
const artistEl = document.getElementById('track-artist');
const artEl = document.getElementById('art');
const volumeEl = document.getElementById('volume');
const shuffleBtn = document.getElementById('shuffle');
const loopBtn = document.getElementById('loop');

let index = 0;
let isPlaying = false;
let isShuffle = false;

function formatTime(s){
	if(!s || isNaN(s)) return '0:00';
	const m = Math.floor(s/60);
	const ss = Math.floor(s%60).toString().padStart(2,'0');
	return `${m}:${ss}`;
}

function loadTrack(i){
	index = (i+tracks.length)%tracks.length;
	const t = tracks[index];
	audio.src = t.src;
	titleEl.textContent = t.title;
	artistEl.textContent = t.artist;
	artEl.src = t.art;
	Array.from(playlistEl.children).forEach(li=>li.classList.remove('playing'));
	const li = playlistEl.querySelector(`[data-i='${index}']`);
	if(li) li.classList.add('playing');
}

function play(){ audio.play(); isPlaying = true; playBtn.textContent = '▮▮'; }
function pause(){ audio.pause(); isPlaying = false; playBtn.textContent = '▶'; }

function next(){
	if(isShuffle){
		let r = Math.floor(Math.random()*tracks.length);
		if(r===index) r = (r+1)%tracks.length;
		loadTrack(r);
	} else loadTrack(index+1);
	play();
}

function prev(){ loadTrack(index-1); play(); }

function populate(){
	tracks.forEach((t,i)=>{
		const li = document.createElement('li');
		li.dataset.i = i;
		li.tabIndex = 0;

		li.innerHTML = `
			<img src="${t.art}" alt="art">
			<div class="pl-meta">
				<div class="pl-title">${t.title}</div>
				<div class="pl-artist">${t.artist}</div>
			</div>
		`;

		li.addEventListener('click', ()=>{ loadTrack(i); play(); });
		li.addEventListener('keydown', (e)=>{ if(e.key==='Enter') { loadTrack(i); play(); } });
		playlistEl.appendChild(li);
	});
}

audio.addEventListener('timeupdate', ()=>{
	const pct = (audio.currentTime/audio.duration||0)*100;
	progressBar.style.width = pct + '%';
	currentEl.textContent = formatTime(audio.currentTime);
	durationEl.textContent = formatTime(audio.duration);
});

progress.addEventListener('click',(e)=>{
	const rect = progress.getBoundingClientRect();
	const p = (e.clientX - rect.left)/rect.width;
	audio.currentTime = p * audio.duration;
});

playBtn.addEventListener('click', ()=>{ isPlaying ? pause() : play(); });
nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

volumeEl.addEventListener('input', ()=>{ audio.volume = volumeEl.value; });

shuffleBtn.addEventListener('click', ()=>{ isShuffle = !isShuffle; shuffleBtn.style.opacity = isShuffle? '1':'0.6'; });
loopBtn.addEventListener('click', ()=>{ audio.loop = !audio.loop; loopBtn.style.opacity = audio.loop? '1':'0.6'; });

audio.addEventListener('ended', ()=>{ if(!audio.loop) next(); });

document.addEventListener('keydown', (e)=>{
	if(e.code==='Space'){ e.preventDefault(); isPlaying? pause():play(); }
	if(e.code==='ArrowRight') audio.currentTime = Math.min(audio.duration||0, (audio.currentTime||0)+5);
	if(e.code==='ArrowLeft') audio.currentTime = Math.max(0, (audio.currentTime||0)-5);
});

populate();
loadTrack(0);
audio.volume = volumeEl.value;

