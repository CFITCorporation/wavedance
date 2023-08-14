- ## **WaveDance - CFIT示波器**
### **前言**
**互联网的万千矿藏里，**
**一首音乐被我发掘。**
**古老电音中节奏动感，**
**而它的波形更让人神迷。**
**立方体旋转于二维世界，**
**熟悉的余弦由疏向密。**
**华丽的图案，**
**却存活于示波器，**
**怎不徒生遗憾？**
**发掘wav的奥秘，**
**网页——**
**正是音频的跃动。**
**这首音乐，正是Oscillofunwave，本项目由此问世。[（由此下载该音频，可用于测试）](https://raw.gitmirror.com/CFITCorporation/cfitpic/main/oscillofun-wave.wav "由此下载该音频")**
**[演示视频由此查看](https://www.bilibili.com/video/BV1yz4y1v73L "演示视频由此查看")**
![wave01](https://img.suze666.top/i/2023/08/14/64d9b1610242b.png)
![wave02](https://img.suze666.top/i/2023/08/14/64d9b16239650.png)
****
### **简介**
**本项目由CFIT(CIT)编写，基于HTML5、JavaScript的FileReader对象以及Canvas属性实现。**
****
### **原理**
**主函数`change()`中核心部分如下：**
```javascript
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
```
**用户载入文件时，建立FileReader对象，确认音频长度，将二进制音频数据解码成可用的音频缓冲区。
`drawWaveform(buffer)`根据解码后的音频缓冲区数据绘制波形图。**

**波形绘制`drawWaveform`核心部分如下：**
```javascript
var i0 = 0,
    j0 = 0,
    cyl = 847; //每秒展示点数
datax = buffer.getChannelData(0); //双声道-x
datay = buffer.getChannelData(1); //双声道-y
/*省略部分代码*/
/*以下代码在一个定时器执行*/
if (j0 + cyl < Math.min(datax.length, datay.length)) {
    j0 = j0 + cyl; //更新进度
} else {
    i0 = 0;
    j0 = 0;
}
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
/**/
```
**该部分代码实现波形图的绘制逻辑。**

**代码先定义三个核心变量：**
- **`i0`表示当前展示的波形图起始点的索引位置。**
- **`j0`表示当前展示的波形图结束点的索引位置。**
- **`cyl`表示每秒展示的数据点数。**

**datax、datay从音频缓冲区中获取双声道-x和双声道-y的数据：**
**在定时器回调函数内部的逻辑如下：**
-  **检查`j0 + cyl`是否小于等于双声道数据的最小长度（即判断是否还有足够的数据可以展示）。**
- **如果满足条件，将`j0`更新为`j0 + cyl`，以便继续展示下一个时间段的数据；否则，重置`i0`和`j0`为0，重新开始展示波形图。**
-  **使用循环遍历从`i0`到`j0`之间的数据点，计算每个数据点在Canvas中的坐标（x和y）：**
   - **`x`的计算公式是 `(1 + datax[i]) / 2 * Math.min(height, width) - Math.min(height, width) / 2 + width / 2`，表示根据数据值确定x坐标位置。**
   - **`y`的计算公式是 `(1 + datay[i]) / 2 * Math.min(height, width) - Math.min(height, width) / 2 + height / 2`，表示根据数据值确定y坐标位置。**
-  **在循环中，根据当前点的位置，使用Canvas绘制函数（`fillRect`）在波形图上绘制一个小方块。**
**由此不断更新`i0`为`j0`，实现展示波形图的数据，最终实现音频波形图的展示效果。**
****
### **使用方法**
- **打开网页，自动展示控制台。**
![01](https://img.suze666.top/i/2023/08/14/64d9bd90b2e1f.png)
- **点击`文件载入`，载入文件。**
![02](https://img.suze666.top/i/2023/08/14/64d9bdf688848.png)
- **点击确定，即启动示波器。启动速度与文件大小有关，建议文件不要超过100MB,可能无法播放音频。₁**
![03](https://img.suze666.top/i/2023/08/14/64d9bea26729b.png)
**₂**
****
### **注意事项**
**₁ 文件过大，浏览器可能崩溃；同时，经过研究，发现当音频大于100MB时，代码行`readers.readAsDataURL(file)`返回值可能为空，无法播放。**
**₂ 本项目效果及函数均在浏览器进行，故效果优劣与使用浏览器性能有关。**
****