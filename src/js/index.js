import '../css/clearDefault.css'
import '../css/index.less'
import './jquery-3.4.1.min'
import data1 from '../data/list1.js'



// https://show.bilibili.com/api/ticket/search/sug?term=sz&platform=web

// 1.点击跳转
$(".mz").on("click", () => {
  $(".box1").css("display", "block")
  $(".box2").css("display", "none")
  $(".shopping").css("display", "none")
})
$(".logo").on("click", () => {
  $(".box1").css("display", "block")
  $(".box2").css("display", "none")
  $(".shopping").css("display", "none")
})
$(".zb").on("click", () => {
  $(".box1").css("display", "none")
  $(".box2").css("display", "block")
  $(".shopping").css("display", "none")
})
$(".order").on("click", () => {
  $(".box1").css("display", "none")
  $(".box2").css("display", "none")
  $(".shopping").css("display", "block")
})

// 2.加载card(时间筛选未完善)
var ct = "all", tp = "all"
filter(ct, tp)
function filter(city, type) {
  console.log(city, type);
  var list = []
  data1.forEach((item, index) => {
    if ((item.city == city || city == "all") && (item.type == type || type == "all")) {
      list.push(item)
    }
  });
  let str = ""
  list.forEach((item, index) => {
    str += `<li class="list-li-${index}">
      <div class="li_left">
      </div>
      <div class="li_right">
        <div class="list-title">${item.title}</div>
        <div class="list-item-time">
          <span class="time-icon"></span>
          <p>${item.time}</p>
        </div>
        <div class="list-item-address">
          <span class="address-icon"></span>
          <span class="city-name">${item.city}</span>
          <span class="name">${item.site}</span>
        </div>
        <div class="list-item-price">
          <div class="not-free">
            <span class="price-symbol">¥</span>
            <span class="price">${item.price}</span>
            <span class="start">起</span>
            <span class="promo-item">独家</span>
          </div>
        </div>
      </div>
    </li>`
  })
  $("ul.list-con").html(str)
}
$(".ul-1").on("click", 'li', (ev) => {
  let tar = ev.target
  tar.innerText == "全国" ? ct = "all" : ct = tar.innerText
  $(".ul-1>li").removeClass("color")
  $(tar).addClass("color")
  ct == "all" ? filter(ct, tp) : filter(ct + "市", tp)
})
$(".ul-2").on("click", 'li', (ev) => {
  let tar = ev.target
  tp = ["all", "live", "comicon", "show"][$(tar).index()]
  $(".ul-2>li").removeClass("color")
  $(tar).addClass("color")
  ct == "all" ? filter(ct, tp) : filter(ct + "市", tp)
})
$("div.citys").on("click", () => {
  alert("没写，但不难")
})

// 3.回到顶部
$('div.scroll-wrapper').on("click", () => {
  $('html , body').animate({ scrollTop: 0 }, 'slow');
});

// 4.商品列表筛选功能
$(".nav").on("click", () => {
  alert("QAQ...别点，不想写json数据了，写出来图片还用不了，我吐了")
})
// 5. 加入购物车

$("ul.box2-list").on("click", "div.gwc", function (ev) {
  let node = $(ev.target).parents("li")
  let n = node.index()
  // 将被点击的商品加入本地存储
  var goodsArr = [] //购物车商品数组
  if (localStorage.getItem("goods")) {
    goodsArr = JSON.parse(localStorage.getItem("goods"))
  }
  var isGood = false
  goodsArr.forEach((item, index) => { //查找本地存储内有无选中商品
    if (item.index == n) {
      item.num++; //有的话，选中商品数量进行更新
      isGood = true
    }
  })
  if (!isGood) {
    goodsArr.push({
      "checked": false,
      "index": n,
      "title": node.children("div.title").text(),
      "price": node.children("div.price").children("p").children("span.box2-pri-num").text(),
      "src": node.find("img")[0].src,
      "num": 1
    })
  }
  localStorage.setItem("goods", JSON.stringify(goodsArr))
  console.log(localStorage);
  loacl()
})
loacl()
// 5.5 读取本地存储
function loacl() {
  var data2 = JSON.parse(localStorage.getItem("goods"))
  console.log(data2);
  let str = ""
  data2.forEach((item, index) => {
    console.log(item.src);
    str+=`<li>
      <input type="checkbox" name="list" class="list-input">
      <div class="message">
        <div class="mes-left">
          <img src="${item.src}" alt="">
        </div>
        <div class="mes-right">
          <p>${item.title}</p>
        </div>
      </div>
      <div class="price">￥<span class="price-num">${item.price}</span></div>
      <div class="num">
        <button class="btn1">-</button>
        <input class="btn-input" type="text" value="${item.num}">
        <button class="btn2">+</button>
      </div>
      <div class="prices">￥<span class="prices-num">${parseInt(item.price) * parseInt(item.num)}</span></div>
    </li>`
  })
  $(".shop-list").html(str)
}
// 6.数据动态变化
function fun_num(node, val) {
  let num = parseInt(node.val())
  num += val
  if (num < 0) num = 0
  node.val(num)
  total()
}
function total(is) {
  let li_inp = document.querySelectorAll(".list-input")
  let span1 = document.querySelectorAll(".price-num")
  let span2 = document.querySelectorAll(".prices-num")
  let inps = document.querySelectorAll(".btn-input")
  let num = 0, money = 0
  // let arr = JSON.parse(localStorage.getItem("goods"))
  let new_arr = []
  for (let i = 0; i < span1.length; i++) {
    let x = parseFloat(span1[i].innerText)
    let y = parseInt(inps[i].value)
    let tit = document.querySelectorAll(".mes-right > p")
    if (parseInt(inps[i].value) == 0) {
      $(li_inp[i]).parent().remove()
    } else {
      // console.log(tit[i].innerText);
      new_arr.push({
        "checked": li_inp[i].checked,
        "title": tit[i].innerText,
        "price": span1[i].innerText,
        "num": parseInt(inps[i].value)
      })
      
    }
    span2[i].innerText = (x * y).toFixed(1)
    if (isall) li_inp[i].checked = true
    if (is && !isall) li_inp[i].checked = false
    if (li_inp[i].checked) {
      num += y
      money += x * y
    }
  }
  localStorage.setItem("goods", JSON.stringify(new_arr))
  document.querySelector("span#num").innerText = num
  document.querySelector("span#money").innerText = money.toFixed(1)
}
total()
$("ul.shop-list").on("change", "input.btn-input", function () {
  let n = parseInt($(this).val())
  if (n + "" == "NaN" || n < 0) n = 0
  $(this).val(n)
  total()
});
$("ul.shop-list").on("click", "button.btn1", function () {
  fun_num($(this).next(), -1)
});
$("ul.shop-list").on("click", "button.btn2", function () {
  fun_num($(this).prev(), 1)
});
$("ul.shop-list").on("click", "input.list-input", function () {
  isall = [...document.querySelectorAll("input.list-input")].every((item) => {
    return item.checked
  })
  document.querySelector("#qx1").checked = isall
  total()
});
var isall = false;
$("#qx1").on("click", () => {
  isall = $("#qx1").is(":checked")
  total(true)
})
$(".del").on("click", () => {
  let li_inp = document.querySelectorAll("input.list-input")
  for (let i = 0; i < li_inp.length; i++) {
    if (li_inp[i].checked) {
      $(li_inp[i]).parent().remove()
    }
  }
  total()
})