import html2Canvas from "html2canvas";
export function exportImg(dom, title) {
  html2Canvas(dom, {
    backgroundColor: "#ffffff", // 背景颜色
    // dpi: 96, // 将分辨率提高到特定的dpi,默认值为96
    allowTaint: true, // 开启跨域
    useCORS: true, // 是否尝试使用CORS从服务器加载图像(跨域)
    scrollY: 0, // Y轴偏移
    scrollX: 0, // X轴偏移
    scale: 2 // 用于渲染的比例尺。默认为浏览器设备像素比率。默认值是1，手机端设置成2
  }).then(canvas => {
    // 生成图片，设置导出质量（0-1）
    var imgURL = canvas.toDataURL("image/jpeg", 1.0);
    // 创建a标签，模拟点击下载
    const $a = document.createElement("a");
    $a.setAttribute("download", title);
    $a.href = imgURL;
    $a.click();
  });
}
