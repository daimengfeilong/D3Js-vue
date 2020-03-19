var infoWin;
var tableDom;
/**
 * 封装便捷的弹出框
 * @param {AMap.Map} map
 * @param {Array} event
 * @param {Object} content
 */
export function openInfoWin(map, event, content) {
  if (!infoWin) {
    infoWin = new AMap.InfoWindow({
      isCustom: true,  //使用自定义窗体
      offset: new AMap.Pixel(130, 100)
    });
  }

  var x = event.offsetX;
  var y = event.offsetY;
  var lngLat = map.containerToLngLat(new AMap.Pixel(x, y));

  if (!tableDom) {
    let infoDom = document.createElement('div');
    infoDom.className = 'info';
    tableDom = document.createElement('table');
    infoDom.appendChild(tableDom);
    infoWin.setContent(infoDom);
  }

  var trStr = '';
  for (var name in content) {
    var val = content[name];
    trStr +=
      '<tr>' +
      '<td class="label">' + name + '</td>' +
      '<td width="10">&nbsp;</td>' +
      '<td class="content">' + val + '</td>' +
      '</tr>'
  }

  tableDom.innerHTML = trStr;
  infoWin.open(map, lngLat);
}

export function closeInfoWin() {
  if (infoWin) {
    infoWin.close();
  }
}
