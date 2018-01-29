var vid = document.getElementById('vid');
var chart = document.getElementById('chart');
var currentTime = document.getElementById('currentTime');
var existingRanges = [];
var timeline = document.getElementById("timeline");
var timelineWrapper = document.getElementById("timeline-wrapper");
var sliderWrapper = document.getElementById("slider-wrapper");
var btn_play = document.getElementById("btn_play");
var bar = document.getElementById("myBar");
var pseudo = document.getElementById("pseudoTimeline");
var width = 11 * (vid.clientWidth / 12);
var height = sliderWrapper.clientHeight;
var array = []

$( document ).ready(function() {
  // bar.width = 0;
  // vid.volume = 0.5
  // drawBar();
  // showIndicator();
  // post(5);
});
window.onload = function () {
  console.log("onloadされました.")
  bar.width = 0;
  vid.volume = 0.5
  drawBar();
  showIndicator();
  post(5);
}; 
vid.ondurationchange = function() {
  console.log("durationが変更されました.")
  bar.width = 0;
  vid.volume = 0.5
  drawBar();
  showIndicator();
  post(5);
};
$(window).resize(function(){
  console.log("resizeされました．")
  drawBar();
  drawHeatmap();
});

function drawBar(){
  console.log(vid.clientWidth)
  width = 11 * (vid.clientWidth / 12);
  height = sliderWrapper.clientHeight;
  console.log(width)
  console.log(height)
  timeline.width = width;
  timeline.height = height;

  bar.height = height;

  pseudo.width = width;
  pseudo.height = height;
}

btn_play.addEventListener("click", video_play, false);
function video_play(){
  if(vid.paused) {
    vid.play()
    btn_play.src = "img/btn_pause.png"
  } else {
    vid.pause()
    btn_play.src = "img/btn_play.png"

  }
}

setInterval("update()", 10);

// Videoが再生中に飛んでくるイベント
// vid.addEventListener("timeupdate", update, false);
function update () {
  var c = vid.currentTime;
  var d = vid.duration;
  var per = c / d;
  // console.log(per+"%再生中");
  bar.width = per * width; 
  bar.height = height;
}

function onClick(e) {
    /*
     * rectでcanvasの絶対座標位置を取得し、
     * クリック座標であるe.clientX,e.clientYからその分を引く
     * ※クリック座標はdocumentからの位置を返すため
     * ※rectはスクロール量によって値が変わるので、onClick()内でつど定義
     */
    var rect = e.target.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    vid.currentTime = vid.duration * (x / width)
}
pseudo.addEventListener('click', onClick, false);

$("#vUiSlider").slider({
   orientation: "vertical",
   range:"min",
   max:10,
   value:5,
   animate: true,
     slide: function( event, ui ) {
         $( "#slideValue" ).text(ui.value);
     }
 });

$("#vUiSlider").slider({
    change: function(event, ui) { 
        console.log(ui.value);
        showIndicator();
        post(ui.value);
    } 
 });

$("#volumeSlider").slider({
   range: "min",
   max:10,
   value:5,
   animate: true,
 });

$("#volumeSlider").slider({
    change: function(event, ui) { 
        changeVolume(ui.value);
    } 
 });

function changeVolume(value){
  vid.volume = value / 10;
}

function drawHeatmap(){
  var ctc = timeline.getContext("2d");
  ctc.clearRect(0, 0, width, height);
  console.log("array",array)
  console.log(vid.duration)
  for (var i = 0; i < array.length; i++){
      start = (array[i] / vid.duration) * width
      // console.log(start, height)
      ctc.beginPath();
      ctc.moveTo(start, 0);
      ctc.lineTo(start, height);
      ctc.lineWidth = 2;
      ctc.strokeStyle = "#f00"
      ctc.globalAlpha = 0.1;
      ctc.stroke();
  };
}

function showIndicator() {
  $('#indicator').tiktok({
      type: 'popload',
      content : {
        'title':'Please Wait...',
        'content':'Please reload if loading takes more than 1 minute.'
      }
    });
  $('#indicator').tiktok('show');
}

function hideIndicator(){
   $('#indicator').tiktok('hide');
   drawHeatmap()
}

function post(value){
  console.log("Posting")
  var json = {};
  json.threshold = value;
  var xhr = new XMLHttpRequest();
  // xhr.open('POST', 'http://localhost:8050/upload_file', true);
  xhr.open('POST', 'http://iuidemo.japaneast.cloudapp.azure.com:8050/upload_file', true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(json));
  console.log(xhr)
  xhr.onloadstart = function() {
    console.log("通信開始")
  }
  xhr.onload = function(e) {  
      // console.log(this.response);
      var data = JSON.parse(xhr.responseText);
      // console.log(data["times"])
      array = data["times"]
      setTimeout(hideIndicator,1000);
  }
  xhr.onerror = function() {
      console.log("通信エラー")
  }
   xhr.onabort = function() {
      console.log("Abort")
  }
  xhr.ontimeout = function() {
      console.log("タイムアウト")
  }
}

// Get the modal
var modal = document.getElementById('myModal');
var img = document.getElementById('myImg');
var img2 = document.getElementById('myImg2');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
}
img2.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
}


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
    modal.style.display = "none";
}

