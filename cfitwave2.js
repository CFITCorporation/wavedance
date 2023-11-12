/*
CFITWave v1.0
(c) 2023 CFIT
https://github.com/CFITCorporation
*/
var fileInput = document.getElementById('fileInput');
var aud = document.getElementById('aud');
var bar = document.getElementById('bar');//进度条
var dragg = true;//保证拖动进度条时不受进度条进度的影响
var namemusic = document.getElementById('namemusic');//获取载入文件名称
var length = document.getElementById('length');//获取载入文件长度
var total = document.getElementById('total');//获取载入文件长度（时间格式化）
var tooldiv = document.getElementById('tooldiv');//控制台界面
var audioContext = new AudioContext();
var waveformCanvas = document.getElementById('waveformCanvas');//示波器画布
var canvasContext = waveformCanvas.getContext('2d');
waveformCanvas.height = window.innerHeight;
waveformCanvas.width = window.innerWidth;
var width = waveformCanvas.width;
var height = waveformCanvas.height;
canvasContext.beginPath();
canvasContext.fillStyle = 'lime';
canvasContext.beginPath();
//横竖线
canvasContext.setLineDash([1, 1]);
canvasContext.lineWidth = 0.4;
canvasContext.moveTo(width / 2 - Math.min(height, width) / 2, Math.min(height, width) / 2);
canvasContext.lineTo(width / 2 - Math.min(height, width) / 2 + Math.min(height, width), Math.min(height, width) / 2);
canvasContext.strokeStyle = "#cccccc";
canvasContext.stroke();

canvasContext.setLineDash([1, 1]);
canvasContext.beginPath();
canvasContext.lineWidth = 0.4;
canvasContext.moveTo(width / 2 - Math.min(height, width) / 2 + Math.min(height, width) / 2, 0);
canvasContext.lineTo(width / 2 - Math.min(height, width) / 2 + Math.min(height, width) / 2, Math.min(height, width));
canvasContext.strokeStyle = "#cccccc";
canvasContext.stroke();
/*进度条移动*/
function changeprogress() {
    dragg = false;
    length.innerHTML = exchange(bar.value);
    aud.currentTime = (bar.value / bar.max) * aud.duration;
    dragg = true;
}
var times = 0,
    method = "show";
setTimeout(function() {
    shoconsole();//展示控制台
}, 500);
/*判断控制台展示与否*/
function shohid() {
    times = times + 1;
    times % 2 == 0 ? hidconsole() : shoconsole();
}
/*隐藏控制台*/
function hidconsole() {
    method = 'hide';
    let hid = anime({
        targets: ".tooldiv",
        translateY: [-tooldiv.clientHeight + 30],
        duration: 2000
    });
}
/*展示控制台*/
function shoconsole() {
    method = "show";
    let hid = anime({
        targets: ".tooldiv",
        translateY: [0],
        duration: 2000
    });
}
/*窗体移动时对横纵线的调整*/
function resizes() {
    width = waveformCanvas.width;
    height = waveformCanvas.height;
    waveformCanvas.height = window.innerHeight;//重置高
    waveformCanvas.width = window.innerWidth;//重置宽
    canvasContext.beginPath();
    canvasContext.fillStyle = 'lime';
    canvasContext.beginPath();
    canvasContext.setLineDash([1, 1]);
    canvasContext.lineWidth = 0.4;
    canvasContext.moveTo(width / 2 - Math.min(height, width) / 2, height / 2);
    canvasContext.lineTo(width / 2 - Math.min(height, width) / 2 + Math.min(height, width), height / 2);
    canvasContext.strokeStyle = "#cccccc";
    canvasContext.stroke();
    canvasContext.setLineDash([1, 1]);
    canvasContext.beginPath();
    canvasContext.lineWidth = 0.4;
    canvasContext.moveTo(width / 2, height / 2 - Math.min(height, width) / 2);
    canvasContext.lineTo(width / 2, height / 2 - Math.min(height, width) / 2 + Math.min(height, width));
    canvasContext.strokeStyle = "#cccccc";
    canvasContext.stroke();
}
window.onresize = function() {
    resizes();
}
resizes();
aud.onended = function() {
    change();//结束，再来一遍
}
var docElm = document.body;
docElm.onfullscreenchange = function() {
    if (document.fullscreenElement) {
        tooldiv.style.display = "none";
    } else {
        tooldiv.style.display = "block";
    }
}

function fc() {//全屏
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else
    if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    } else
    if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    } else
    if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
}
document.onkeydown = function(e) {
	console.log(e.keyCode);
	if(e.keyCode!=27){fc();resizes();}
}
/*主函数*/
function change() {
    width = waveformCanvas.width;
    height = waveformCanvas.height;
    canvasContext.clearRect(0, 0, width, height);
    var file = fileInput.files[0];
    var readers = new FileReader();
    readers.readAsDataURL(file);
    console.log(file.name);
    namemusic.innerHTML = file.name;
    readers.onload = function() {
        aud.src = readers.result;
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function() {
            var dur;
            dur = isNaN(aud.duration) == true ? 1 : aud.duration;//无效音频文件默认长度1
            total.innerHTML = exchange(parseInt(dur));
            bar.max = dur;
            var audioData = reader.result;
            audioContext.decodeAudioData(audioData, buffer => {
                drawWaveform(buffer);//获取双声道及显示效果
            });
        }
    }
}
/*实时更新进度条*/
aud.ontimeupdate = function() {
    if (dragg == true) {
        bar.value = parseInt(aud.currentTime);
        length.innerHTML = exchange(parseInt(aud.currentTime));
    }
}
/*格式化时间*/
function exchange(index) {
    var s = index % 60;
    var m = parseInt(index / 60);
    var mch = m < 10 ? '0' + m.toString() : m.toString();
    var sch = s < 10 ? '0' + s.toString() : s.toString();
    var result = mch + ':' + sch;
    return result;
}
/*接收文件并执行主函数*/
fileInput.addEventListener('change', () => {
    change();
});
/*调整音频进度时，更新示波进度*/
aud.onseeked = function() {
    var dur = isNaN(aud.duration) == true ? 1 : aud.duration;
    j0 = parseInt((aud.currentTime / dur) * Math.min(datax.length, datay.length));
}
var ttt, tz;
var i0 = 0,
    j0 = 0,
    cyl = 847;//每秒展示点数
var datax, datay;
/*获取双声道及显示效果*/
function drawWaveform(buffer) {
    datax = buffer.getChannelData(0);//双声道-x
    datay = buffer.getChannelData(1);//双声道-y
    var width;
    var height;
    width = waveformCanvas.width;
    height = waveformCanvas.height;

    if (typeof(ttt) != 'undefined') {
        clearInterval(ttt);
        canvasContext.clearRect(0, 0, width, height);
        canvasContext.beginPath();
        canvasContext.strokeStyle = 'lime';
    }
    if (typeof(tz) != 'undefined') {
        clearInterval(tz);
    }
    canvasContext.clearRect(0, 0, width, height);
    canvasContext.beginPath();
    canvasContext.strokeStyle = 'green';
    aud.play();
    i0 = 0;
    j0 = 0;
    var dur;
    dur = isNaN(aud.duration) == true ? 1 : aud.duration;
    tz = setInterval(function() {//每隔5s调整音频进度，减少与示波器的误差
        dur = isNaN(aud.duration) == true ? 1 : aud.duration;
        aud.currentTime = (i0 / Math.min(datax.length, datay.length)) * dur;
    }, 5000);
    hidconsole();
    times = times + 1;
    ttt = setInterval(function() {
        dur = isNaN(aud.duration) == true ? 1 : aud.duration;
        bar.max = dur;
        total.innerHTML = exchange(parseInt(dur));
        width = waveformCanvas.width;
        height = waveformCanvas.height;
        canvasContext.clearRect(0, 0, width, height);
        resizes();
        canvasContext.beginPath();
        canvasContext.fillStyle = 'lime';
        canvasContext.beginPath();
        if (j0 + cyl < Math.min(datax.length, datay.length)) {
            j0 = j0 + cyl;//更新进度
        } else {
            i0 = 0;
            j0 = 0;
        } //clearInterval(ttt);}  
        for (var i = i0; i < j0; i++) {
            var x = (1 + datax[i]) / 2 * Math.min(height, width) - Math.min(height, width) / 2 + width / 2;
            var y = (1 + datay[i]) / 2 * Math.min(height, width) - Math.min(height, width) / 2 + height / 2;
            if (i == 0) {
                canvasContext.moveTo(width - x, y);
            } else {
                canvasContext.fillRect(width - x, y, 1.5, 1.5);
                //canvasContext.lineTo(width-x, y);
            }
        }
        i0 = j0;
        canvasContext.stroke();
    }, (Math.sin(i0 / cyl) + 1) * 1 / 2 + 17.59);//玄学Interval，可改动
}